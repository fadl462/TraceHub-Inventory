const { Faq } = require('../models');
const { logAction } = require('../middleware/audit');
const defaultFaqs = require('../seed/faqs');

const SUPPORTED_LOCALES = ['en', 'fr', 'es'];
function normalizeLocale(raw) {
  return SUPPORTED_LOCALES.includes(raw) ? raw : 'en';
}

async function listPublic(req, res, next) {
  try {
    const locale = normalizeLocale(req.query.locale);
    let all = await Faq.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });

    if (all.length === 0) {
      await Faq.bulkCreate(defaultFaqs);
      all = await Faq.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });
    } else {
      // An already-seeded database (FAQs existed before French/Spanish
      // support was added) would otherwise never receive the translated
      // variants automatically - add whichever locale's defaults are
      // entirely missing.
      const missingLocales = SUPPORTED_LOCALES.filter((l) => !all.some((f) => f.locale === l));
      if (missingLocales.length > 0) {
        // Backfill groupKey onto matching legacy English rows first (by
        // question text), so they're recognized as already having a
        // translated counterpart instead of showing as duplicates
        // alongside their own new translations.
        const enDefaultsByQuestion = new Map(defaultFaqs.filter((f) => f.locale === 'en').map((f) => [f.question, f.groupKey]));
        await Promise.all(all
          .filter((f) => f.locale === 'en' && !f.groupKey && enDefaultsByQuestion.has(f.question))
          .map((f) => { f.groupKey = enDefaultsByQuestion.get(f.question); return f.save(); }));

        const toAdd = defaultFaqs.filter((f) => missingLocales.includes(f.locale));
        if (toAdd.length > 0) {
          await Faq.bulkCreate(toAdd);
          all = await Faq.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });
        }
      }
    }

    let faqs = all.filter((f) => f.locale === locale);
    if (locale !== 'en') {
      const translatedGroups = new Set(faqs.map((f) => f.groupKey).filter(Boolean));
      const enFallback = all.filter((f) => f.locale === 'en' && (!f.groupKey || !translatedGroups.has(f.groupKey)));
      faqs = [...faqs, ...enFallback].sort((a, b) => a.sortOrder - b.sortOrder);
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
