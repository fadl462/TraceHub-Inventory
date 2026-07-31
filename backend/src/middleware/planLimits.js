const { Asset, User, Subscription, SubscriptionPlan, Company } = require('../models');
const { Op } = require('sequelize');

async function getActiveSubscription(companyId) {
  return Subscription.findOne({
    where: { companyId, status: { [Op.in]: ['trialing', 'active', 'past_due'] } },
    include: [{ model: SubscriptionPlan }],
    order: [['createdAt', 'DESC']],
  });
}

/** Blocks asset creation once the company hits its plan's asset limit (or trial ends) */
async function enforceAssetLimit(req, res, next) {
  try {
    if (req.user.role === 'super_admin') return next();
    const company = req.company || await Company.findByPk(req.companyId);

    const sub = await getActiveSubscription(req.companyId);
    if (!sub) return res.status(402).json({ error: 'No active subscription found. Please subscribe to continue.' });

    if (sub.status === 'trialing' && new Date(sub.currentPeriodEnd) < new Date()) {
      return res.status(402).json({ error: 'Your free trial has ended. Please choose a subscription plan to continue adding assets.', code: 'TRIAL_EXPIRED' });
    }

    const plan = sub.SubscriptionPlan;
    if (plan.assetLimit !== -1) {
      const count = await Asset.count({ where: { companyId: req.companyId, isArchived: false } });
      if (count >= plan.assetLimit) {
        return res.status(402).json({
          error: `Asset limit reached (${plan.assetLimit} on the ${plan.name} plan). Upgrade your subscription to add more assets.`,
          code: 'ASSET_LIMIT_REACHED',
        });
      }
    }
    next();
  } catch (err) { next(err); }
}

/** Blocks new staff/user creation once the company hits its plan's user limit */
async function enforceUserLimit(req, res, next) {
  try {
    if (req.user.role === 'super_admin') return next();
    const sub = await getActiveSubscription(req.companyId);
    if (!sub) return res.status(402).json({ error: 'No active subscription found.' });
    const plan = sub.SubscriptionPlan;
    if (plan.userLimit !== -1) {
      const count = await User.count({ where: { companyId: req.companyId } });
      if (count >= plan.userLimit) {
        return res.status(402).json({
          error: `User limit reached (${plan.userLimit} on the ${plan.name} plan). Upgrade to add more team members.`,
          code: 'USER_LIMIT_REACHED',
        });
      }
    }
    next();
  } catch (err) { next(err); }
}

/** Gate a route behind a named plan feature flag, e.g. requireFeature('custom_domain') */
function requireFeature(featureKey) {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'super_admin') return next();
      const sub = await getActiveSubscription(req.companyId);
      if (!sub || !sub.SubscriptionPlan.features.includes(featureKey)) {
        return res.status(402).json({ error: `This feature (${featureKey}) requires a higher subscription tier.`, code: 'FEATURE_LOCKED' });
      }
      next();
    } catch (err) { next(err); }
  };
}

module.exports = { enforceAssetLimit, enforceUserLimit, requireFeature, getActiveSubscription };
