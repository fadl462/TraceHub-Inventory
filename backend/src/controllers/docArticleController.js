const { Op } = require('sequelize');
const { DocArticle, DocReadProgress } = require('../models');
const { defaultDocArticles } = require('../seed/docArticles');

const SUPPORTED_LOCALES = ['en', 'fr', 'es'];
function normalizeLocale(raw) {
  return SUPPORTED_LOCALES.includes(raw) ? raw : 'en';
}

// Difficulty is assessed once, by slug, rather than duplicated across all
// 189 individual article rows (63 articles x 3 languages) - the same
// conceptual article carries the same difficulty regardless of which
// language it's being read in. Anything not listed here defaults to
// 'intermediate' rather than silently showing no badge.
const ADVANCED_SLUGS = new Set([
  'time-based-depreciation-methods', 'usage-based-depreciation-methods',
  'ai-adaptive-depreciation-in-depth', 'writing-custom-depreciation-formulas',
  'ai-insights-panel-detectors-explained',
]);
const INTERMEDIATE_SLUGS = new Set([
  'ai-engine-overview', 'smart-depreciation-engine', 'asset-health-score', 'failure-prediction-engine',
  'maintenance-scheduling-engine', 'disposal-intelligence-engine', 'ai-confidence-score-and-learning-loop',
  'understanding-risk-score', 'fleet-intelligence-formulas-explained', 'managing-tenant-companies',
  'cms-content-management', 'email-smtp-configuration', 'payment-flutterwave-configuration',
  'managing-plans-and-coupons', 'global-audit-log-and-security',
]);
function difficultyForSlug(slug) {
  if (ADVANCED_SLUGS.has(slug)) return 'advanced';
  if (INTERMEDIATE_SLUGS.has(slug)) return 'intermediate';
  return 'beginner';
}

// A real word count from the actual content, not a guessed/fixed number -
// strips HTML tags, splits on whitespace, divides by an average adult
// silent-reading speed (~200 wpm), rounded up so "1 min read" never shows
// for something that takes noticeably longer.
function estimateReadingMinutes(html) {
  const text = String(html || '').replace(/<[^>]*>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function ensureSeeded() {
  const count = await DocArticle.count();
  if (count === 0) {
    await DocArticle.bulkCreate(defaultDocArticles);
    return;
  }
  const existing = await DocArticle.findAll();
  const existingByKey = new Map(existing.map((a) => [`${a.slug}::${a.locale || 'en'}`, a]));
  const missing = defaultDocArticles.filter((a) => !existingByKey.has(`${a.slug}::${a.locale || 'en'}`));
  if (missing.length > 0) await DocArticle.bulkCreate(missing);

  // Content edits to these managed default articles should reach an
  // already-seeded database too, not just fresh installs - same pattern
  // used for the blog posts and legal CMS pages.
  await Promise.all(defaultDocArticles.map(async (a) => {
    const row = existingByKey.get(`${a.slug}::${a.locale || 'en'}`);
    if (!row) return;
    if (row.bodyHtml !== a.bodyHtml || row.excerpt !== a.excerpt || row.category !== a.category) {
      row.bodyHtml = a.bodyHtml;
      row.excerpt = a.excerpt;
      row.category = a.category;
      row.sortOrder = a.sortOrder;
      row.categorySortOrder = a.categorySortOrder;
      await row.save();
    }
  }));
}

/** Public: full sidebar navigation tree - categories in order, articles within each in order. */
async function listPublic(req, res, next) {
  try {
    await ensureSeeded();
    const locale = normalizeLocale(req.query.locale);
    let articles = await DocArticle.findAll({
      where: { isPublished: true, locale },
      order: [['categorySortOrder', 'ASC'], ['category', 'ASC'], ['sortOrder', 'ASC']],
      attributes: ['id', 'title', 'slug', 'category', 'excerpt', 'sortOrder', 'categorySortOrder', 'bodyHtml'],
    });
    // Any article not yet translated into the requested language falls
    // back to its English version rather than silently disappearing from
    // the sidebar - this is expected for most of the docs today, since
    // translation is an ongoing, category-by-category effort.
    if (locale !== 'en') {
      const translatedSlugs = new Set(articles.map((a) => a.slug));
      const enFallback = await DocArticle.findAll({
        where: { isPublished: true, locale: 'en' },
        order: [['categorySortOrder', 'ASC'], ['category', 'ASC'], ['sortOrder', 'ASC']],
        attributes: ['id', 'title', 'slug', 'category', 'excerpt', 'sortOrder', 'categorySortOrder', 'bodyHtml'],
      });
      articles = [...articles, ...enFallback.filter((a) => !translatedSlugs.has(a.slug))];
    }

    const categories = [];
    const byCategory = new Map();
    // Re-sort combined (translated + English-fallback) articles by their
    // own category/sort ordering so fallback entries land in the right
    // place rather than all clustering at the end.
    articles.sort((a, b) => a.categorySortOrder - b.categorySortOrder || a.category.localeCompare(b.category) || a.sortOrder - b.sortOrder);
    articles.forEach((a) => {
      if (!byCategory.has(a.category)) {
        const bucket = { category: a.category, articles: [], totalReadingMinutes: 0 };
        byCategory.set(a.category, bucket);
        categories.push(bucket);
      }
      const readingMinutes = estimateReadingMinutes(a.bodyHtml);
      const bucket = byCategory.get(a.category);
      bucket.totalReadingMinutes += readingMinutes;
      bucket.articles.push({
        id: a.id, title: a.title, slug: a.slug, category: a.category, excerpt: a.excerpt,
        sortOrder: a.sortOrder, categorySortOrder: a.categorySortOrder,
        difficulty: difficultyForSlug(a.slug), readingMinutes,
      });
    });

    res.json({ categories });
  } catch (err) { next(err); }
}

/** Public: a single article by slug, plus its prev/next neighbor within the same category for footer navigation. */
async function getBySlug(req, res, next) {
  try {
    await ensureSeeded();
    const locale = normalizeLocale(req.query.locale);
    let article = await DocArticle.findOne({ where: { slug: req.params.slug, locale, isPublished: true } });
    if (!article && locale !== 'en') {
      article = await DocArticle.findOne({ where: { slug: req.params.slug, locale: 'en', isPublished: true } });
    }
    if (!article) return res.status(404).json({ error: 'Article not found' });

    const siblings = await DocArticle.findAll({
      where: { category: article.category, locale: article.locale, isPublished: true },
      order: [['sortOrder', 'ASC']],
      attributes: ['id', 'title', 'slug', 'sortOrder'],
    });
    const idx = siblings.findIndex((s) => s.id === article.id);
    const prev = idx > 0 ? siblings[idx - 1] : null;
    const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;
    // "Related articles" - the rest of this article's own category, since
    // that's a real, honest relationship (not a fabricated recommendation
    // engine) and keeps readers inside the section they're already in.
    // Excludes this article and whichever two are already shown as
    // prev/next, and caps at 3 so it stays a short list, not the whole
    // category repeated.
    const shownIds = new Set([article.id, prev?.id, next?.id].filter(Boolean));
    const related = siblings.filter((s) => !shownIds.has(s.id)).slice(0, 3);

    const payload = article.toJSON();
    payload.difficulty = difficultyForSlug(article.slug);
    payload.readingMinutes = estimateReadingMinutes(article.bodyHtml);

    res.json({ article: payload, prev, next, related });
  } catch (err) { next(err); }
}

/**
 * Public: simple search across title/excerpt/body. Not a search-engine-grade
 * implementation (no relevance ranking beyond title-match-first) - a plain
 * substring match is genuinely sufficient for a documentation set of this
 * size and avoids adding a search infrastructure dependency for something
 * this scoped.
 */
async function search(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) return res.json({ results: [] });
    const locale = normalizeLocale(req.query.locale);

    const titleMatches = await DocArticle.findAll({
      where: { isPublished: true, locale, title: { [Op.like]: `%${q}%` } },
      attributes: ['id', 'title', 'slug', 'category', 'excerpt'],
      limit: 8,
    });
    const bodyMatches = await DocArticle.findAll({
      where: {
        isPublished: true,
        locale,
        id: { [Op.notIn]: titleMatches.map((a) => a.id).length ? titleMatches.map((a) => a.id) : ['00000000-0000-0000-0000-000000000000'] },
        [Op.or]: [{ excerpt: { [Op.like]: `%${q}%` } }, { bodyHtml: { [Op.like]: `%${q}%` } }],
      },
      attributes: ['id', 'title', 'slug', 'category', 'excerpt'],
      limit: 8,
    });

    res.json({ results: [...titleMatches, ...bodyMatches].slice(0, 10) });
  } catch (err) { next(err); }
}

