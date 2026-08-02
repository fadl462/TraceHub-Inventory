const { BlogPost } = require('../models');
const { logAction } = require('../middleware/audit');
const defaultPosts = require('../seed/blogPosts');

function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function ensureSeeded() {
  const count = await BlogPost.count();
  if (count === 0) {
    await BlogPost.bulkCreate(defaultPosts);
    return;
  }
  // Publishing a new post later shouldn't require wiping existing blog data -
  // add any post from the default set that isn't already present by slug.
  const existingSlugs = new Set((await BlogPost.findAll({ attributes: ['slug'] })).map((p) => p.slug));
  const missing = defaultPosts.filter((p) => !existingSlugs.has(p.slug));
  if (missing.length > 0) await BlogPost.bulkCreate(missing);
}

async function listPublic(req, res, next) {
  try {
    await ensureSeeded();
    const posts = await BlogPost.findAll({
      where: { isPublished: true },
      order: [['publishedAt', 'DESC']],
      attributes: ['id', 'title', 'slug', 'excerpt', 'coverImageUrl', 'authorName', 'publishedAt'],
    });
    res.json({ posts });
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    await ensureSeeded();
    const post = await BlogPost.findOne({ where: { slug: req.params.slug, isPublished: true } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
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
    const { title, slug, excerpt, bodyHtml, coverImageUrl, authorName, publishedAt, isPublished } = req.body;
    const finalSlug = slug ? slugify(slug) : slugify(title);
    const existing = await BlogPost.findOne({ where: { slug: finalSlug } });
    if (existing) return res.status(409).json({ error: `A post with slug "${finalSlug}" already exists.` });

    const post = await BlogPost.create({
      title, slug: finalSlug, excerpt, bodyHtml, coverImageUrl,
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

module.exports = { listPublic, getBySlug, listAll, create, update, remove };
