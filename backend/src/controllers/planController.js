const { SubscriptionPlan } = require('../models');

async function listPlans(req, res, next) {
  try {
    const plans = await SubscriptionPlan.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] });
    res.json({ plans });
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
