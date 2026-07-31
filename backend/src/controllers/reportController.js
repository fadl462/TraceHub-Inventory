const { Op, fn, col, literal } = require('sequelize');
const {
  Asset, AssetCategory, Assignment, AssetLocationEvent, Location,
} = require('../models');

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

module.exports = { companyOverview, assetsByCategory, depreciationReport, locationActivityReport };
