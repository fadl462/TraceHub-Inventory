const crypto = require('crypto');
const { Assignment, Asset, User, Notification } = require('../models');
const { sendMail } = require('../utils/mailer');
const { logAction } = require('../middleware/audit');

async function createAssignment(req, res, next) {
  try {
    const {
      assetId, assignedToUserId, externalAssigneeName, externalAssigneeEmail,
      externalAssigneePhone, expectedReturnDate, purpose, notes,
      hireFeeAmount, hireFeeCurrency,
    } = req.body;

    if (!assetId) return res.status(400).json({ error: 'assetId is required' });
    if (!assignedToUserId && !externalAssigneeName) {
      return res.status(400).json({ error: 'Provide either assignedToUserId (staff) or externalAssigneeName (outsider)' });
    }

    const asset = await Asset.findByPk(assetId);
    if (!asset || asset.companyId !== req.companyId) return res.status(404).json({ error: 'Asset not found' });
    if (asset.status === 'assigned') return res.status(409).json({ error: 'This asset is already assigned. Return it first.' });
    if (asset.status === 'disposed') return res.status(409).json({ error: 'This asset has been disposed and cannot be assigned.' });

    const assignment = await Assignment.create({
      companyId: req.companyId,
      assetId,
      assignedToUserId: assignedToUserId || null,
      externalAssigneeName: externalAssigneeName || null,
      externalAssigneeEmail: externalAssigneeEmail || null,
      externalAssigneePhone: externalAssigneePhone || null,
      assignedByUserId: req.user.id,
      expectedReturnDate: expectedReturnDate || null,
      purpose,
      notes,
      hireFeeAmount: hireFeeAmount || null,
      hireFeeCurrency: hireFeeAmount ? (hireFeeCurrency || asset.currency || 'USD') : null,
      returnConfirmationToken: crypto.randomBytes(16).toString('hex'),
    });

    asset.status = 'assigned';
    await asset.save();

    let recipientEmail = externalAssigneeEmail;
    let recipientName = externalAssigneeName;
    if (assignedToUserId) {
      const staffUser = await User.findByPk(assignedToUserId);
      if (staffUser) { recipientEmail = staffUser.email; recipientName = staffUser.firstName; }
    }

    if (recipientEmail) {
      const feeLine = hireFeeAmount
        ? `<p>Hire fee: <strong>${assignment.hireFeeCurrency} ${Number(hireFeeAmount).toFixed(2)}</strong> \u2014 please arrange payment before the return date.</p>`
        : '';
      await sendMail({
        to: recipientEmail,
        subject: `Asset assigned to you: ${asset.name}`,
        html: `<p>Hi ${recipientName || ''},</p><p>You have been assigned <strong>${asset.name}</strong> (${asset.assetTag}).</p>${expectedReturnDate ? `<p>Expected return date: <strong>${expectedReturnDate}</strong></p>` : ''}${feeLine}<p>${purpose ? `Purpose: ${purpose}` : ''}</p>`,
      });
    }

    if (assignedToUserId) {
      await Notification.create({
        companyId: req.companyId, userId: assignedToUserId, type: 'assignment_created', channel: 'in_app',
        title: 'Asset assigned to you', body: `${asset.name} (${asset.assetTag}) has been assigned to you.`,
        meta: { assetId, assignmentId: assignment.id },
      });
    }

    await logAction(req, { action: 'assignment.create', entityType: 'Assignment', entityId: assignment.id, after: assignment.toJSON() });

    res.status(201).json({ assignment });
  } catch (err) { next(err); }
}

async function listAssignments(req, res, next) {
  try {
    const { status, assetId, assignedToUserId } = req.query;
    const where = { companyId: req.companyId };
    if (status) where.status = status;
    if (assetId) where.assetId = assetId;
    if (assignedToUserId) where.assignedToUserId = assignedToUserId;

    const assignments = await Assignment.findAll({
      where,
      include: [
        { model: Asset },
        { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: User, as: 'assigner', attributes: ['id', 'firstName', 'lastName'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ assignments });
  } catch (err) { next(err); }
}

async function returnAsset(req, res, next) {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment || assignment.companyId !== req.companyId) return res.status(404).json({ error: 'Assignment not found' });
    if (assignment.status === 'returned') return res.status(409).json({ error: 'This assignment has already been marked returned.' });

    assignment.status = 'returned';
    assignment.returnedAt = new Date();
    if (req.body.notes) assignment.notes = `${assignment.notes || ''}\nReturn notes: ${req.body.notes}`;
    await assignment.save();

    const asset = await Asset.findByPk(assignment.assetId);
    if (asset) { asset.status = 'available'; await asset.save(); }

    await logAction(req, { action: 'assignment.return', entityType: 'Assignment', entityId: assignment.id });

    res.json({ assignment, message: 'Asset marked as returned' });
  } catch (err) { next(err); }
}

/** Public link the borrower can click to confirm they've returned the asset (per handover notes) */
async function confirmReturnPublic(req, res, next) {
  try {
    const assignment = await Assignment.findOne({ where: { returnConfirmationToken: req.params.token } });
    if (!assignment) return res.status(404).json({ error: 'Invalid or expired confirmation link.' });
    if (assignment.returnConfirmedAt) return res.json({ message: 'Return already confirmed. Thank you.' });
    assignment.returnConfirmedAt = new Date();
    await assignment.save();
    res.json({ message: 'Thank you - your return has been confirmed. The company admin will finalize the asset check-in.' });
  } catch (err) { next(err); }
}

/** Mark a hire fee as paid/unpaid - sends a confirmation email to the hirer when marked paid */
async function updateHirePayment(req, res, next) {
  try {
    const assignment = await Assignment.findByPk(req.params.id, { include: [Asset] });
    if (!assignment || assignment.companyId !== req.companyId) return res.status(404).json({ error: 'Assignment not found' });
    if (!assignment.hireFeeAmount) return res.status(400).json({ error: 'This assignment has no hire fee recorded.' });

    const { paid } = req.body;
    assignment.hireFeePaid = !!paid;
    assignment.hireFeePaidAt = paid ? new Date() : null;
    await assignment.save();

    const recipientEmail = assignment.externalAssigneeEmail
      || (assignment.assignedToUserId ? (await User.findByPk(assignment.assignedToUserId))?.email : null);

    if (paid && recipientEmail) {
      await sendMail({
        to: recipientEmail,
        subject: `Payment confirmed: ${assignment.Asset?.name}`,
        html: `<p>Thanks \u2014 we've recorded your hire fee payment of <strong>${assignment.hireFeeCurrency} ${Number(assignment.hireFeeAmount).toFixed(2)}</strong> for <strong>${assignment.Asset?.name}</strong>.</p>`,
      }).catch(() => {});
    }

    await logAction(req, { action: 'assignment.hire_payment_update', entityType: 'Assignment', entityId: assignment.id, after: { hireFeePaid: assignment.hireFeePaid } });

    res.json({ assignment, message: paid ? 'Marked as paid' : 'Marked as unpaid' });
  } catch (err) { next(err); }
}

module.exports = { createAssignment, listAssignments, returnAsset, confirmReturnPublic, updateHirePayment };
