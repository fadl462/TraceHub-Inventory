/**
 * TraceHub Asset Intelligence Engine (TAIE)
 * ==========================================
 * Five engines that each answer one question about an asset:
 *   1. Depreciation  - what is this asset worth today?
 *   2. Health        - how healthy is this asset?
 *   3. Failure       - when is this asset likely to fail?
 *   4. Disposal      - when/how should this asset be disposed of?
 *   5. Executive     - what should management actually do about it?
 *
 * HONESTY NOTE: these are genuine, deterministic weighted-scoring formulas -
 * real math running on real data - not trained machine learning models.
 * The spec that requested this ("AI models", "confidence scores") describes
 * weighted formulas throughout (e.g. "Age 20%, Maintenance 25%..."), which is
 * exactly what's implemented here. Nothing here claims to be a neural network
 * or to have learned from training data it hasn't seen. The "AI Confidence"
 * score is a genuine data-completeness metric (see calculateConfidence),
 * not a model's self-reported certainty.
 *
 * Every weight/threshold below is a reasonable default, not a universal
 * constant - they're intentionally centralized here so they can be tuned per
 * category or company later without touching the calling code.
 */

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const num = (v, fallback = 0) => (v === null || v === undefined || Number.isNaN(Number(v)) ? fallback : Number(v));

// ---------------------------------------------------------------------------
// Safe custom-formula evaluator for the "Custom Formula" depreciation method.
//
// This intentionally does NOT use eval()/new Function()/vm - a user-supplied
// formula string is untrusted input, and arbitrary JS evaluation of untrusted
// input is a code-execution risk regardless of what field it's stored in.
// Instead this is a tiny hand-rolled recursive-descent parser that only
// understands: numbers, + - * / ^ ( ) unary minus, and identifiers drawn from
// a fixed variable whitelist. Anything else (function calls, assignment,
// semicolons, property access, etc.) is a parse error, not a security hole.
// ---------------------------------------------------------------------------

const CUSTOM_FORMULA_VARIABLES = new Set([
  'cost', 'residual', 'lifeYears', 'age', 'hoursUsed', 'mileage', 'operatingCycles',
  'repairCount', 'maintenanceCount', 'maintenanceCostTotal', 'repairCostTotal',
]);

function tokenizeFormula(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i += 1; continue; }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j += 1;
      const raw = src.slice(i, j);
      if (!/^\d*\.?\d+$/.test(raw)) throw new Error(`Invalid number "${raw}" in custom formula`);
      tokens.push({ type: 'num', value: Number(raw) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i;
      while (j < src.length && /[a-zA-Z0-9_]/.test(src[j])) j += 1;
      const name = src.slice(i, j);
      if (!CUSTOM_FORMULA_VARIABLES.has(name)) {
        throw new Error(`Unknown variable "${name}" in custom formula. Allowed: ${[...CUSTOM_FORMULA_VARIABLES].join(', ')}`);
      }
      tokens.push({ type: 'var', value: name });
      i = j;
      continue;
    }
    if ('+-*/^()'.includes(ch)) { tokens.push({ type: 'op', value: ch }); i += 1; continue; }
    throw new Error(`Unexpected character "${ch}" in custom formula`);
  }
  return tokens;
}

/** Recursive-descent parser/evaluator: expr := term (('+'|'-') term)*; term := factor (('*'|'/') factor)*; factor := ('-')? primary ('^' factor)?; primary := number | var | '(' expr ')' */
function evaluateCustomFormula(formulaSrc, variables) {
  const tokens = tokenizeFormula(formulaSrc);
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos += 1] && tokens[pos - 1];

  function parsePrimary() {
    const t = peek();
    if (!t) throw new Error('Unexpected end of custom formula');
    if (t.type === 'num') { next(); return t.value; }
    if (t.type === 'var') { next(); return num(variables[t.value]); }
    if (t.type === 'op' && t.value === '(') {
      next();
      const val = parseExpr();
      if (!peek() || peek().value !== ')') throw new Error('Missing closing ")" in custom formula');
      next();
      return val;
    }
    throw new Error('Invalid custom formula');
  }
  function parseFactor() {
    if (peek() && peek().type === 'op' && peek().value === '-') { next(); return -parseFactor(); }
    let base = parsePrimary();
    if (peek() && peek().type === 'op' && peek().value === '^') { next(); base **= parseFactor(); }
    return base;
  }
  function parseTerm() {
    let val = parseFactor();
    while (peek() && peek().type === 'op' && (peek().value === '*' || peek().value === '/')) {
      const op = next().value;
      const rhs = parseFactor();
      val = op === '*' ? val * rhs : val / rhs;
    }
    return val;
  }
  function parseExpr() {
    let val = parseTerm();
    while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = next().value;
      const rhs = parseTerm();
      val = op === '+' ? val + rhs : val - rhs;
    }
    return val;
  }

  const result = parseExpr();
  if (pos !== tokens.length) throw new Error('Unexpected trailing tokens in custom formula');
  if (!Number.isFinite(result)) throw new Error('Custom formula did not evaluate to a finite number');
  return result;
}

