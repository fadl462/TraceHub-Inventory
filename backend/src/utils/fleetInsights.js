/**
 * TraceHub AI Insights Panel
 * ==========================
 * The spec asks for executive-facing sentences like "Thirty-two laptops are
 * depreciating faster than expected due to heavy usage." This module
 * generates that class of insight - but as real, rule-based pattern
 * detection over the company's actual stored data, with the exact
 * asset/category names and numbers substituted in. No sentence here is
 * templated fluff with fabricated figures; every number comes from a query.
 *
 * Each detector is independent and returns zero or more insights; a detector
 * finding nothing simply contributes nothing, rather than forcing a sentence.
 */

const IDLE_HOURS_THRESHOLD = 200; // matches the existing "Idle assets" KPI threshold elsewhere in the app
const MAINTENANCE_BUDGET_RATIO = 0.20; // assumption: a healthy asset's lifetime maintenance+repair spend stays under ~20% of its replacement cost - documented here since the spec doesn't define this number
const MAINTENANCE_ALARM_RATIO = 0.65; // spec's own worked example threshold ("exceeds 65% of replacement value")
const END_OF_LIFE_WINDOW_DAYS = 180;

async function generateFleetInsights(companyId, { Asset, AssetCategory }) {
  const assets = await Asset.findAll({
    where: { companyId, isArchived: false },
    include: [{ model: AssetCategory, attributes: ['id', 'name'] }],
  });

  const insights = [];
  const today = new Date();
  const in180Days = new Date(Date.now() + END_OF_LIFE_WINDOW_DAYS * 86400000);

  // Group by category for the fleet-wide patterns
  const byCategory = new Map();
  assets.forEach((a) => {
    const key = a.AssetCategory?.name || 'Uncategorized';
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(a);
  });

  // --- 1. Heavy-usage assets depreciating faster than their category's norm ---
  byCategory.forEach((catAssets, categoryName) => {
    const withValue = catAssets.filter((a) => a.purchasePrice > 0 && a.aiEstimatedCurrentValue != null);
    if (withValue.length < 2) return;
    const ratios = withValue.map((a) => Number(a.aiEstimatedCurrentValue) / Number(a.purchasePrice));
    const avgRatio = ratios.reduce((s, r) => s + r, 0) / ratios.length;
    const heavyUnderperformers = withValue.filter((a, i) => (
      ['heavy', 'extreme'].includes(a.usageIntensity) && ratios[i] < avgRatio * 0.85
    ));
    if (heavyUnderperformers.length >= 2) {
      insights.push({
        type: 'accelerated_depreciation',
        severity: 'warning',
        text: `${heavyUnderperformers.length} asset${heavyUnderperformers.length === 1 ? '' : 's'} in ${categoryName} ${heavyUnderperformers.length === 1 ? 'is' : 'are'} depreciating faster than the category average due to heavy usage.`,
        assetIds: heavyUnderperformers.map((a) => a.id),
      });
    }
  });

  // --- 2. A single asset whose upkeep has blown past its own maintenance budget ---
  const replacementBudgetOffenders = assets
    .map((a) => {
      const replacementCost = Number(a.currentReplacementCost || a.purchasePrice || 0);
      if (replacementCost <= 0) return null;
      const budget = replacementCost * MAINTENANCE_BUDGET_RATIO;
      const spent = Number(a.maintenanceCostTotal || 0) + Number(a.repairCostTotal || 0);
      if (budget <= 0 || spent <= budget) return null;
      const overPct = Math.round(((spent - budget) / budget) * 100);
      return { asset: a, overPct, spent, budget };
    })
    .filter(Boolean)
    .sort((a, b) => b.overPct - a.overPct);

  if (replacementBudgetOffenders.length > 0) {
    const top = replacementBudgetOffenders[0];
    insights.push({
      type: 'maintenance_budget_exceeded',
      severity: 'danger',
      text: `${top.asset.name}${top.asset.assetTag ? ` (${top.asset.assetTag})` : ''} has exceeded its projected maintenance budget by ${top.overPct}%; replacement is likely more economical than continued repair.`,
      assetIds: [top.asset.id],
    });
  }

  // --- 3. Assets approaching end-of-life within the window, by category ---
  byCategory.forEach((catAssets, categoryName) => {
    const nearing = catAssets.filter((a) => a.aiSuggestedDisposalDate
      && a.aiSuggestedDisposalDate >= today.toISOString().slice(0, 10)
      && a.aiSuggestedDisposalDate <= in180Days.toISOString().slice(0, 10));
    if (nearing.length >= 1) {
      insights.push({
        type: 'approaching_end_of_life',
        severity: 'warning',
        text: `${nearing.length} asset${nearing.length === 1 ? '' : 's'} in ${categoryName} ${nearing.length === 1 ? 'is' : 'are'} approaching end-of-life within the next ${Math.round(END_OF_LIFE_WINDOW_DAYS / 30)} months.`,
        assetIds: nearing.map((a) => a.id),
      });
    }
  });

  // --- 4. Idle assets sitting unused, by category ---
  byCategory.forEach((catAssets, categoryName) => {
    const idle = catAssets.filter((a) => a.status === 'available' && Number(a.idleTimeHours || 0) >= IDLE_HOURS_THRESHOLD);
    if (idle.length >= 1) {
      insights.push({
        type: 'idle_assets',
        severity: 'info',
        text: `${idle.length} asset${idle.length === 1 ? '' : 's'} in ${categoryName} ${idle.length === 1 ? 'has' : 'have'} logged over ${IDLE_HOURS_THRESHOLD} idle hours and could be reassigned or sold.`,
        assetIds: idle.map((a) => a.id),
      });
    }
  });

  // --- 5. Category-wide maintenance spend vs. replacement value ---
  byCategory.forEach((catAssets, categoryName) => {
    const withReplacement = catAssets.filter((a) => Number(a.currentReplacementCost || a.purchasePrice || 0) > 0);
    if (withReplacement.length < 2) return;
    const totalUpkeep = withReplacement.reduce((s, a) => s + Number(a.maintenanceCostTotal || 0) + Number(a.repairCostTotal || 0), 0);
    const totalReplacement = withReplacement.reduce((s, a) => s + Number(a.currentReplacementCost || a.purchasePrice || 0), 0);
    if (totalReplacement <= 0) return;
    const ratio = totalUpkeep / totalReplacement;
    if (ratio >= MAINTENANCE_ALARM_RATIO) {
      insights.push({
        type: 'category_maintenance_alarm',
        severity: 'danger',
        text: `Cumulative maintenance spend on ${withReplacement.length} assets in ${categoryName} now exceeds ${Math.round(ratio * 100)}% of their combined replacement value.`,
        assetIds: withReplacement.map((a) => a.id),
      });
    }
  });

  return insights;
}

module.exports = { generateFleetInsights, IDLE_HOURS_THRESHOLD, MAINTENANCE_BUDGET_RATIO, MAINTENANCE_ALARM_RATIO, END_OF_LIFE_WINDOW_DAYS };
