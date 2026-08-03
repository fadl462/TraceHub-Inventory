const { SiteContent } = require('../models');
const { logAction } = require('../middleware/audit');

const SUPPORTED_LOCALES = ['en', 'fr', 'es'];

// Real, hand-written translated defaults for a brand-new fr/es content row -
// not machine-translated filler, and not just a copy of the English text.
// The model's own field defaults already cover 'en'.
const LOCALE_DEFAULTS = {
  fr: {
    heroEyebrow: 'Gestion des actifs et des stocks',
    heroHeadline: 'Sachez toujours où se trouve chaque actif.',
    heroSubheadline: "Enregistrez votre équipement en quelques secondes, laissez l'IA proposer des délais de mise au rebut, attribuez le matériel à votre équipe et suivez le tout par un simple scan \u2014 aucun matériel requis.",
    heroCtaText: 'Essai gratuit \u2014 10 actifs, 30 jours',
    heroSecondaryCtaText: 'Voir comment ça marche',
    loginTagline: 'Sachez toujours où se trouve chaque actif.',
    loginHighlight1: 'Vos 10 premiers actifs sont gratuits',
    loginHighlight2: "Aucun matériel, aucun frais d'installation",
    footerDescription: 'Suivi précis des actifs, conçu pour des opérations réelles.',
    footerCopyright: 'TraceHub Inventory. Tous droits réservés.',
  },
  es: {
    heroEyebrow: 'Gestión de activos e inventario',
    heroHeadline: 'Sepa siempre dónde está cada activo.',
    heroSubheadline: 'Registre su equipo en segundos, deje que la IA proponga cronogramas de baja, asigne el equipo a su personal y rastree todo con un simple escaneo \u2014 sin necesidad de hardware.',
    heroCtaText: 'Prueba gratis \u2014 10 activos, 30 días',
    heroSecondaryCtaText: 'Vea cómo funciona',
    loginTagline: 'Sepa siempre dónde está cada activo.',
    loginHighlight1: 'Sus primeros 10 activos son gratis',
    loginHighlight2: 'Sin hardware, sin costos de instalación',
    footerDescription: 'Seguimiento preciso de activos, creado para operaciones reales.',
    footerCopyright: 'TraceHub Inventory. Todos los derechos reservados.',
  },
};

function normalizeLocale(raw) {
  return SUPPORTED_LOCALES.includes(raw) ? raw : 'en';
}

async function getOrCreate(locale) {
  // Pre-existing installations have a single row with id='default' from
  // before per-language content existed - migrate its data into a real
  // 'en' row once, so a Super Admin's existing homepage edits aren't
  // silently orphaned by this change. Copying into a new row rather than
  // mutating the primary key in place, since changing a Sequelize
  // instance's primary key value and calling .save() is unreliable (the
  // resulting UPDATE's WHERE clause can end up targeting the new id
  // instead of the old one).
  if (locale === 'en') {
    const existingEn = await SiteContent.findByPk('en');
    if (!existingEn) {
      const legacy = await SiteContent.findByPk('default');
      if (legacy) {
        const data = legacy.toJSON();
        delete data.id;
        delete data.createdAt;
        delete data.updatedAt;
        const migrated = await SiteContent.create({ id: 'en', ...data });
        await legacy.destroy();
        return migrated;
      }
    }
  }
  const [content] = await SiteContent.findOrCreate({
    where: { id: locale },
    defaults: { id: locale, ...(LOCALE_DEFAULTS[locale] || {}) },
  });
  return content;
}

/** Public - the landing/login pages fetch this with no auth required, one row per language */
async function getPublic(req, res, next) {
  try {
    const locale = normalizeLocale(req.query.locale);
    const content = await getOrCreate(locale);
    res.json({ content, locale });
  } catch (err) { next(err); }
}

/** Super Admin - update any subset of fields for a specific language's content */
async function update(req, res, next) {
  try {
    const locale = normalizeLocale(req.body.locale);
    const content = await getOrCreate(locale);
    const before = content.toJSON();
    const allowed = [
      'heroEyebrow', 'heroHeadline', 'heroSubheadline', 'heroCtaText', 'heroCtaLink',
      'heroSecondaryCtaText', 'heroImageUrl', 'loginTagline', 'loginHighlight1', 'loginHighlight2',
      'footerDescription', 'footerCopyright', 'footerNewsletterEnabled',
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) content[key] = req.body[key];
    }
    await content.save();
    await logAction(req, { action: 'siteContent.update', entityType: 'SiteContent', entityId: locale, before, after: content.toJSON() });
    res.json({ content, locale });
  } catch (err) { next(err); }
}

module.exports = { getPublic, update, SUPPORTED_LOCALES };
