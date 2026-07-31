const { Op, fn, col } = require('sequelize');
const {
  Company, User, Asset, Subscription, SubscriptionPlan, Payment,
} = require('../models');
const { logAction } = require('../middleware/audit');

async function listCompanies(req, res, next) {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where.name = { [Op.like]: `%${search}%` };

    const companies = await Company.findAll({
      where,
      include: [{
        model: Subscription,
        limit: 1,
        order: [['createdAt', 'DESC']],
        include: [SubscriptionPlan],
        separate: true,
      }],
      order: [['createdAt', 'DESC']],
    });

    const withCounts = await Promise.all(companies.map(async (c) => {
      const assetCount = await Asset.count({ where: { companyId: c.id, isArchived: false } });
      const userCount = await User.count({ where: { companyId: c.id } });
      return { ...c.toJSON(), assetCount, userCount };
    }));

    res.json({ companies: withCounts });
  } catch (err) { next(err); }
}

async function getCompany(req, res, next) {
  try {
    const company = await Company.findByPk(req.params.id, {
      include: [{ model: Subscription, include: [SubscriptionPlan] }],
    });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    const assetCount = await Asset.count({ where: { companyId: company.id } });
    const userCount = await User.count({ where: { companyId: company.id } });
    const revenueTotal = await Payment.sum('amount', { where: { companyId: company.id, status: 'successful' } });
    res.json({ company, assetCount, userCount, revenueTotal: revenueTotal || 0 });
  } catch (err) { next(err); }
}

async function updateCompanyStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['trial', 'active', 'suspended', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    const before = company.status;
    company.status = status;
    await company.save();
    await logAction(req, { action: 'company.status_change', entityType: 'Company', entityId: company.id, before: { status: before }, after: { status } });
    res.json({ company });
  } catch (err) { next(err); }
}

async function deleteCompany(req, res, next) {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    await company.destroy();
    res.json({ message: 'Company and all associated data deleted' });
  } catch (err) { next(err); }
}

/** Global platform stats for the Super Admin dashboard */
async function dashboardStats(req, res, next) {
  try {
    const [totalCompanies, activeCompanies, trialCompanies, totalAssets, totalUsers] = await Promise.all([
      Company.count(),
      Company.count({ where: { status: 'active' } }),
      Company.count({ where: { status: 'trial' } }),
      Asset.count({ where: { isArchived: false } }),
      User.count({ where: { role: { [Op.ne]: 'super_admin' } } }),
    ]);
    const revenueTotal = await Payment.sum('amount', { where: { status: 'successful' } });
    const activeSubs = await Subscription.count({ where: { status: 'active' } });
    const pastDueSubs = await Subscription.count({ where: { status: 'past_due' } });

    res.json({
      totalCompanies, activeCompanies, trialCompanies, totalAssets, totalUsers,
      revenueTotal: revenueTotal || 0, activeSubs, pastDueSubs,
    });
  } catch (err) { next(err); }
}

module.exports = { listCompanies, getCompany, updateCompanyStatus, deleteCompany, dashboardStats };
