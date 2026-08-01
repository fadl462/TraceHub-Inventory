const { Op, fn, col } = require('sequelize');
const {
  Company, User, Asset, Subscription, SubscriptionPlan, Payment, AuditLog, PlatformSettings, Assignment,
} = require('../models');
const { logAction } = require('../middleware/audit');
const { generateInsight } = require('../utils/aiInsights');

function pctChange(now, then) {
  if (then === 0) return now === 0 ? 0 : null; // null = "new" (no baseline to compare against)
  return Math.round(((now - then) / then) * 1000) / 10;
}

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
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000);

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

    const [assignedCount, availableCount] = await Promise.all([
      Asset.count({ where: { status: 'assigned', isArchived: false } }),
      Asset.count({ where: { status: 'available', isArchived: false } }),
    ]);

    // Assets whose AI-suggested disposal date has arrived or is within 30 days
    const disposalAlerts = await Asset.count({
      where: {
        isArchived: false,
        status: { [Op.ne]: 'disposed' },
        aiSuggestedDisposalDate: { [Op.lte]: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) },
      },
    });

    // Trend deltas: current totals vs. what they were 30 days ago, and
    // revenue in the last 30 days vs. the 30 days before that
    const [companies30Ago, assets30Ago, users30Ago] = await Promise.all([
      Company.count({ where: { createdAt: { [Op.lte]: thirtyDaysAgo } } }),
      Asset.count({ where: { isArchived: false, createdAt: { [Op.lte]: thirtyDaysAgo } } }),
      User.count({ where: { role: { [Op.ne]: 'super_admin' }, createdAt: { [Op.lte]: thirtyDaysAgo } } }),
    ]);
    const [revenueLast30, revenuePrev30] = await Promise.all([
      Payment.sum('amount', { where: { status: 'successful', paidAt: { [Op.gte]: thirtyDaysAgo } } }),
      Payment.sum('amount', { where: { status: 'successful', paidAt: { [Op.gte]: sixtyDaysAgo, [Op.lt]: thirtyDaysAgo } } }),
    ]);
    const trends = {
      companies: pctChange(totalCompanies, companies30Ago),
      assets: pctChange(totalAssets, assets30Ago),
      users: pctChange(totalUsers, users30Ago),
      revenue: pctChange(revenueLast30 || 0, revenuePrev30 || 0),
    };

    // Asset growth & disposal chart - granularity-aware (daily/weekly/monthly),
    // computed in JS since SQLite/Postgres date-grouping functions differ
    // enough that this is the more portable choice.
    const granularity = ['daily', 'weekly', 'monthly'].includes(req.query.granularity) ? req.query.granularity : 'monthly';
    const bucketConfig = {
      daily: { count: 14, days: 1, labelFn: (d) => d.toLocaleString(undefined, { month: 'short', day: 'numeric' }) },
      weekly: { count: 12, days: 7, labelFn: (d) => `${d.toLocaleString(undefined, { month: 'short', day: 'numeric' })}` },
      monthly: { count: 6, days: 30, labelFn: (d) => d.toLocaleString(undefined, { month: 'short' }) },
    }[granularity];

    let assetGrowthSeries;
    if (granularity === 'monthly') {
      const monthsBack = 6;
      const since = new Date();
      since.setMonth(since.getMonth() - (monthsBack - 1));
      since.setDate(1);
      const allAssets = await Asset.findAll({ where: { createdAt: { [Op.gte]: since } }, attributes: ['createdAt', 'isArchived', 'status'] });
      const monthLabels = [];
      const monthKeyFor = (d) => `${d.getFullYear()}-${d.getMonth()}`;
      const cursor = new Date(since);
      for (let i = 0; i < monthsBack; i += 1) {
        monthLabels.push({ key: monthKeyFor(cursor), label: cursor.toLocaleString(undefined, { month: 'short' }) });
        cursor.setMonth(cursor.getMonth() + 1);
      }
      const registeredByMonth = Object.fromEntries(monthLabels.map((m) => [m.key, 0]));
      const disposedByMonth = Object.fromEntries(monthLabels.map((m) => [m.key, 0]));
      allAssets.forEach((a) => {
        const key = monthKeyFor(new Date(a.createdAt));
        if (key in registeredByMonth) registeredByMonth[key] += 1;
        if ((a.isArchived || a.status === 'disposed') && key in disposedByMonth) disposedByMonth[key] += 1;
      });
      assetGrowthSeries = monthLabels.map((m) => ({ month: m.label, registered: registeredByMonth[m.key], disposed: disposedByMonth[m.key] }));
    } else {
      const { count, days, labelFn } = bucketConfig;
      const since = new Date(Date.now() - count * days * 86400000);
      const allAssets = await Asset.findAll({ where: { createdAt: { [Op.gte]: since } }, attributes: ['createdAt', 'isArchived', 'status'] });
      const buckets = [];
      for (let i = count - 1; i >= 0; i -= 1) {
        const bucketStart = new Date(Date.now() - (i + 1) * days * 86400000);
        const bucketEnd = new Date(Date.now() - i * days * 86400000);
        buckets.push({ start: bucketStart, end: bucketEnd, label: labelFn(bucketEnd), registered: 0, disposed: 0 });
      }
      allAssets.forEach((a) => {
        const t = new Date(a.createdAt).getTime();
        const bucket = buckets.find((b) => t >= b.start.getTime() && t < b.end.getTime());
        if (bucket) {
          bucket.registered += 1;
          if (a.isArchived || a.status === 'disposed') bucket.disposed += 1;
        }
      });
      assetGrowthSeries = buckets.map((b) => ({ month: b.label, registered: b.registered, disposed: b.disposed }));
    }

    // Revenue by plan - real successful payments joined through their subscription's plan
    const payments = await Payment.findAll({
      where: { status: 'successful' },
      include: [{ model: Subscription, include: [SubscriptionPlan] }],
    });
    const revenueByPlanMap = {};
    payments.forEach((p) => {
      const planName = p.Subscription?.SubscriptionPlan?.name || 'Unknown';
      revenueByPlanMap[planName] = (revenueByPlanMap[planName] || 0) + Number(p.amount);
    });
    const revenueByPlan = Object.entries(revenueByPlanMap).map(([name, value]) => ({ name, value }));

    // Top companies leaderboard, by asset count
    const allCompanies = await Company.findAll({ attributes: ['id', 'name'] });
    const topCompanies = (await Promise.all(allCompanies.map(async (c) => {
      const assetCount = await Asset.count({ where: { companyId: c.id, isArchived: false } });
      return { id: c.id, name: c.name, assetCount };
    })))
      .sort((a, b) => b.assetCount - a.assetCount)
      .slice(0, 5);

    // Recent global activity
    const recentAuditLog = await AuditLog.findAll({
      order: [['createdAt', 'DESC']],
      limit: 8,
      include: [
        { model: Company, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
      ],
    });

    // System health strip
    const platformSettings = await PlatformSettings.findByPk('default');
    const todayStr = new Date().toISOString().slice(0, 10);
    const in3Days = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
    const [pendingReminders, failedPayments30d] = await Promise.all([
      Assignment.count({
        where: {
          status: 'active',
          expectedReturnDate: { [Op.in]: [todayStr, in3Days] },
          reminder3DaySentAt: null,
          reminderDueDaySentAt: null,
        },
      }),
      Payment.count({ where: { status: 'failed', createdAt: { [Op.gte]: thirtyDaysAgo } } }),
    ]);

    res.json({
      totalCompanies, activeCompanies, trialCompanies, totalAssets, totalUsers,
      revenueTotal: revenueTotal || 0, activeSubs, pastDueSubs,
      assignedCount, availableCount, disposalAlerts, trends, granularity,
      assetGrowthSeries, revenueByPlan, topCompanies,
      recentAuditLog: recentAuditLog.map((l) => ({
        id: l.id, action: l.action, entityType: l.entityType,
        companyName: l.Company?.name || null,
        userName: l.User ? `${l.User.firstName} ${l.User.lastName}` : null,
        createdAt: l.createdAt,
      })),
      systemHealth: {
        lastCronRunAt: platformSettings?.lastCronRunAt || null,
        pendingReminders,
        failedPayments30d,
      },
    });
  } catch (err) { next(err); }
}

