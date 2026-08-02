const { Op } = require('sequelize');
const { DocArticle } = require('../models');
const { defaultDocArticles } = require('../seed/docArticles');

async function ensureSeeded() {
  const count = await DocArticle.count();
  if (count === 0) {
    await DocArticle.bulkCreate(defaultDocArticles);
    return;
  }
  const existing = await DocArticle.findAll();
  const existingBySlug = new Map(existing.map((a) => [a.slug, a]));
  const missing = defaultDocArticles.filter((a) => !existingBySlug.has(a.slug));
  if (missing.length > 0) await DocArticle.bulkCreate(missing);

  // Content edits to these managed default articles should reach an
  // already-seeded database too, not just fresh installs - same pattern
  // used for the blog posts and legal CMS pages.
  await Promise.all(defaultDocArticles.map(async (a) => {
    const row = existingBySlug.get(a.slug);
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
    const articles = await DocArticle.findAll({
      where: { isPublished: true },
      order: [['categorySortOrder', 'ASC'], ['category', 'ASC'], ['sortOrder', 'ASC']],
      attributes: ['id', 'title', 'slug', 'category', 'excerpt', 'sortOrder', 'categorySortOrder'],
    });

    const categories = [];
    const byCategory = new Map();
    articles.forEach((a) => {
      if (!byCategory.has(a.category)) {
        const bucket = { category: a.category, articles: [] };
        byCategory.set(a.category, bucket);
        categories.push(bucket);
      }
      byCategory.get(a.category).articles.push(a);
    });

    res.json({ categories });
  } catch (err) { next(err); }
}

/** Public: a single article by slug, plus its prev/next neighbor within the same category for footer navigation. */
async function getBySlug(req, res, next) {
  try {
    await ensureSeeded();
    const article = await DocArticle.findOne({ where: { slug: req.params.slug, isPublished: true } });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    const siblings = await DocArticle.findAll({
      where: { category: article.category, isPublished: true },
      order: [['sortOrder', 'ASC']],
      attributes: ['id', 'title', 'slug', 'sortOrder'],
    });
    const idx = siblings.findIndex((s) => s.id === article.id);
    const prev = idx > 0 ? siblings[idx - 1] : null;
    const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

    res.json({ article, prev, next });
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

    const titleMatches = await DocArticle.findAll({
      where: { isPublished: true, title: { [Op.like]: `%${q}%` } },
      attributes: ['id', 'title', 'slug', 'category', 'excerpt'],
      limit: 8,
    });
    const bodyMatches = await DocArticle.findAll({
      where: {
        isPublished: true,
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
      title, slug, category, sortOrder, categorySortOrder, excerpt, bodyHtml, isPublished,
    } = req.body;
    if (!title || !slug || !category || !bodyHtml) {
      return res.status(400).json({ error: 'title, slug, category, and bodyHtml are required' });
    }
    const article = await DocArticle.create({
      title, slug, category, sortOrder: sortOrder || 0, categorySortOrder: categorySortOrder || 0, excerpt, bodyHtml, isPublished: isPublished !== false,
    });
    res.status(201).json({ article });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'An article with that slug already exists' });
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const article = await DocArticle.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    const fields = ['title', 'slug', 'category', 'sortOrder', 'categorySortOrder', 'excerpt', 'bodyHtml', 'isPublished'];
    fields.forEach((f) => { if (req.body[f] !== undefined) article[f] = req.body[f]; });
    await article.save();
    res.json({ article });
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

module.exports = { listPublic, getBySlug, search, listAll, create, update, remove };
