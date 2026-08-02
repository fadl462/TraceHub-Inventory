const { Op, fn, col, literal } = require('sequelize');
const { computeFleetIntelligence } = require('../utils/fleetIntelligence');
const {
  Asset, AssetCategory, Assignment, AssetLocationEvent, Location, User,
} = require('../models');
const { generateInsight } = require('../utils/aiInsights');
const { generateFleetInsights } = require('../utils/fleetInsights');
const { getCompanyReliability } = require('../utils/learningLoop');
const { DisposalCase } = require('../models');

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

/**
 * Intelligence-engine dashboard KPIs (Assets Near Disposal, Warranty
 * Expiring, Idle Assets, etc. from the spec). Kept as a separate endpoint
 * from companyOverview above so nothing already depending on that
 * endpoint's shape is at risk of breaking.
 */
async function intelligenceOverview(req, res, next) {
  try {
    const companyId = req.companyId;
    const today = new Date().toISOString().slice(0, 10);
    const in60Days = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10);

    const [healthyCount, criticalCount, nearDisposalCount, dueMaintenanceCount, warrantyExpiringCount, idleCount] = await Promise.all([
      Asset.count({ where: { companyId, isArchived: false, healthScore: { [Op.gte]: 75 } } }),
      Asset.count({ where: { companyId, isArchived: false, healthScore: { [Op.lt]: 40 } } }),
      Asset.count({ where: { companyId, isArchived: false, disposalReadinessScore: { [Op.gte]: 65 } } }),
      // "Due maintenance" = either a calibration due/overdue (for equipment
      // that needs calibration), OR the Maintenance Scheduling Engine's own
      // predicted next-service date has arrived - calibrationStatus alone
      // would miss every asset that doesn't need calibration at all.
      Asset.count({
        where: {
          companyId, isArchived: false,
          [Op.or]: [
            { calibrationStatus: { [Op.in]: ['due_soon', 'overdue'] } },
            { nextServiceDate: { [Op.lte]: in60Days } },
          ],
        },
      }),
      Asset.count({ where: { companyId, isArchived: false, warrantyExpiry: { [Op.between]: [today, in60Days] } } }),
      Asset.count({ where: { companyId, isArchived: false, status: 'available', idleTimeHours: { [Op.gte]: 200 } } }),
    ]);

    const [mostValuable, mostRepaired, mostExpensiveToMaintain] = await Promise.all([
      Asset.findAll({
        where: { companyId, isArchived: false }, order: [['aiEstimatedCurrentValue', 'DESC']], limit: 5,
        attributes: ['id', 'name', 'assetTag', 'aiEstimatedCurrentValue', 'currency'],
      }),
      Asset.findAll({
        where: { companyId, isArchived: false, repairCount: { [Op.gt]: 0 } }, order: [['repairCount', 'DESC']], limit: 5,
        attributes: ['id', 'name', 'assetTag', 'repairCount', 'repairCostTotal'],
      }),
      Asset.findAll({
        where: { companyId, isArchived: false }, order: [[literal('"maintenanceCostTotal" + "repairCostTotal"'), 'DESC']], limit: 5,
        attributes: ['id', 'name', 'assetTag', 'maintenanceCostTotal', 'repairCostTotal', 'currency'],
      }),
    ]);

    // Budget/loss projections - real sums over stored engine outputs, not
    // fabricated figures. Documented here since the spec doesn't define
    // exact formulas for these cards, only their names:
    //
    // "Replacement budget needed" = money needed RIGHT NOW for assets the
    // Disposal Engine already recommends replacing/scrapping/selling.
    // "Projected replacement cost" is a genuinely different, forward-looking
    // number: assets NOT yet flagged today but whose engine-suggested
    // disposal date falls within the next 12 months - i.e. what's coming
    // down the pipe next, not what's due today.
    const flaggedAssets = await Asset.findAll({
      where: { companyId, isArchived: false, disposalRecommendation: { [Op.in]: ['SELL', 'SCRAP', 'REPLACE'] } },
      attributes: ['currentReplacementCost', 'purchasePrice'],
    });
    const replacementBudget = flaggedAssets.reduce((sum, a) => sum + Number(a.currentReplacementCost || a.purchasePrice || 0), 0);
    const projectedDisposalCost = Math.round(replacementBudget * 0.05); // handling/logistics estimate

    const in12Months = new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10);
    const upcomingAssets = await Asset.findAll({
      where: {
        companyId, isArchived: false,
        disposalRecommendation: { [Op.notIn]: ['SELL', 'SCRAP', 'REPLACE'] }, // exclude what's already counted in replacementBudget above
        aiSuggestedDisposalDate: { [Op.ne]: null, [Op.lte]: in12Months },
      },
      attributes: ['currentReplacementCost', 'purchasePrice'],
    });
    const projectedReplacementCost = upcomingAssets.reduce((sum, a) => sum + Number(a.currentReplacementCost || a.purchasePrice || 0), 0);

    const allAssets = await Asset.findAll({
      where: { companyId, isArchived: false },
      attributes: ['purchasePrice', 'aiScrapValue', 'aiUsefulLifeYears'],
    });
    const annualDepreciationTotal = allAssets.reduce((sum, a) => {
      const life = Number(a.aiUsefulLifeYears) || 0;
      if (!life) return sum;
      const annual = (Number(a.purchasePrice || 0) - Number(a.aiScrapValue || 0)) / life;
      return sum + Math.max(0, annual);
    }, 0);

    res.json({
      healthyCount, criticalCount, nearDisposalCount, dueMaintenanceCount, warrantyExpiringCount, idleCount,
      mostValuable, mostRepaired, mostExpensiveToMaintain,
      replacementBudget: Math.round(replacementBudget),
      projectedDisposalCost,
      projectedReplacementCost: Math.round(projectedReplacementCost), // 12-month forward view over assets NOT yet flagged today
      depreciationToday: Math.round((annualDepreciationTotal / 365) * 100) / 100,
      monthlyAssetLoss: Math.round((annualDepreciationTotal / 12) * 100) / 100,
    });
  } catch (err) { next(err); }
}

