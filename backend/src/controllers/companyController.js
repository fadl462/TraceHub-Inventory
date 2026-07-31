const { Company } = require('../models');
const { logAction } = require('../middleware/audit');

async function getMyCompany(req, res, next) {
  try {
    const company = await Company.findByPk(req.companyId);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json({ company });
  } catch (err) { next(err); }
}

async function updateMyCompany(req, res, next) {
  try {
    const company = await Company.findByPk(req.companyId);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    const before = company.toJSON();

    const { name, industry, logoUrl, currency, timezone, settings } = req.body;
    if (name !== undefined) company.name = name;
    if (industry !== undefined) company.industry = industry;
    if (logoUrl !== undefined) company.logoUrl = logoUrl;
    if (currency !== undefined) company.currency = currency;
    if (timezone !== undefined) company.timezone = timezone;
    if (settings !== undefined) company.settings = { ...company.settings, ...settings };

    await company.save();
    await logAction(req, { action: 'company.update', entityType: 'Company', entityId: company.id, before, after: company.toJSON() });
    res.json({ company });
  } catch (err) { next(err); }
}

/** Requests a custom (sub)domain - flagged for Super Admin/manual DNS provisioning */
async function requestCustomDomain(req, res, next) {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'domain is required' });
    const company = await Company.findByPk(req.companyId);
    company.settings = { ...company.settings, requestedCustomDomain: domain, customDomainStatus: 'pending_review' };
    await company.save();
    res.json({ message: 'Custom domain request submitted for review.', company });
  } catch (err) { next(err); }
}

module.exports = { getMyCompany, updateMyCompany, requestCustomDomain };