function ageInYears(purchaseDate, manufactureYear) {
  const ref = purchaseDate ? new Date(purchaseDate) : (manufactureYear ? new Date(`${manufactureYear}-01-01`) : null);
  if (!ref) return 0;
  return Math.max(0, (Date.now() - ref.getTime()) / (365.25 * 24 * 3600 * 1000));
}

// ---------------------------------------------------------------------------
// ENGINE 1 - Smart Depreciation Engine
// ---------------------------------------------------------------------------

const ENVIRONMENT_PENALTY = { low: 0, moderate: 0.06, high: 0.13 };
const CHEMICAL_PENALTY = { none: 0, occasional: 0.04, frequent: 0.10 };
const USAGE_FACTOR = { light: 0.85, normal: 1.0, heavy: 1.15, extreme: 1.3 };
const MARKET_FACTOR = { high: 0.9, moderate: 1.0, low: 1.1 };

/**
 * Computes current book value + annual depreciation using whichever method
 * is selected on the asset. All methods converge on the same three outputs
 * so the caller doesn't need to branch: { currentValue, annualDepreciation, method }.
 */
function calculateDepreciation(asset, profile) {
  const cost = num(asset.purchasePrice);
  const residual = asset.expectedResidualValue != null
    ? num(asset.expectedResidualValue)
    : cost * (num(profile?.scrapValuePercent, 10) / 100);
  const lifeYears = num(asset.lifeExpectancyYearsOverride) || num(profile?.usefulLifeYears, 5);
  const age = ageInYears(asset.purchaseDate, asset.manufactureYear);
  const method = asset.depreciationMethod || 'straight_line';

  const depreciableBase = Math.max(0, cost - residual);
  const straightLineAnnual = lifeYears > 0 ? depreciableBase / lifeYears : depreciableBase;

  let currentValue;

  switch (method) {
    case 'reducing_balance': {
      // Fixed annual rate such that value reaches residual exactly at end of life
      const rate = lifeYears > 0 && cost > 0 ? 1 - (residual / cost) ** (1 / lifeYears) : 0.2;
      currentValue = cost * (1 - rate) ** Math.min(age, lifeYears);
      break;
    }
    case 'double_declining_balance': {
      const rate = lifeYears > 0 ? 2 / lifeYears : 0.4;
      let bookValue = cost;
      for (let y = 0; y < Math.floor(age); y += 1) {
        bookValue = Math.max(residual, bookValue - bookValue * rate);
      }
      currentValue = bookValue;
      break;
    }
    case 'sum_of_years_digits': {
      const n = Math.max(1, Math.round(lifeYears));
      const syd = (n * (n + 1)) / 2;
      let accumulated = 0;
      for (let y = 0; y < Math.min(Math.floor(age), n); y += 1) {
        accumulated += ((n - y) / syd) * depreciableBase;
      }
      currentValue = Math.max(residual, cost - accumulated);
      break;
    }
    case 'units_of_production':
    case 'machine_hours':
    case 'mileage_based': {
      const unitsUsed = method === 'mileage_based' ? num(asset.mileage)
        : method === 'machine_hours' ? num(asset.hoursUsed)
          : num(asset.operatingCycles) || num(asset.hoursUsed);
      const capacity = num(asset.unitsProductionCapacity) || (lifeYears * 2000); // fallback: ~2000 hrs/yr equivalent
      const perUnit = capacity > 0 ? depreciableBase / capacity : 0;
      currentValue = Math.max(residual, cost - perUnit * unitsUsed);
      break;
    }
    case 'ai_adaptive': {
      const usageFactor = USAGE_FACTOR[asset.usageIntensity] || 1.0;
      const complianceGap = 100 - num(asset.maintenanceCompliance, 80);
      const maintenanceFactor = 1 + (complianceGap / 100) * 0.3 + Math.min(num(asset.repairCount), 10) * 0.02;
      const envPenalty = (ENVIRONMENT_PENALTY[asset.corrosionRisk] || 0)
        + (ENVIRONMENT_PENALTY[asset.dustExposure] || 0)
        + (CHEMICAL_PENALTY[asset.chemicalExposure] || 0)
        + (asset.outdoorExposure ? 0.05 : 0);
      const environmentFactor = 1 + envPenalty;
      const marketFactor = MARKET_FACTOR[asset.resaleDemand] || 1.0;
      const reliabilityGap = 100 - num(asset.assetReliability, 75);
      const reliabilityFactor = 1 + (reliabilityGap / 100) * 0.2 + Math.min(num(asset.failureCount), 5) * 0.03;

      const adaptiveAnnual = straightLineAnnual * usageFactor * maintenanceFactor * environmentFactor * marketFactor * reliabilityFactor;
      currentValue = Math.max(residual, cost - adaptiveAnnual * age);
      break;
    }
    case 'custom_formula': {
      const vars = {
        cost, residual, lifeYears, age,
        hoursUsed: num(asset.hoursUsed), mileage: num(asset.mileage), operatingCycles: num(asset.operatingCycles),
        repairCount: num(asset.repairCount), maintenanceCount: num(asset.maintenanceCount),
        maintenanceCostTotal: num(asset.maintenanceCostTotal), repairCostTotal: num(asset.repairCostTotal),
      };
      if (!asset.customDepreciationFormula) {
        // No formula supplied - fall back to straight-line rather than silently returning nonsense
        currentValue = Math.max(residual, cost - straightLineAnnual * age);
      } else {
        try {
          currentValue = evaluateCustomFormula(asset.customDepreciationFormula, vars);
        } catch (err) {
          // A broken formula must never crash asset save/read - fall back to straight-line
          // and surface the parse error so it can be fixed, rather than swallowing it silently.
          currentValue = Math.max(residual, cost - straightLineAnnual * age);
          return {
            method, currentValue: Math.round(currentValue * 100) / 100, annualDepreciation: Math.round(straightLineAnnual * 100) / 100,
            usefulLifeYears: lifeYears, scrapValue: Math.round(residual * 100) / 100, ageYears: Math.round(age * 100) / 100,
            customFormulaError: err.message,
          };
        }
      }
      break;
    }
    case 'straight_line':
    default: {
      currentValue = Math.max(residual, cost - straightLineAnnual * age);
    }
  }

  currentValue = clamp(currentValue, 0, cost || currentValue);

  return {
    method,
    currentValue: Math.round(currentValue * 100) / 100,
    annualDepreciation: Math.round(straightLineAnnual * 100) / 100,
    usefulLifeYears: lifeYears,
    scrapValue: Math.round(residual * 100) / 100,
    ageYears: Math.round(age * 100) / 100,
  };
}

