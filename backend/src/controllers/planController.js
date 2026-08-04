const { SubscriptionPlan } = require('../models');

const VALID_REGIONS = ['ghana', 'africa', 'global'];

/** Attaches the effective price for a given region onto a plain plan object, without mutating the model instance. */
function withRegionalPrice(plan, region) {
  const data = plan.toJSON ? plan.toJSON() : plan;
  const override = region !== 'global' ? (data.regionalPricing || {})[region] : null;
  return {
    ...data,
    priceMonthly: override ? override.monthly : data.priceMonthly,
    priceAnnual: override ? override.annual : data.priceAnnual,
    pricingRegion: region,
  };
}

async function listPlans(req, res, next) {
  try {
    const region = VALID_REGIONS.includes(req.query.region) ? req.query.region : 'global';
    const plans = await SubscriptionPlan.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] });
    res.json({ plans: plans.map((p) => withRegionalPrice(p, region)), region });
  } catch (err) { next(err); }
}

async function createPlan(req, res, next) {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    res.status(201).json({ plan });
  } catch (err) { next(err); }
}

async function updatePlan(req, res, next) {
  try {
    const plan = await SubscriptionPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    Object.assign(plan, req.body);
    await plan.save();
    res.json({ plan });
  } catch (err) { next(err); }
}

async function deletePlan(req, res, next) {
  try {
    const plan = await SubscriptionPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    plan.isActive = false;
    await plan.save();
    res.json({ message: 'Plan deactivated' });
  } catch (err) { next(err); }
}

module.exports = { listPlans, createPlan, updatePlan, deletePlan };
