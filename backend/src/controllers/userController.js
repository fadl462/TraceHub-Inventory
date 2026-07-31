const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User } = require('../models');
const { sendMail } = require('../utils/mailer');
const { logAction } = require('../middleware/audit');

function sanitize(user) {
  const { passwordHash, ...rest } = user.toJSON();
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
    const where = req.user.role === 'super_admin' ? {} : { companyId: req.companyId };
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

module.exports = { createStaff, listStaff, getStaff, updateStaff, deleteStaff, changePassword };