/** Super Admin: every article regardless of published state, for the docs management screen. */
async function listAll(req, res, next) {
  try {
    const articles = await DocArticle.findAll({ order: [['categorySortOrder', 'ASC'], ['sortOrder', 'ASC']] });
    res.json({ articles });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const {
      title, slug, locale, category, sortOrder, categorySortOrder, excerpt, bodyHtml, isPublished,
    } = req.body;
    if (!title || !slug || !category || !bodyHtml) {
      return res.status(400).json({ error: 'title, slug, category, and bodyHtml are required' });
    }
    const article = await DocArticle.create({
      title, slug, locale: normalizeLocale(locale), category, sortOrder: sortOrder || 0, categorySortOrder: categorySortOrder || 0, excerpt, bodyHtml, isPublished: isPublished !== false,
    });
    res.status(201).json({ article });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'An article with that slug already exists for this language' });
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const article = await DocArticle.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    const fields = ['title', 'slug', 'locale', 'category', 'sortOrder', 'categorySortOrder', 'excerpt', 'bodyHtml', 'isPublished'];
    fields.forEach((f) => { if (req.body[f] !== undefined) article[f] = req.body[f]; });
    await article.save();
    res.json({ article });
  } catch (err) { next(err); }
}

/**
 * GET /docs/progress - the logged-in user's own reading progress, as a
 * plain array of article slugs they've read. Anonymous visitors get an
 * empty array rather than a 401 - the docs stay fully public either way,
 * this endpoint just personalizes the experience when it can.
 */
async function getProgress(req, res, next) {
  try {
    if (!req.user) return res.json({ readSlugs: [] });
    const rows = await DocReadProgress.findAll({ where: { userId: req.user.id }, attributes: ['articleSlug'] });
    res.json({ readSlugs: rows.map((r) => r.articleSlug) });
  } catch (err) { next(err); }
}

/**
 * POST /docs/progress - mark an article as read for the logged-in user.
 * A no-op (still 200) for anonymous visitors, since the frontend falls back
 * to its own localStorage tracking for them instead of calling this at all
 * - this endpoint existing and responding harmlessly either way means the
 * same "mark as read" call site works regardless of login state.
 */
async function markRead(req, res, next) {
  try {
    if (!req.user) return res.json({ tracked: false });
    const { slug } = req.body;
    if (!slug) return res.status(400).json({ error: 'slug is required' });
    await DocReadProgress.findOrCreate({ where: { userId: req.user.id, articleSlug: slug } });
    res.json({ tracked: true });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const article = await DocArticle.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    await article.destroy();
    res.json({ message: 'Article deleted' });
  } catch (err) { next(err); }
}

module.exports = {
  listPublic, getBySlug, search, listAll, create, update, remove, getProgress, markRead,
};
