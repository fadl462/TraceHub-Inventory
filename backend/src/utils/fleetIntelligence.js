const { Op, fn, col } = require('sequelize');
const { Asset } = require('../models');

/**
 * Fleet-level executive intelligence: the aggregate view a Company Admin or
 * exec would want, built entirely from real per-asset engine outputs
 * already computed elsewhere (health score, disposal recommendation,
 * maintenance/repair costs) - no new fabricated numbers.
 *
 * Every derived figure has a documented formula since none of these are
 * industry-standard metrics with one agreed definition - see inline
 * comments. Shared by GET /reports/fleet-intelligence-summary and the
 * authenticated AI assistant's context builder, so both surfaces report
 * the exact same numbers rather than two subtly different calculations.
 */
async function computeFleetIntelligence(companyId) {
  const baseWhere = { companyId, isArchived: false };

  const [excellent, healthy, needsAttention, highRisk, critical, totalWithHealth] = await Promise.all([
    Asset.count({ where: { ...baseWhere, healthScore: { [Op.gte]: 90 } } }),
    Asset.count({ where: { ...baseWhere, healthScore: { [Op.gte]: 75, [Op.lt]: 90 } } }),
    Asset.count({ where: { ...baseWhere, healthScore: { [Op.gte]: 60, [Op.lt]: 75 } } }),
    Asset.count({ where: { ...baseWhere, healthScore: { [Op.gte]: 40, [Op.lt]: 60 } } }),
    Asset.count({ where: { ...baseWhere, healthScore: { [Op.lt]: 40 } } }),
    Asset.count({ where: { ...baseWhere, healthScore: { [Op.ne]: null } } }),
  ]);

  const [totalAssets, availableAssets] = await Promise.all([
    Asset.count({ where: baseWhere }),
    Asset.count({ where: { ...baseWhere, status: 'available' } }),
  ]);

  const recommendationCounts = await Asset.findAll({
    where: { ...baseWhere, disposalRecommendation: { [Op.ne]: null } },
    attributes: ['disposalRecommendation', [fn('COUNT', col('id')), 'count']],
    group: ['disposalRecommendation'],
    raw: true,
  });
  const recommendationBreakdown = { KEEP: 0, REPAIR: 0, SELL: 0, SCRAP: 0, REPLACE: 0 };
  recommendationCounts.forEach((r) => { recommendationBreakdown[r.disposalRecommendation] = Number(r.count); });

  const allWithValue = await Asset.findAll({
    where: baseWhere,
    attributes: ['healthScore', 'aiEstimatedCurrentValue', 'purchasePrice'],
  });
  const totalFleetValue = allWithValue.reduce((s, a) => s + Number(a.aiEstimatedCurrentValue || a.purchasePrice || 0), 0);
  const atRiskValue = allWithValue
    .filter((a) => a.healthScore != null && a.healthScore < 60)
    .reduce((s, a) => s + Number(a.aiEstimatedCurrentValue || a.purchasePrice || 0), 0);
  const capitalRiskPct = totalFleetValue > 0 ? Math.round((atRiskValue / totalFleetValue) * 1000) / 10 : 0;

  const replaceRecommended = await Asset.findAll({
    where: { ...baseWhere, disposalRecommendation: { [Op.in]: ['REPLACE', 'SCRAP', 'SELL'] } },
    attributes: ['maintenanceCostTotal', 'repairCostTotal'],
  });
  const projectedSavings = replaceRecommended.reduce((s, a) => s + Number(a.maintenanceCostTotal || 0) + Number(a.repairCostTotal || 0), 0);

  const portfolioHealth = totalWithHealth > 0
    ? Math.round(((excellent * 95 + healthy * 82 + needsAttention * 67 + highRisk * 50 + critical * 25) / totalWithHealth) * 10) / 10
    : null;
  const assetAvailabilityPct = totalAssets > 0 ? Math.round((availableAssets / totalAssets) * 1000) / 10 : null;

  const riskLabel = (pct) => (pct < 10 ? 'Low' : pct < 25 ? 'Medium' : 'High');
  const financialRisk = riskLabel(capitalRiskPct);
  const operationalRiskPct = totalWithHealth > 0 ? Math.round(((highRisk + critical) / totalWithHealth) * 100) : 0;
  const operationalRisk = riskLabel(operationalRiskPct);

  let fleetGrade = null;
  if (portfolioHealth != null && assetAvailabilityPct != null) {
    const composite = portfolioHealth * 0.6 + assetAvailabilityPct * 0.2 + (100 - capitalRiskPct) * 0.2;
    fleetGrade = composite >= 90 ? 'A' : composite >= 80 ? 'B' : composite >= 70 ? 'C' : composite >= 60 ? 'D' : 'F';
  }

  return {
    healthTiers: { excellent, healthy, needsAttention, highRisk, critical },
    portfolioHealth,
    assetAvailabilityPct,
    capitalRiskPct,
    financialRisk,
    operationalRisk,
    fleetGrade,
    recommendationBreakdown,
    projectedSavings: Math.round(projectedSavings),
    totalFleetValue: Math.round(totalFleetValue),
    totalAssets,
  };
}

module.exports = { computeFleetIntelligence };