/**
 * AI Insights Panel: rule-based pattern detection across the whole fleet
 * (see utils/fleetInsights.js). Every sentence here is generated from a real
 * query against this company's own asset data - no fabricated figures.
 */
async function fleetInsightsReport(req, res, next) {
  try {
    const insights = await generateFleetInsights(req.companyId, { Asset, AssetCategory });
    res.json({ insights });
  } catch (err) { next(err); }
}

/** AI Learning Loop transparency panel: how reliable this company's history shows the disposal engine to be. */
async function learningLoopReport(req, res, next) {
  try {
    const stats = await getCompanyReliability(req.companyId, { DisposalCase });
    res.json(stats);
  } catch (err) { next(err); }
}

/**
 * Full assignment tracking for the dashboard: who has what, when it was
 * issued, when it's due back, how many days it's been out (or overdue),
 * and full contact info - so admins never have to click into each asset
 * to see who to chase.
 */
async function assignmentTrackingReport(req, res, next) {
  try {
    const companyId = req.companyId;
    const rows = await Assignment.findAll({
      where: { companyId, status: { [Op.in]: ['active', 'overdue'] } },
      include: [
        { model: Asset, attributes: ['id', 'name', 'assetTag'] },
        { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'role'] },
      ],
      order: [['expectedReturnDate', 'ASC']],
    });

    const today = new Date();
    const assignments = rows.map((a) => {
      const daysHeld = Math.max(0, Math.floor((today - new Date(a.assignedAt)) / 86400000));
      const daysOverdue = a.expectedReturnDate
        ? Math.max(0, Math.floor((today - new Date(a.expectedReturnDate)) / 86400000))
        : 0;
      return {
        id: a.id,
        asset: a.Asset ? { id: a.Asset.id, name: a.Asset.name, assetTag: a.Asset.assetTag } : null,
        assigneeName: a.assignee ? `${a.assignee.firstName} ${a.assignee.lastName}` : a.externalAssigneeName,
        assigneeType: a.assignee ? 'staff' : 'external',
        assigneeRole: a.assignee?.role || null,
        contactEmail: a.assignee?.email || a.externalAssigneeEmail || null,
        contactPhone: a.assignee?.phone || a.externalAssigneePhone || null,
        assignedAt: a.assignedAt,
        expectedReturnDate: a.expectedReturnDate,
        daysHeld,
        isOverdue: a.status === 'overdue' || (a.expectedReturnDate && a.expectedReturnDate < today.toISOString().slice(0, 10)),
        daysOverdue,
        purpose: a.purpose,
      };
    });

    res.json({ assignments });
  } catch (err) { next(err); }
}

/**
 * Fleet-level executive intelligence: the aggregate view a Company Admin or
 * exec would want, built entirely from real per-asset engine outputs
 * already computed elsewhere (health score, disposal recommendation,
 * maintenance/repair costs) - no new fabricated numbers.
 *
 * Every derived figure below has a documented formula since none of these
 * are industry-standard metrics with one agreed definition:
 *
 * - Health tier counts: the exact same 5 bands the Health Score engine
 *   itself uses (Excellent >=90, Healthy >=75, Needs Attention >=60,
 *   High Risk >=40, Critical <40) - not a separate UI-invented scale.
 * - Portfolio Health: average health score across all non-archived assets
 *   that have one computed yet.
 * - Asset Availability: % of assets currently in 'available' status.
 * - Capital Risk: % of total current fleet value that sits in High Risk
 *   or Critical health-tier assets - i.e. how much of your money is tied
 *   up in equipment that's actually at risk, not just a headcount.
 * - Projected Savings: sum of this-year maintenance+repair spend on
 *   assets the Disposal Engine already recommends replacing - money
 *   you'd stop spending if you acted on the recommendation, not a
 *   speculative "AI predicts you'll save X" claim.
 * - Financial/Operational Risk labels and Fleet Grade: our own documented
 *   thresholds on the above, not an external framework.
 */
async function fleetIntelligenceSummary(req, res, next) {
  try {
    const result = await computeFleetIntelligence(req.companyId);
    res.json(result);
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

module.exports = {
  companyOverview, intelligenceOverview, assetsByCategory, depreciationReport, locationActivityReport, aiInsights,
  fleetInsightsReport, learningLoopReport, assignmentTrackingReport, fleetIntelligenceSummary,
};
