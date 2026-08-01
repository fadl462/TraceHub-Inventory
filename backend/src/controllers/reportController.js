const { Op, fn, col, literal } = require('sequelize');
const {
  Asset, AssetCategory, Assignment, AssetLocationEvent, Location,
} = require('../models');
const { generateInsight } = require('../utils/aiInsights');

/** Company-level dashboard KPIs */
async function companyOverview(req, res, next) {
  try {
    const companyId = req.companyId;
    const [total, available, assigned, maintenance, disposed] = await Promise.all([
      Asset.count({ where: { companyId, isArchived: false } }),
      Asset.count({ where: { companyId, status: 'available' } }),
      Asset.count({ where: { companyId, status: 'assigned' } }),
      Asset.count({ where: { companyId, status: 'in_maintenance' } }),
      Asset.count({ where: { companyId, status: 'disposed' } }),
    ]);

    const totalPurchaseValue = await Asset.sum('purchasePrice', { where: { companyId, isArchived: false } });
    const totalCurrentValue = await Asset.sum('aiEstimatedCurrentValue', { where: { companyId, isArchived: false } });

    const activeAssignments = await Assignment.count({ where: { companyId, status: 'active' } });
    const overdueAssignments = await Assignment.count({
      where: {
        companyId,
        status: 'active',
        expectedReturnDate: { [Op.lt]: new Date().toISOString().slice(0, 10) },
      },
    });

    const upcomingDisposals = await Asset.count({
      where: {
        companyId,
        isArchived: false,
        aiSuggestedDisposalDate: {
          [Op.between]: [new Date().toISOString().slice(0, 10), new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10)],
        },
      },
    });

    res.json({
      assetCounts: { total, available, assigned, maintenance, disposed },
      totalPurchaseValue: totalPurchaseValue || 0,
      totalCurrentValue: totalCurrentValue || 0,
      activeAssignments,
      overdueAssignments,
      upcomingDisposals,
    });
  } catch (err) { next(err); }
}

/** Asset usage/status breakdown by category, for charting */
async function assetsByCategory(req, res, next) {
  try {
    const results = await Asset.findAll({
      where: { companyId: req.companyId, isArchived: false },
      attributes: ['categoryId', [fn('COUNT', col('Asset.id')), 'count']],
      include: [{ model: AssetCategory, attributes: ['name'] }],
      group: ['categoryId', 'AssetCategory.id'],
    });
    res.json({ breakdown: results });
  } catch (err) { next(err); }
}

/** Depreciation report: current value vs purchase value per asset */
async function depreciationReport(req, res, next) {
  try {
    const assets = await Asset.findAll({
      where: { companyId: req.companyId, isArchived: false, purchasePrice: { [Op.ne]: null } },
      attributes: [
        'id', 'name', 'assetTag', 'purchasePrice', 'aiEstimatedCurrentValue',
        'aiScrapValue', 'aiSuggestedDisposalDate', 'manufactureYear', 'purchaseDate',
      ],
      include: [{ model: AssetCategory, attributes: ['name'] }],
      order: [['aiSuggestedDisposalDate', 'ASC']],
    });
    res.json({ assets });
  } catch (err) { next(err); }
}

/** Location history / movement report across the fleet */
async function locationActivityReport(req, res, next) {
  try {
    const { from, to } = req.query;
    const where = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt[Op.gte] = new Date(from);
      if (to) where.createdAt[Op.lte] = new Date(to);
    }
    const events = await AssetLocationEvent.findAll({
      where,
      include: [
        { model: Asset, where: { companyId: req.companyId }, attributes: ['id', 'name', 'assetTag'] },
        { model: Location, attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 500,
    });
    res.json({ events });
  } catch (err) { next(err); }
}

/** AI-generated natural-language summary of this company's own asset/assignment data */
async function aiInsights(req, res, next) {
  try {
    const companyId = req.companyId;
    const [total, assigned, maintenance] = await Promise.all([
      Asset.count({ where: { companyId, isArchived: false } }),
      Asset.count({ where: { companyId, status: 'assigned' } }),
      Asset.count({ where: { companyId, status: 'in_maintenance' } }),
    ]);
    const totalCurrentValue = await Asset.sum('aiEstimatedCurrentValue', { where: { companyId, isArchived: false } });
    const overdueAssignments = await Assignment.count({
      where: { companyId, status: 'active', expectedReturnDate: { [Op.lt]: new Date().toISOString().slice(0, 10) } },
    });
    const upcomingDisposals = await Asset.count({
      where: {
        companyId, isArchived: false,
        aiSuggestedDisposalDate: {
          [Op.between]: [new Date().toISOString().slice(0, 10), new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10)],
        },
      },
    });

    const result = await generateInsight({
      systemContext: `You are summarizing this specific company's asset data for ${req.user.role.replace('_', ' ')} on their TraceHub Inventory dashboard. Be specific and actionable, not generic.`,
      stats: {
        totalAssets: total, currentlyAssigned: assigned, inMaintenance: maintenance,
        totalCurrentBookValueUSD: Math.round(totalCurrentValue || 0),
        overdueAssignments, assetsWithDisposalDateInNext90Days: upcomingDisposals,
      },
      fallback: total === 0
        ? 'No assets registered yet \u2014 add your first one to start tracking depreciation and location.'
        : `${total} assets tracked, ${assigned} currently assigned${overdueAssignments > 0 ? `, ${overdueAssignments} overdue for return` : ''}${upcomingDisposals > 0 ? `, and ${upcomingDisposals} approaching their suggested disposal date` : ''}.`,
    });
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { companyOverview, assetsByCategory, depreciationReport, locationActivityReport, aiInsights };
