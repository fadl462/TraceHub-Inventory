/**
 * TraceHub AI Learning Loop
 * =========================
 * The spec's loop is: AI recommends -> company ignores -> asset fails ->
 * AI learns -> future predictions improve. This module implements the real,
 * bounded version of that idea that's actually possible with a deterministic
 * scoring engine (not a trained model that literally retrains itself):
 *
 *   1. Every time a disposal recommendation is REJECTED, we snapshot the
 *      asset's incident count (failureCount + accidentCount) at that moment.
 *   2. Some time later (evaluateOutcomes), we check whether that count has
 *      gone up since - i.e. whether ignoring the recommendation was in fact
 *      followed by a real failure.
 *   3. We aggregate this per company into a "reliability rate": of the
 *      rejected recommendations we've been able to evaluate, what fraction
 *      were followed by a failure?
 *   4. That rate feeds back into calculateConfidence() as a small, bounded
 *      (+/-10) adjustment - if this company's history shows ignoring flags
 *      usually leads to failures, current recommendations get a confidence
 *      boost; if ignored flags usually turn out fine, confidence is nudged
 *      down. This is a real, transparent, auditable number computed from
 *      this company's own disposal-case history - not a black box and not
 *      a fabricated "AI is learning" claim.
 *
 * Nothing here is a machine-learning model. It is bookkeeping over real
 * outcomes, consistent with the rest of TAIE's honesty policy.
 */

const { Op } = require('sequelize');

const EVALUATION_WINDOW_DAYS = 30; // don't judge a rejection until this much time has passed
const MIN_EVALUATED_FOR_ADJUSTMENT = 5; // need a minimum sample size before trusting the rate

/**
 * Marks a disposal case as "rejected" for learning-loop purposes: snapshots
 * the asset's current incident count so a later pass can detect a new one.
 */
function snapshotRejectionForLearning(disposalCase, asset) {
  disposalCase.incidentCountAtDecision = Number(asset.failureCount || 0) + Number(asset.accidentCount || 0);
  disposalCase.outcomeEvaluatedAt = null;
  disposalCase.outcomeFailureOccurred = null;
}

/**
 * Scans this company's rejected-and-not-yet-evaluated disposal cases that are
 * old enough to judge, and marks whether a new failure/accident occurred
 * since the rejection. Safe to call repeatedly (e.g. from the daily cron
 * alongside the existing reminder job, or on demand from the Learning Loop
 * report endpoint).
 */
async function evaluateOutcomes(companyId, { DisposalCase, Asset }) {
  const cutoff = new Date(Date.now() - EVALUATION_WINDOW_DAYS * 86400000);
  const pending = await DisposalCase.findAll({
    where: {
      companyId,
      status: 'rejected',
      outcomeEvaluatedAt: null,
      incidentCountAtDecision: { [Op.ne]: null },
      updatedAt: { [Op.lte]: cutoff },
    },
    include: [{ model: Asset }],
  });

  let evaluated = 0;
  await Promise.all(pending.map(async (dc) => {
    const asset = dc.Asset;
    if (!asset) return;
    const currentIncidents = Number(asset.failureCount || 0) + Number(asset.accidentCount || 0);
    dc.outcomeFailureOccurred = currentIncidents > Number(dc.incidentCountAtDecision || 0);
    dc.outcomeEvaluatedAt = new Date();
    await dc.save();
    evaluated += 1;
  }));

  return { evaluatedCount: evaluated, pendingCount: pending.length };
}

/**
 * Company-level reliability stats, and the bounded confidence adjustment
 * derived from them. Cheap enough to call on every intelligence recalculation.
 */
async function getCompanyReliability(companyId, { DisposalCase }) {
  const [followedCount, rejectedTotal, evaluatedRejections] = await Promise.all([
    DisposalCase.count({ where: { companyId, status: 'disposed' } }),
    DisposalCase.count({ where: { companyId, status: 'rejected' } }),
    DisposalCase.findAll({ where: { companyId, status: 'rejected', outcomeEvaluatedAt: { [Op.ne]: null } }, attributes: ['outcomeFailureOccurred'] }),
  ]);

  const evaluatedCount = evaluatedRejections.length;
  const failedAfterIgnoringCount = evaluatedRejections.filter((r) => r.outcomeFailureOccurred).length;
  const reliabilityRate = evaluatedCount > 0 ? failedAfterIgnoringCount / evaluatedCount : null;

  // Only trust the rate (and let it move confidence) once we have a real sample.
  // Below that, the adjustment is 0 - "not enough history yet" rather than a guess.
  let adjustment = 0;
  if (evaluatedCount >= MIN_EVALUATED_FOR_ADJUSTMENT && reliabilityRate !== null) {
    adjustment = (reliabilityRate - 0.5) * 20; // maps 0%..100% reliability to -10..+10
  }

  return {
    recommendationsFollowed: followedCount,
    recommendationsRejected: rejectedTotal,
    rejectionsEvaluated: evaluatedCount,
    rejectionsPendingEvaluation: rejectedTotal - evaluatedCount,
    failedAfterIgnoringCount,
    reliabilityRate: reliabilityRate !== null ? Math.round(reliabilityRate * 1000) / 10 : null, // as a %
    confidenceAdjustment: Math.round(adjustment * 10) / 10,
    hasEnoughHistory: evaluatedCount >= MIN_EVALUATED_FOR_ADJUSTMENT,
  };
}

module.exports = {
  EVALUATION_WINDOW_DAYS, MIN_EVALUATED_FOR_ADJUSTMENT,
  snapshotRejectionForLearning, evaluateOutcomes, getCompanyReliability,
};
