const { CmsPage } = require('../models');
const { logAction } = require('../middleware/audit');
const defaultCmsPages = require('../seed/cmsPages');

function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Pages we explicitly rewrote with real content - synced to an already-seeded
// database too, not just fresh installs. Deliberately scoped to just these
// slugs (not every default CMS page) so a Super Admin's own edits to other
// pages are never silently overwritten.
const MANAGED_LEGAL_SLUGS = ['privacy-policy', 'terms-of-service', 'cookie-policy', 'documentation'];

async function ensureSeeded() {
  const count = await CmsPage.count();
  if (count === 0) {
    await CmsPage.bulkCreate(defaultCmsPages);
    return;
  }
  const existing = await CmsPage.findAll({ where: { slug: MANAGED_LEGAL_SLUGS } });
  const existingBySlug = new Map(existing.map((p) => [p.slug, p]));
  await Promise.all(defaultCmsPages
    .filter((p) => MANAGED_LEGAL_SLUGS.includes(p.slug))
    .map(async (p) => {
      const row = existingBySlug.get(p.slug);
      if (!row) { await CmsPage.create(p); return; }
      if (row.bodyHtml !== p.bodyHtml) {
        row.bodyHtml = p.bodyHtml;
        await row.save();
      }
    }));
}

async function listPublic(req, res, next) {
  try {
    await ensureSeeded();
    const pages = await CmsPage.findAll({
      where: { isPublished: true },
      order: [['sortOrder', 'ASC']],
      attributes: ['id', 'title', 'slug', 'showInNav', 'showInFooter'],
    });
    res.json({ pages });
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    await ensureSeeded();
    const page = await CmsPage.findOne({ where: { slug: req.params.slug, isPublished: true } });
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json({ page });
  } catch (err) { next(err); }
}

async function listAll(req, res, next) {
  try {
    const pages = await CmsPage.findAll({ order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']] });
    res.json({ pages });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { title, slug, bodyHtml, showInNav, showInFooter, isPublished, sortOrder } = req.body;
    const finalSlug = slug ? slugify(slug) : slugify(title);
    const existing = await CmsPage.findOne({ where: { slug: finalSlug } });
    if (existing) return res.status(409).json({ error: `A page with slug "${finalSlug}" already exists.` });

    const page = await CmsPage.create({
      title, slug: finalSlug, bodyHtml, showInNav: !!showInNav, showInFooter: showInFooter !== false,
      isPublished: isPublished !== false, sortOrder: sortOrder || 0,
    });
    await logAction(req, { action: 'cmsPage.create', entityType: 'CmsPage', entityId: page.id, after: page.toJSON() });
    res.status(201).json({ page });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const page = await CmsPage.findByPk(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    const before = page.toJSON();
    const { title, slug, bodyHtml, showInNav, showInFooter, isPublished, sortOrder } = req.body;
    if (title !== undefined) page.title = title;
    if (slug !== undefined) page.slug = slugify(slug);
    if (bodyHtml !== undefined) page.bodyHtml = bodyHtml;
    if (showInNav !== undefined) page.showInNav = showInNav;
    if (showInFooter !== undefined) page.showInFooter = showInFooter;
    if (isPublished !== undefined) page.isPublished = isPublished;
    if (sortOrder !== undefined) page.sortOrder = sortOrder;
    await page.save();
    await logAction(req, { action: 'cmsPage.update', entityType: 'CmsPage', entityId: page.id, before, after: page.toJSON() });
    res.json({ page });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const page = await CmsPage.findByPk(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    await page.destroy();
    res.json({ message: 'Page deleted' });
  } catch (err) { next(err); }
}

module.exports = { listPublic, getBySlug, listAll, create, update, remove };