// ---------------------------------------------------------------------------
// ENGINE 2 - Asset Health Score (0-100)
// ---------------------------------------------------------------------------

const HEALTH_WEIGHTS = { age: 0.20, maintenance: 0.25, repairs: 0.15, usage: 0.15, inspection: 0.15, environment: 0.10 };

function calculateHealthScore(asset, profile) {
  const lifeYears = num(asset.lifeExpectancyYearsOverride) || num(profile?.usefulLifeYears, 5);
  const age = ageInYears(asset.purchaseDate, asset.manufactureYear);

  const ageScore = clamp(100 * (1 - (lifeYears > 0 ? age / lifeYears : 0)));

  const maintenanceScore = asset.maintenanceCompliance != null
    ? clamp(num(asset.maintenanceCompliance))
    : clamp(100 - Math.max(0, 2 - num(asset.maintenanceCount)) * 15); // penalize under-maintained assets when compliance wasn't tracked directly

  const repairsScore = clamp(100 - Math.min(num(asset.repairCount), 10) * 10);

  const usageBase = { light: 100, normal: 85, heavy: 65, extreme: 40 }[asset.usageIntensity] ?? 85;
  const idleRatio = num(asset.hoursUsed) > 0 ? num(asset.idleTimeHours) / (num(asset.hoursUsed) + num(asset.idleTimeHours)) : 0;
  const usageScore = clamp(usageBase - idleRatio * 10);

  const inspectionScore = asset.inspectionScore != null ? clamp(num(asset.inspectionScore)) : 75;

  const envPenalty = (ENVIRONMENT_PENALTY[asset.corrosionRisk] || 0) * 100
    + (ENVIRONMENT_PENALTY[asset.dustExposure] || 0) * 100
    + (CHEMICAL_PENALTY[asset.chemicalExposure] || 0) * 100
    + (asset.outdoorExposure ? 8 : 0);
  const environmentScore = clamp(100 - envPenalty);

  const breakdown = {
    age: Math.round(ageScore), maintenance: Math.round(maintenanceScore), repairs: Math.round(repairsScore),
    usage: Math.round(usageScore), inspection: Math.round(inspectionScore), environment: Math.round(environmentScore),
  };

  const total = clamp(
    ageScore * HEALTH_WEIGHTS.age + maintenanceScore * HEALTH_WEIGHTS.maintenance
    + repairsScore * HEALTH_WEIGHTS.repairs + usageScore * HEALTH_WEIGHTS.usage
    + inspectionScore * HEALTH_WEIGHTS.inspection + environmentScore * HEALTH_WEIGHTS.environment,
  );

  let tier;
  if (total >= 90) tier = 'Excellent';
  else if (total >= 75) tier = 'Healthy';
  else if (total >= 60) tier = 'Needs Attention';
  else if (total >= 40) tier = 'High Risk';
  else tier = 'Critical';

  return { score: Math.round(total * 10) / 10, tier, breakdown };
}

