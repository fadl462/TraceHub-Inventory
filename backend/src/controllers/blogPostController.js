const { BlogPost, BlogComment } = require('../models');
const { logAction } = require('../middleware/audit');
const defaultPosts = require('../seed/blogPosts');

const SUPPORTED_LOCALES = ['en', 'fr', 'es'];
function normalizeLocale(raw) {
  return SUPPORTED_LOCALES.includes(raw) ? raw : 'en';
}

function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Same real word-count-based estimator as the docs portal (not a guessed
// number) - strips HTML tags, ~200 words/minute, rounded up.
function estimateReadingMinutes(html) {
  const text = String(html || '').replace(/<[^>]*>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Sample/placeholder posts being retired, per an explicit content decision -
// pruned even from an already-seeded database, not just excluded from
// future seeds.
const RETIRED_SLUGS = ['ai-driven-depreciation-insights', 'qr-based-location-tracking', 'usd-billing-flutterwave'];

async function ensureSeeded() {
  const count = await BlogPost.count();
  if (count === 0) {
    await BlogPost.bulkCreate(defaultPosts);
    return;
  }
  // Publishing a new post (or a new language variant of one) later
  // shouldn't require wiping existing blog data - add anything from the
  // default set not already present by slug+locale.
  const existing = await BlogPost.findAll();
  const existingByKey = new Map(existing.map((p) => [`${p.slug}::${p.locale || 'en'}`, p]));
  const missing = defaultPosts.filter((p) => !existingByKey.has(`${p.slug}::${p.locale || 'en'}`));
  if (missing.length > 0) await BlogPost.bulkCreate(missing);

  // Content edits to a managed default post (new cover image, updated body,
  // etc.) should reach an already-seeded database too, not just fresh
  // installs.
  await Promise.all(defaultPosts.map(async (p) => {
    const row = existingByKey.get(`${p.slug}::${p.locale || 'en'}`);
    if (!row) return;
    const needsUpdate = row.coverImageUrl !== p.coverImageUrl || row.bodyHtml !== p.bodyHtml || row.excerpt !== p.excerpt || row.authorName !== p.authorName;
    if (needsUpdate) {
      row.coverImageUrl = p.coverImageUrl;
      row.bodyHtml = p.bodyHtml;
      row.excerpt = p.excerpt;
      row.authorName = p.authorName;
      await row.save();
    }
  }));

  await BlogPost.destroy({ where: { slug: RETIRED_SLUGS } });
}

async function listPublic(req, res, next) {
  try {
    await ensureSeeded();
    const locale = normalizeLocale(req.query.locale);
    let posts = await BlogPost.findAll({
      where: { isPublished: true, locale },
      order: [['publishedAt', 'DESC']],
      attributes: ['id', 'title', 'slug', 'excerpt', 'coverImageUrl', 'authorName', 'publishedAt', 'bodyHtml'],
    });
    // A post not yet translated into the requested language falls back to
    // English rather than silently disappearing from the list.
    if (locale !== 'en') {
      const translatedSlugs = new Set(posts.map((p) => p.slug));
      const enFallback = await BlogPost.findAll({
        where: { isPublished: true, locale: 'en' },
        order: [['publishedAt', 'DESC']],
        attributes: ['id', 'title', 'slug', 'excerpt', 'coverImageUrl', 'authorName', 'publishedAt', 'bodyHtml'],
      });
      posts = [...posts, ...enFallback.filter((p) => !translatedSlugs.has(p.slug))]
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }
    const withReadingTime = posts.map((p) => {
      const data = p.toJSON();
      data.readingMinutes = estimateReadingMinutes(data.bodyHtml);
      delete data.bodyHtml; // list view never needed the full body, just the computed minutes
      return data;
    });
    res.json({ posts: withReadingTime });
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    await ensureSeeded();
    const locale = normalizeLocale(req.query.locale);
    let post = await BlogPost.findOne({ where: { slug: req.params.slug, locale, isPublished: true } });
    if (!post && locale !== 'en') {
      // Fall back to the English version rather than a 404 if this specific
      // post hasn't been translated into the requested language yet.
      post = await BlogPost.findOne({ where: { slug: req.params.slug, locale: 'en', isPublished: true } });
    }
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const others = await BlogPost.findAll({
      where: { isPublished: true, locale: post.locale, slug: { [require('sequelize').Op.ne]: post.slug } },
      order: [['publishedAt', 'DESC']],
      attributes: ['id', 'title', 'slug', 'coverImageUrl', 'excerpt'],
      limit: 2,
    });

    const payload = post.toJSON();
    payload.readingMinutes = estimateReadingMinutes(payload.bodyHtml);
    res.json({ post: payload, related: others });
  } catch (err) { next(err); }
}

async function listAll(req, res, next) {
  try {
    const posts = await BlogPost.findAll({ order: [['publishedAt', 'DESC']] });
    res.json({ posts });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { title, slug, locale, excerpt, bodyHtml, coverImageUrl, authorName, publishedAt, isPublished } = req.body;
    const finalSlug = slug ? slugify(slug) : slugify(title);
    const finalLocale = normalizeLocale(locale);
    const existing = await BlogPost.findOne({ where: { slug: finalSlug, locale: finalLocale } });
    if (existing) return res.status(409).json({ error: `A post with slug "${finalSlug}" already exists for this language.` });

    const post = await BlogPost.create({
      title, slug: finalSlug, locale: finalLocale, excerpt, bodyHtml, coverImageUrl,
      authorName: authorName || 'TraceHub Team',
      publishedAt: publishedAt || new Date(),
      isPublished: isPublished !== false,
    });
    await logAction(req, { action: 'blogPost.create', entityType: 'BlogPost', entityId: post.id, after: post.toJSON() });
    res.status(201).json({ post });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const before = post.toJSON();
    const { title, slug, excerpt, bodyHtml, coverImageUrl, authorName, publishedAt, isPublished } = req.body;
    if (title !== undefined) post.title = title;
    if (slug !== undefined) post.slug = slugify(slug);
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (bodyHtml !== undefined) post.bodyHtml = bodyHtml;
    if (coverImageUrl !== undefined) post.coverImageUrl = coverImageUrl;
    if (authorName !== undefined) post.authorName = authorName;
    if (publishedAt !== undefined) post.publishedAt = publishedAt;
    if (isPublished !== undefined) post.isPublished = isPublished;
    await post.save();
    await logAction(req, { action: 'blogPost.update', entityType: 'BlogPost', entityId: post.id, before, after: post.toJSON() });
    res.json({ post });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) { next(err); }
}

/** Public: comments on a published post, oldest first so the conversation reads naturally */
async function listComments(req, res, next) {
  try {
    // Comments are a shared conversation about "this article" regardless of
    // which language variant someone happened to read - merged across all
    // locale rows for the slug rather than fragmenting into separate
    // per-language threads.
    const posts = await BlogPost.findAll({ where: { slug: req.params.slug, isPublished: true } });
    if (posts.length === 0) return res.status(404).json({ error: 'Post not found' });
    const comments = await BlogComment.findAll({
      where: { blogPostId: posts.map((p) => p.id), isApproved: true },
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'authorName', 'body', 'createdAt'], // authorEmail deliberately never returned publicly
    });
    res.json({ comments });
  } catch (err) { next(err); }
}

/** Public: leave a comment/contribution on a published post - no login required, matches an open blog's usual bar */
async function createComment(req, res, next) {
  try {
    const locale = normalizeLocale(req.body.locale || req.query.locale);
    let post = await BlogPost.findOne({ where: { slug: req.params.slug, locale, isPublished: true } });
    if (!post) post = await BlogPost.findOne({ where: { slug: req.params.slug, locale: 'en', isPublished: true } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const { authorName, authorEmail, body } = req.body;
    if (!authorName?.trim() || !body?.trim()) {
      return res.status(400).json({ error: 'Name and comment are required' });
    }
    if (body.length > 3000) return res.status(400).json({ error: 'Comment is too long (3000 character max)' });

    const comment = await BlogComment.create({
      blogPostId: post.id,
      authorName: authorName.trim().slice(0, 120),
      authorEmail: authorEmail?.trim().slice(0, 200) || null,
      body: body.trim(),
    });
    res.status(201).json({ comment: { id: comment.id, authorName: comment.authorName, body: comment.body, createdAt: comment.createdAt } });
  } catch (err) { next(err); }
}

module.exports = {
  listPublic, getBySlug, listAll, create, update, remove, listComments, createComment,
};
