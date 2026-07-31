const { Testimonial } = require('../models');
const { logAction } = require('../middleware/audit');

async function listPublic(req, res, next) {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isPublished: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    });
    res.json({ testimonials });
  } catch (err) { next(err); }
}

async function listAll(req, res, next) {
  try {
    const testimonials = await Testimonial.findAll({ order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });
    res.json({ testimonials });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const testimonial = await Testimonial.create(req.body);
    await logAction(req, { action: 'testimonial.create', entityType: 'Testimonial', entityId: testimonial.id, after: testimonial.toJSON() });
    res.status(201).json({ testimonial });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    const before = testimonial.toJSON();
    Object.assign(testimonial, req.body);
    await testimonial.save();
    await logAction(req, { action: 'testimonial.update', entityType: 'Testimonial', entityId: testimonial.id, before, after: testimonial.toJSON() });
    res.json({ testimonial });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    await testimonial.destroy();
    res.json({ message: 'Testimonial deleted' });
  } catch (err) { next(err); }
}

module.exports = { listPublic, listAll, create, update, remove };
