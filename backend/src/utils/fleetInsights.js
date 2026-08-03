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

/**
 * Locale-aware sentence templates for each detector. Kept as plain
 * functions (not a translation-key/interpolation system) since these are
 * full generated sentences with real grammar decisions (English singular/
 * plural verb forms, for example) that don't map cleanly onto simple
 * placeholder substitution the way static UI strings do.
 */
const TEMPLATES = {
  en: {
    acceleratedDepreciation: (count, categoryName) => `${count} asset${count === 1 ? '' : 's'} in ${categoryName} ${count === 1 ? 'is' : 'are'} depreciating faster than the category average due to heavy usage.`,
    maintenanceBudgetExceeded: (assetLabel, overPct) => `${assetLabel} has exceeded its projected maintenance budget by ${overPct}%; replacement is likely more economical than continued repair.`,
    approachingEndOfLife: (count, categoryName, months) => `${count} asset${count === 1 ? '' : 's'} in ${categoryName} ${count === 1 ? 'is' : 'are'} approaching end-of-life within the next ${months} months.`,
    idleAssets: (count, categoryName, hours) => `${count} asset${count === 1 ? '' : 's'} in ${categoryName} ${count === 1 ? 'has' : 'have'} logged over ${hours} idle hours and could be reassigned or sold.`,
    categoryMaintenanceAlarm: (count, categoryName, pct) => `Cumulative maintenance spend on ${count} assets in ${categoryName} now exceeds ${pct}% of their combined replacement value.`,
  },
  fr: {
    acceleratedDepreciation: (count, categoryName) => `${count} actif${count === 1 ? '' : 's'} de la catégorie ${categoryName} se déprécie${count === 1 ? '' : 'nt'} plus vite que la moyenne de la catégorie en raison d'un usage intensif.`,
    maintenanceBudgetExceeded: (assetLabel, overPct) => `${assetLabel} a dépassé son budget de maintenance prévu de ${overPct}% ; un remplacement est probablement plus économique qu'une réparation continue.`,
    approachingEndOfLife: (count, categoryName, months) => `${count} actif${count === 1 ? '' : 's'} de la catégorie ${categoryName} approche${count === 1 ? '' : 'nt'} de la fin de vie dans les ${months} prochains mois.`,
    idleAssets: (count, categoryName, hours) => `${count} actif${count === 1 ? '' : 's'} de la catégorie ${categoryName} totalise${count === 1 ? '' : 'nt'} plus de ${hours} heures d'inactivité et pourrai${count === 1 ? 't' : 'ent'} être réaffecté${count === 1 ? '' : 's'} ou vendu${count === 1 ? '' : 's'}.`,
    categoryMaintenanceAlarm: (count, categoryName, pct) => `Les dépenses de maintenance cumulées sur ${count} actifs de la catégorie ${categoryName} dépassent désormais ${pct}% de leur valeur de remplacement combinée.`,
  },
  es: {
    acceleratedDepreciation: (count, categoryName) => `${count} activo${count === 1 ? '' : 's'} en ${categoryName} se está${count === 1 ? '' : 'n'} depreciando más rápido que el promedio de la categoría debido al uso intensivo.`,
    maintenanceBudgetExceeded: (assetLabel, overPct) => `${assetLabel} ha excedido su presupuesto de mantenimiento proyectado en ${overPct}%; el reemplazo probablemente sea más económico que continuar reparando.`,
    approachingEndOfLife: (count, categoryName, months) => `${count} activo${count === 1 ? '' : 's'} en ${categoryName} se acerca${count === 1 ? '' : 'n'} al fin de su vida útil dentro de los próximos ${months} meses.`,
    idleAssets: (count, categoryName, hours) => `${count} activo${count === 1 ? '' : 's'} en ${categoryName} ha${count === 1 ? '' : 'n'} registrado más de ${hours} horas inactivas y podría${count === 1 ? '' : 'n'} ser reasignado${count === 1 ? '' : 's'} o vendido${count === 1 ? '' : 's'}.`,
    categoryMaintenanceAlarm: (count, categoryName, pct) => `El gasto de mantenimiento acumulado en ${count} activos de ${categoryName} ahora excede el ${pct}% de su valor de reemplazo combinado.`,
  },
};

async function generateFleetInsights(companyId, { Asset, AssetCategory }, locale = 'en') {
  const t = TEMPLATES[locale] || TEMPLATES.en;
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
        text: t.acceleratedDepreciation(heavyUnderperformers.length, categoryName),
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
      text: t.maintenanceBudgetExceeded(`${top.asset.name}${top.asset.assetTag ? ` (${top.asset.assetTag})` : ''}`, top.overPct),
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
        text: t.approachingEndOfLife(nearing.length, categoryName, Math.round(END_OF_LIFE_WINDOW_DAYS / 30)),
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
        text: t.idleAssets(idle.length, categoryName, IDLE_HOURS_THRESHOLD),
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
        text: t.categoryMaintenanceAlarm(withReplacement.length, categoryName, Math.round(ratio * 100)),
        assetIds: withReplacement.map((a) => a.id),
      });
    }
  });

  return insights;
}

module.exports = { generateFleetInsights, IDLE_HOURS_THRESHOLD, MAINTENANCE_BUDGET_RATIO, MAINTENANCE_ALARM_RATIO, END_OF_LIFE_WINDOW_DAYS };