/** Global search across companies, users, and assets - for the Super Admin header search bar */
async function globalSearch(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    if (q.length < 2) return res.json({ companies: [], users: [], assets: [] });

    const [companies, users, assets] = await Promise.all([
      Company.findAll({ where: { name: { [Op.like]: `%${q}%` } }, limit: 5, attributes: ['id', 'name', 'slug', 'status'] }),
      User.findAll({
        where: {
          [Op.or]: [{ firstName: { [Op.like]: `%${q}%` } }, { lastName: { [Op.like]: `%${q}%` } }, { email: { [Op.like]: `%${q}%` } }],
          role: { [Op.ne]: 'super_admin' },
        },
        limit: 5,
        attributes: ['id', 'firstName', 'lastName', 'email', 'companyId', 'role'],
      }),
      Asset.findAll({
        where: { [Op.or]: [{ name: { [Op.like]: `%${q}%` } }, { assetTag: { [Op.like]: `%${q}%` } }] },
        limit: 5,
        attributes: ['id', 'name', 'assetTag', 'companyId'],
      }),
    ]);

    res.json({ companies, users, assets });
  } catch (err) { next(err); }
}
async function aiInsights(req, res, next) {
  try {
    const [totalCompanies, totalAssets, totalUsers, activeSubs, pastDueSubs, disposalAlerts] = await Promise.all([
      Company.count(),
      Asset.count({ where: { isArchived: false } }),
      User.count({ where: { role: { [Op.ne]: 'super_admin' } } }),
      Subscription.count({ where: { status: 'active' } }),
      Subscription.count({ where: { status: 'past_due' } }),
      Asset.count({
        where: {
          isArchived: false,
          status: { [Op.ne]: 'disposed' },
          aiSuggestedDisposalDate: { [Op.lte]: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) },
        },
      }),
    ]);
    const revenueTotal = await Payment.sum('amount', { where: { status: 'successful' } });

    const result = await generateInsight({
      systemContext: 'You are a data analyst summarizing platform-wide metrics for the Super Admin of TraceHub Inventory, a B2B asset management SaaS platform, for their dashboard overview.',
      stats: {
        totalCompanies, totalAssets, totalUsers, activeSubscriptions: activeSubs,
        pastDueSubscriptions: pastDueSubs, totalRevenueUSD: revenueTotal || 0,
        assetsNearingDisposalWithin30Days: disposalAlerts,
      },
      fallback: `${totalCompanies} ${totalCompanies === 1 ? 'company is' : 'companies are'} tracking ${totalAssets} assets across ${totalUsers} users, with ${activeSubs} active ${activeSubs === 1 ? 'subscription' : 'subscriptions'}${pastDueSubs > 0 ? ` and ${pastDueSubs} past due` : ''}.`,
    });
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { listCompanies, getCompany, updateCompanyStatus, deleteCompany, dashboardStats, aiInsights, globalSearch };
