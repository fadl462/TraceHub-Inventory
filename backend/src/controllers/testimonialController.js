const { Testimonial } = require('../models');
const { logAction } = require('../middleware/audit');
const defaultTestimonials = require('../seed/testimonials');

const SUPPORTED_LOCALES = ['en', 'fr', 'es'];
function normalizeLocale(raw) {
  return SUPPORTED_LOCALES.includes(raw) ? raw : 'en';
}

async function listPublic(req, res, next) {
  try {
    const locale = normalizeLocale(req.query.locale);
    let all = await Testimonial.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });

    // Self-healing: if nothing's been seeded yet (or the table was
    // cleared), populate the built-in defaults (all three languages) on
    // first read instead of showing an empty homepage section.
    if (all.length === 0) {
      await Testimonial.bulkCreate(defaultTestimonials);
      all = await Testimonial.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });
    } else {
      // An already-seeded database (testimonials existed before French/
      // Spanish support was added) would otherwise never receive the
      // translated variants automatically - add whichever locale's
      // defaults are entirely missing.
      const missingLocales = SUPPORTED_LOCALES.filter((l) => !all.some((t) => t.locale === l));
      if (missingLocales.length > 0) {
        // Before adding translations, backfill groupKey onto any existing
        // legacy English row that matches a known default by author name -
        // otherwise those legacy rows have no group to match against and
        // would show up as duplicates alongside their own translations
        // rather than being correctly recognized as already covered.
        const enDefaultsByAuthor = new Map(defaultTestimonials.filter((t) => t.locale === 'en').map((t) => [t.authorName, t.groupKey]));
        await Promise.all(all
          .filter((t) => t.locale === 'en' && !t.groupKey && enDefaultsByAuthor.has(t.authorName))
          .map((t) => { t.groupKey = enDefaultsByAuthor.get(t.authorName); return t.save(); }));

        const toAdd = defaultTestimonials.filter((t) => missingLocales.includes(t.locale));
        if (toAdd.length > 0) {
          await Testimonial.bulkCreate(toAdd);
          all = await Testimonial.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });
        }
      }
    }

    let testimonials = all.filter((t) => t.locale === locale);
    if (locale !== 'en') {
      // Fall back to English for any testimonial not yet translated into
      // the requested language, matched by groupKey where available -
      // legacy rows created before groupKey existed have no group to match
      // against, so they simply always show (better than disappearing).
      const translatedGroups = new Set(testimonials.map((t) => t.groupKey).filter(Boolean));
      const enFallback = all.filter((t) => t.locale === 'en' && (!t.groupKey || !translatedGroups.has(t.groupKey)));
      testimonials = [...testimonials, ...enFallback].sort((a, b) => a.sortOrder - b.sortOrder);
    }

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