// ---------------------------------------------------------------------------
// ENGINE 3 - Failure Prediction Engine
// ---------------------------------------------------------------------------

/**
 * Produces failure probability at three horizons from a single underlying
 * risk index, scaled so risk compounds over a longer window. This is a
 * transparent heuristic scaling, not a fitted survival curve - documented
 * here so nobody mistakes it for one.
 */
function calculateFailureRisk(asset, profile, healthResult) {
  const lifeYears = num(asset.lifeExpectancyYearsOverride) || num(profile?.usefulLifeYears, 5);
  const age = ageInYears(asset.purchaseDate, asset.manufactureYear);
  const ageRatio = clamp(lifeYears > 0 ? (age / lifeYears) * 100 : 0);

  const healthComponent = (100 - healthResult.score) * 0.45;
  const repairsComponent = Math.min(num(asset.repairCount), 10) * 3;
  const failuresComponent = Math.min(num(asset.failureCount), 5) * 8;
  const accidentsComponent = Math.min(num(asset.accidentCount), 3) * 10;
  const ageComponent = ageRatio * 0.15;
  const inspectionComponent = asset.inspectionScore != null ? (100 - num(asset.inspectionScore)) * 0.1 : 5;

  const riskIndex = clamp(healthComponent + repairsComponent + failuresComponent + accidentsComponent + ageComponent + inspectionComponent);

  const probability30 = clamp(riskIndex * 0.35);
  const probability60 = clamp(riskIndex * 0.5);
  const probability90 = clamp(riskIndex * 0.65);
  const probability180 = clamp(riskIndex * 0.9);

  const reasons = [];
  if (repairsComponent >= 15) reasons.push(`${asset.repairCount} repairs on record`);
  if (failuresComponent >= 16) reasons.push(`${asset.failureCount} past failures`);
  if (accidentsComponent >= 10) reasons.push(`${asset.accidentCount} recorded accident(s)`);
  if (ageRatio >= 80) reasons.push('Approaching or past its expected useful life');
  if (healthResult.score < 60) reasons.push(`Health score is low (${healthResult.score}%)`);
  if (asset.inspectionScore != null && asset.inspectionScore < 60) reasons.push('Last inspection flagged concerns');
  if (['high'].includes(asset.corrosionRisk)) reasons.push('Operating in a high corrosion-risk environment');
  if (reasons.length === 0) reasons.push('No significant risk factors on record');

  return {
    probability30d: Math.round(probability30 * 10) / 10,
    probability60d: Math.round(probability60 * 10) / 10,
    probability90d: Math.round(probability90 * 10) / 10,
    probability180d: Math.round(probability180 * 10) / 10,
    riskIndex: Math.round(riskIndex * 10) / 10,
    reasons,
  };
}

