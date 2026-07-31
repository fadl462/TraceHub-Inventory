const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { authenticator } = require('otplib');
const {
  User, Company, Subscription, SubscriptionPlan, PasswordReset,
} = require('../models');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendMail } = require('../utils/mailer');
const { logAction } = require('../middleware/audit');

function slugify(str) {
  return String(str).toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uniqueSlug(base) {
  let slug = slugify(base) || 'company';
  let i = 0;
  // eslint-disable-next-line no-await-in-loop
  while (await Company.findOne({ where: { slug: i === 0 ? slug : `${slug}-${i}` } })) {
    i += 1;
  }
  return i === 0 ? slug : `${slug}-${i}`;
}

/**
 * Registers a new company (tenant) + its first Company Admin user.
 * Automatically provisions a trial subscription: 10 free assets for 1 month
 * (per original spec: "first 10 assets being free for one month").
 */
async function registerCompany(req, res, next) {
  try {
    const { companyName, accountType, firstName, lastName, email, phone, password } = req.body;

    const existing = await User.findOne({ where: { email: String(email).toLowerCase() } });
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const slug = await uniqueSlug(companyName || `${firstName}-${lastName}`);
    const trialDays = Number(process.env.TRIAL_DURATION_DAYS) || 30;
    const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);

    const company = await Company.create({
      name: companyName || `${firstName} ${lastName}`,
      slug,
      type: accountType === 'individual' ? 'individual' : 'company',
      status: 'trial',
      trialEndsAt,
    });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      companyId: company.id,
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      role: 'company_admin',
      isEmailVerified: false,
    });

    let trialPlan = await SubscriptionPlan.findOne({ where: { code: 'trial' } });
    if (!trialPlan) {
      trialPlan = await SubscriptionPlan.create({
        name: 'Trial', code: 'trial',
        assetLimit: Number(process.env.TRIAL_ASSET_LIMIT) || 10,
        userLimit: 3, priceMonthly: 0, priceAnnual: 0,
        features: ['reporting'],
      });
    }

    await Subscription.create({
      companyId: company.id,
      planId: trialPlan.id,
      billingCycle: 'trial',
      status: 'trialing',
      currentPeriodEnd: trialEndsAt,
    });

    await sendMail({
      to: user.email,
      subject: 'Welcome to TraceHub Inventory',
      html: `<p>Hi ${user.firstName},</p><p>Your TraceHub Inventory workspace for <strong>${company.name}</strong> is ready. You have <strong>${trialPlan.assetLimit} free assets for ${trialDays} days</strong> to get started.</p>`,
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    await logAction({ user, companyId: company.id, ip: req.ip, headers: req.headers }, {
      action: 'company.register', entityType: 'Company', entityId: company.id, after: { name: company.name },
    }).catch(() => {});

    res.status(201).json({
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
      company: { id: company.id, name: company.name, slug: company.slug, status: company.status },
    });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: String(email).toLowerCase() } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    if (!user.isActive) return res.status(403).json({ error: 'This account has been deactivated.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    if (user.companyId) {
      const company = await Company.findByPk(user.companyId);
      if (company && company.status === 'suspended') {
        return res.status(403).json({ error: 'This company account has been suspended.' });
      }
    }

    if (user.twoFactorEnabled) {
      // Don't issue tokens yet - the client must call /auth/login/verify-2fa
      // with a valid code from the user's authenticator app first.
      return res.json({ requiresTwoFactor: true, userId: user.id });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.json({ accessToken, refreshToken, user: sanitizeUser(user) });
  } catch (err) { next(err); }
}

/** Second step of login when the account has 2FA enabled */
async function verifyLoginTwoFactor(req, res, next) {
  try {
    const { userId, token } = req.body;
    const user = await User.findByPk(userId);
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ error: 'Two-factor authentication is not active for this account' });
    }
    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!isValid) return res.status(401).json({ error: 'Invalid or expired code' });

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    res.json({ accessToken, refreshToken, user: sanitizeUser(user) });
  } catch (err) { next(err); }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken is required' });
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findByPk(payload.sub);
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid session' });
    const accessToken = signAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: String(email).toLowerCase() } });
    // Always respond success to avoid leaking which emails are registered
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresMin = Number(process.env.PASSWORD_RESET_EXPIRES_MIN) || 60;

    await PasswordReset.create({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + expiresMin * 60 * 1000),
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}&uid=${user.id}`;
    await sendMail({
      to: user.email,
      subject: 'Reset your TraceHub Inventory password',
      html: `<p>Hi ${user.firstName},</p><p>Click below to reset your password. This link expires in ${expiresMin} minutes.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) { next(err); }
}

async function resetPassword(req, res, next) {
  try {
    const { uid, token, newPassword } = req.body;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const record = await PasswordReset.findOne({
      where: { userId: uid, tokenHash, usedAt: null, expiresAt: { [Op.gt]: new Date() } },
      order: [['createdAt', 'DESC']],
    });
    if (!record) return res.status(400).json({ error: 'Invalid or expired reset link.' });

    const user = await User.findByPk(uid);
    if (!user) return res.status(400).json({ error: 'Invalid reset link.' });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    record.usedAt = new Date();
    await record.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) { next(err); }
}

async function me(req, res) {
  res.json({ user: sanitizeUser(req.user), company: req.company || null });
}

function sanitizeUser(user) {
  const { passwordHash, ...rest } = user.toJSON();
  return rest;
}

module.exports = { registerCompany, login, verifyLoginTwoFactor, refresh, forgotPassword, resetPassword, me };
