const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const { User } = require('../models');
const { sendMail } = require('../utils/mailer');
const { logAction } = require('../middleware/audit');

function sanitize(user) {
  const { passwordHash, twoFactorSecret, ...rest } = user.toJSON();
  return rest;
}

/** Company Admin / Manager invites a staff member with a temporary password */
async function createStaff(req, res, next) {
  try {
    const { firstName, lastName, email, phone, role } = req.body;
    const allowedRoles = ['manager', 'staff'];
    if (req.user.role === 'company_admin' && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: `Company Admin can only create roles: ${allowedRoles.join(', ')}` });
    }
    const existing = await User.findOne({ where: { email: String(email).toLowerCase() } });
    if (existing) return res.status(409).json({ error: 'A user with this email already exists.' });

    const tempPassword = crypto.randomBytes(6).toString('base64url');
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const user = await User.create({
      companyId: req.companyId,
      firstName, lastName, email, phone,
      role: allowedRoles.includes(role) ? role : 'staff',
      passwordHash,
    });

    await sendMail({
      to: email,
      subject: 'You have been added to TraceHub Inventory',
      html: `<p>Hi ${firstName},</p><p>You've been added to ${req.company.name}'s TraceHub Inventory workspace as <strong>${user.role}</strong>.</p><p>Temporary password: <strong>${tempPassword}</strong></p><p>Please log in and change it immediately: ${process.env.CLIENT_URL}/login</p>`,
    });

    await logAction(req, { action: 'user.create', entityType: 'User', entityId: user.id, after: sanitize(user) });

    res.status(201).json({ user: sanitize(user) });
  } catch (err) { next(err); }
}

async function listStaff(req, res, next) {
  try {
    let where = req.user.role === 'super_admin' ? {} : { companyId: req.companyId };
    if (req.user.role === 'super_admin' && req.query.companyId) where = { companyId: req.query.companyId };
    const users = await User.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ users: users.map(sanitize) });
  } catch (err) { next(err); }
}

async function getStaff(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (req.user.role !== 'super_admin' && user.companyId !== req.companyId) {
      return res.status(403).json({ error: 'Not authorized to view this user' });
    }
    res.json({ user: sanitize(user) });
  } catch (err) { next(err); }
}

async function updateStaff(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (req.user.role !== 'super_admin' && user.companyId !== req.companyId) {
      return res.status(403).json({ error: 'Not authorized to modify this user' });
    }
    const before = sanitize(user);
    const { firstName, lastName, phone, role, isActive, permissions } = req.body;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;
    if (permissions !== undefined) user.permissions = permissions;
    if (role !== undefined && ['company_admin', 'manager', 'staff'].includes(role) && req.user.role !== 'staff') {
      user.role = role;
    }
    await user.save();
    await logAction(req, { action: 'user.update', entityType: 'User', entityId: user.id, before, after: sanitize(user) });
    res.json({ user: sanitize(user) });
  } catch (err) { next(err); }
}

async function deleteStaff(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (req.user.role !== 'super_admin' && user.companyId !== req.companyId) {
      return res.status(403).json({ error: 'Not authorized to delete this user' });
    }
    if (user.id === req.user.id) return res.status(400).json({ error: 'You cannot delete your own account.' });
    await user.destroy();
    await logAction(req, { action: 'user.delete', entityType: 'User', entityId: req.params.id });
    res.json({ message: 'User removed' });
  } catch (err) { next(err); }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const valid = await bcrypt.compare(currentPassword, req.user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });
    req.user.passwordHash = await bcrypt.hash(newPassword, 12);
    await req.user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) { next(err); }
}

/** Update the current user's own profile (name, phone, avatar) */
async function updateMyProfile(req, res, next) {
  try {
    const { firstName, lastName, phone, avatarUrl } = req.body;
    const before = sanitize(req.user);
    if (firstName !== undefined) req.user.firstName = firstName;
    if (lastName !== undefined) req.user.lastName = lastName;
    if (phone !== undefined) req.user.phone = phone;
    if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl;
    await req.user.save();
    await logAction(req, { action: 'user.update_profile', entityType: 'User', entityId: req.user.id, before, after: sanitize(req.user) });
    res.json({ user: sanitize(req.user) });
  } catch (err) { next(err); }
}

/** Step 1 of enabling 2FA: generate a secret + QR code for the user to scan in an authenticator app */
async function setup2FA(req, res, next) {
  try {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(req.user.email, 'TraceHub Inventory', secret);
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl);
    // Stored but not yet "enabled" until the user proves they scanned it correctly
    req.user.twoFactorSecret = secret;
    await req.user.save();
    res.json({ qrDataUrl, secret });
  } catch (err) { next(err); }
}

/** Step 2: user submits a code from their authenticator app to confirm setup */
async function verify2FA(req, res, next) {
  try {
    const { token } = req.body;
    if (!req.user.twoFactorSecret) return res.status(400).json({ error: 'Run 2FA setup first' });
    const isValid = authenticator.verify({ token, secret: req.user.twoFactorSecret });
    if (!isValid) return res.status(400).json({ error: 'Invalid code. Check your authenticator app and try again.' });
    req.user.twoFactorEnabled = true;
    await req.user.save();
    await logAction(req, { action: 'user.2fa_enabled', entityType: 'User', entityId: req.user.id });
    res.json({ message: 'Two-factor authentication enabled' });
  } catch (err) { next(err); }
}

async function disable2FA(req, res, next) {
  try {
    const { password } = req.body;
    const valid = await bcrypt.compare(password, req.user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Password is incorrect' });
    req.user.twoFactorEnabled = false;
    req.user.twoFactorSecret = null;
    await req.user.save();
    await logAction(req, { action: 'user.2fa_disabled', entityType: 'User', entityId: req.user.id });
    res.json({ message: 'Two-factor authentication disabled' });
  } catch (err) { next(err); }
}

module.exports = {
  createStaff, listStaff, getStaff, updateStaff, deleteStaff, changePassword,
  updateMyProfile, setup2FA, verify2FA, disable2FA,
};
