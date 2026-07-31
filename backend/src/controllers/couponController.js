const { Op } = require('sequelize');
const { Coupon } = require('../models');
const { logAction } = require('../middleware/audit');

async function listAll(req, res, next) {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ coupons });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const coupon = await Coupon.create(req.body);
    await logAction(req, { action: 'coupon.create', entityType: 'Coupon', entityId: coupon.id, after: coupon.toJSON() });
    res.status(201).json({ coupon });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    Object.assign(coupon, req.body);
    await coupon.save();
    res.json({ coupon });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    await coupon.destroy();
    res.json({ message: 'Coupon deleted' });
  } catch (err) { next(err); }
}

/**
 * Real validation logic - checks active/expiry/usage-limit and returns the
 * computed discount for a given base amount. Used both by a standalone
 * "check my code" endpoint and internally by the billing checkout flow.
 */
async function computeDiscount(code, amount) {
  if (!code) return { valid: false, reason: 'No coupon code provided' };
  const coupon = await Coupon.findOne({ where: { code: String(code).toUpperCase().trim() } });
  if (!coupon) return { valid: false, reason: 'Coupon code not found' };
  if (!coupon.isActive) return { valid: false, reason: 'This coupon is no longer active' };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { valid: false, reason: 'This coupon has expired' };
  if (coupon.usageLimit != null && coupon.timesUsed >= coupon.usageLimit) return { valid: false, reason: 'This coupon has reached its usage limit' };

  const discountAmount = coupon.discountType === 'percentage'
    ? Math.round((amount * (Number(coupon.discountValue) / 100)) * 100) / 100
    : Math.min(Number(coupon.discountValue), amount);

  return {
    valid: true,
    coupon,
    discountAmount,
    finalAmount: Math.max(0, Math.round((amount - discountAmount) * 100) / 100),
  };
}

async function validate(req, res, next) {
  try {
    const { code, amount } = req.body;
    const result = await computeDiscount(code, Number(amount) || 0);
    if (!result.valid) return res.status(400).json({ valid: false, error: result.reason });
    res.json({
      valid: true,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
      coupon: { code: result.coupon.code, name: result.coupon.name, discountType: result.coupon.discountType, discountValue: result.coupon.discountValue },
    });
  } catch (err) { next(err); }
}

module.exports = { listAll, create, update, remove, validate, computeDiscount };
