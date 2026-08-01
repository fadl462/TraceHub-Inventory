const { FooterLink } = require('../models');
const { logAction } = require('../middleware/audit');
const defaultFooterLinks = require('../seed/footerLinks');

async function listPublic(req, res, next) {
  try {
    let links = await FooterLink.findAll({ where: { isPublished: true }, order: [['group', 'ASC'], ['sortOrder', 'ASC']] });
    if (links.length === 0) {
      await FooterLink.bulkCreate(defaultFooterLinks);
      links = await FooterLink.findAll({ where: { isPublished: true }, order: [['group', 'ASC'], ['sortOrder', 'ASC']] });
    }
    res.json({ links });
  } catch (err) { next(err); }
}

async function listAll(req, res, next) {
  try {
    const links = await FooterLink.findAll({ order: [['group', 'ASC'], ['sortOrder', 'ASC']] });
    res.json({ links });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const link = await FooterLink.create(req.body);
    await logAction(req, { action: 'footerLink.create', entityType: 'FooterLink', entityId: link.id, after: link.toJSON() });
    res.status(201).json({ link });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const link = await FooterLink.findByPk(req.params.id);
    if (!link) return res.status(404).json({ error: 'Footer link not found' });
    Object.assign(link, req.body);
    await link.save();
    res.json({ link });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const link = await FooterLink.findByPk(req.params.id);
    if (!link) return res.status(404).json({ error: 'Footer link not found' });
    await link.destroy();
    res.json({ message: 'Footer link deleted' });
  } catch (err) { next(err); }
}

module.exports = { listPublic, listAll, create, update, remove };