// ---------------------------------------------------------------------------
// ENGINE 4 - Disposal Intelligence Engine
// ---------------------------------------------------------------------------

const DISPOSAL_WEIGHTS = { age: 0.25, depreciation: 0.15, maintenanceCost: 0.20, repairFrequency: 0.15, health: 0.10, marketValue: 0.10, criticality: 0.05 };

function calculateDisposalReadiness(asset, profile, healthResult, depreciationResult) {
  const lifeYears = num(asset.lifeExpectancyYearsOverride) || num(profile?.usefulLifeYears, 5);
  const age = ageInYears(asset.purchaseDate, asset.manufactureYear);
  const ageReadiness = clamp(lifeYears > 0 ? (age / lifeYears) * 100 : 0);

  const cost = num(asset.purchasePrice);
  const depRatio = cost > 0 ? 1 - depreciationResult.currentValue / cost : 0;
  const depreciationReadiness = clamp(depRatio * 100);

  const upkeepTotal = num(asset.maintenanceCostTotal) + num(asset.repairCostTotal);
  const maintenanceCostReadiness = clamp(cost > 0 ? (upkeepTotal / cost) * 150 : 0);

  const repairFrequencyReadiness = clamp(num(asset.repairCount) * 12);

  const healthReadiness = clamp(100 - healthResult.score);

  const replacementCost = num(asset.currentReplacementCost) || cost;
  const marketValue = asset.currentMarketValue != null ? num(asset.currentMarketValue) : depreciationResult.currentValue;
  const marketValueReadiness = clamp(replacementCost > 0 ? (1 - marketValue / replacementCost) * 100 : 50);

  const criticalityReadiness = clamp(100 - num(asset.criticalityScore, 50));

  const breakdown = {
    age: Math.round(ageReadiness), depreciation: Math.round(depreciationReadiness), maintenanceCost: Math.round(maintenanceCostReadiness),
    repairFrequency: Math.round(repairFrequencyReadiness), health: Math.round(healthReadiness),
    marketValue: Math.round(marketValueReadiness), criticality: Math.round(criticalityReadiness),
  };

  const total = clamp(
    ageReadiness * DISPOSAL_WEIGHTS.age + depreciationReadiness * DISPOSAL_WEIGHTS.depreciation
    + maintenanceCostReadiness * DISPOSAL_WEIGHTS.maintenanceCost + repairFrequencyReadiness * DISPOSAL_WEIGHTS.repairFrequency
    + healthReadiness * DISPOSAL_WEIGHTS.health + marketValueReadiness * DISPOSAL_WEIGHTS.marketValue
    + criticalityReadiness * DISPOSAL_WEIGHTS.criticality,
  );

  const upkeepExceedsReplacement = replacementCost > 0 && upkeepTotal > 0.5 * replacementCost;

  let recommendation;
  let timeframe;
  if (total >= 85) {
    recommendation = marketValue < 0.1 * replacementCost ? 'SCRAP' : 'SELL';
    timeframe = 'within 1 month';
  } else if (total >= 65) {
    recommendation = 'SELL';
    timeframe = 'within 3 months';
  } else if (total >= 45) {
    recommendation = upkeepExceedsReplacement ? 'REPLACE' : 'REPAIR';
    timeframe = 'within 6-12 months';
  } else {
    recommendation = 'KEEP';
    timeframe = 'no action needed';
  }

  return { score: Math.round(total * 10) / 10, recommendation, timeframe, breakdown, upkeepExceedsReplacement };
}

// ---------------------------------------------------------------------------
// AI Confidence Score - a genuine data-completeness metric, not a fabricated number
// ---------------------------------------------------------------------------

