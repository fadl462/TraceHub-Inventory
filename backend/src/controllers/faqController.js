const { Faq } = require('../models');
const { logAction } = require('../middleware/audit');
const defaultFaqs = require('../seed/faqs');

async function listPublic(req, res, next) {
  try {
    let faqs = await Faq.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });
    if (faqs.length === 0) {
      await Faq.bulkCreate(defaultFaqs);
      faqs = await Faq.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });
    }
    res.json({ faqs });
  } catch (err) { next(err); }
}

async function listAll(req, res, next) {
  try {
    const faqs = await Faq.findAll({ order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });
    res.json({ faqs });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const faq = await Faq.create(req.body);
    await logAction(req, { action: 'faq.create', entityType: 'Faq', entityId: faq.id, after: faq.toJSON() });
    res.status(201).json({ faq });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    const before = faq.toJSON();
    Object.assign(faq, req.body);
    await faq.save();
    await logAction(req, { action: 'faq.update', entityType: 'Faq', entityId: faq.id, before, after: faq.toJSON() });
    res.json({ faq });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    await faq.destroy();
    res.json({ message: 'FAQ deleted' });
  } catch (err) { next(err); }
}

module.exports = { listPublic, listAll, create, update, remove };
