const { SiteContent } = require('../models');
const { logAction } = require('../middleware/audit');

async function getOrCreateDefault() {
  const [content] = await SiteContent.findOrCreate({ where: { id: 'default' } });
  return content;
}

/** Public - the landing/login pages fetch this with no auth required */
async function getPublic(req, res, next) {
  try {
    const content = await getOrCreateDefault();
    res.json({ content });
  } catch (err) { next(err); }
}

/** Super Admin - update any subset of fields */
async function update(req, res, next) {
  try {
    const content = await getOrCreateDefault();
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
    await logAction(req, { action: 'siteContent.update', entityType: 'SiteContent', entityId: 'default', before, after: content.toJSON() });
    res.json({ content });
  } catch (err) { next(err); }
}

module.exports = { getPublic, update };