const CONFIDENCE_FIELDS = [
  'purchasePrice', 'purchaseDate', 'manufactureYear', 'hoursUsed', 'maintenanceCount', 'repairCount',
  'inspectionScore', 'maintenanceCompliance', 'assetReliability', 'criticalityScore', 'currentMarketValue',
  'currentReplacementCost', 'usageIntensity', 'corrosionRisk',
];

/**
 * @param {Object} asset
 * @param {number} [learningAdjustment] - bounded +/-10 delta from the AI
 *   Learning Loop (see utils/learningLoop.js): reflects how often, at this
 *   company, ignoring a disposal recommendation has historically been
 *   followed by an actual failure. This is a real, transparent, bounded
 *   number derived from this company's own disposal-case history - not a
 *   fabricated "the AI is learning" claim.
 */
function calculateConfidence(asset, learningAdjustment = 0) {
  const populated = CONFIDENCE_FIELDS.filter((f) => asset[f] !== null && asset[f] !== undefined).length;
  const completeness = (populated / CONFIDENCE_FIELDS.length) * 100;
  const recordBonus = Math.min(num(asset.maintenanceCount), 10) * 1.5 + (asset.inspectionScore != null ? 5 : 0);
  const bounded = clamp(learningAdjustment, -10, 10);

  // NOTE ON HONESTY: TraceHub currently stores only the *latest* inspection
  // score per asset, not a full inspection history, so "inspectionsConsidered"
  // below is 0 or 1 - a true count, not the "3 inspections" richness shown in
  // the spec's mock example. Building a real inspection-history model is
  // listed as a follow-up (see handoff doc), not faked here.
  return {
    score: Math.round(clamp(35 + completeness * 0.5 + recordBonus + bounded) * 10) / 10,
    fieldsPopulated: populated,
    fieldsTotal: CONFIDENCE_FIELDS.length,
    maintenanceRecordsConsidered: num(asset.maintenanceCount),
    inspectionsConsidered: asset.inspectionScore != null ? 1 : 0,
    marketDataAvailable: asset.currentMarketValue != null,
    learningLoopAdjustment: Math.round(bounded * 10) / 10,
  };
}

// ---------------------------------------------------------------------------
// ENGINE 5 - Executive Recommendation Engine (deterministic synthesis)
// ---------------------------------------------------------------------------

function buildExecutiveRecommendation(asset, { health, failure, disposal, confidence }) {
  let headline;
  if (disposal.recommendation === 'SCRAP' || disposal.recommendation === 'REPLACE') {
    headline = `Replace ${disposal.timeframe === 'within 1 month' ? 'immediately' : disposal.timeframe}.`;
  } else if (disposal.recommendation === 'SELL') {
    headline = `Sell ${disposal.timeframe}.`;
  } else if (disposal.recommendation === 'REPAIR') {
    headline = 'Schedule repair/service before the next assignment.';
  } else if (health.tier === 'Critical' || health.tier === 'High Risk') {
    headline = 'Monitor closely - health score is low even though disposal isn\u2019t yet recommended.';
  } else {
    headline = `Keep in service. Next review recommended in ${Math.max(30, Math.round(180 - failure.probability180d))} days.`;
  }

  return { headline, confidence: confidence.score };
}

/** Runs all five engines and returns the consolidated result to persist on the asset. */
function runFullIntelligenceAnalysis(asset, profile, learningAdjustment = 0) {
  const depreciation = calculateDepreciation(asset, profile);
  const health = calculateHealthScore(asset, profile);
  const failure = calculateFailureRisk(asset, profile, health);
  const disposal = calculateDisposalReadiness(asset, profile, health, depreciation);
  const confidence = calculateConfidence(asset, learningAdjustment);
  const executive = buildExecutiveRecommendation(asset, { health, failure, disposal, confidence });

  return { depreciation, health, failure, disposal, confidence, executive };
}

module.exports = {
  calculateDepreciation, calculateHealthScore, calculateFailureRisk,
  calculateDisposalReadiness, calculateConfidence, buildExecutiveRecommendation,
  runFullIntelligenceAnalysis, ageInYears, evaluateCustomFormula,
};
