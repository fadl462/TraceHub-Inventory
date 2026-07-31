const crypto = require('crypto');
const { Assignment, Asset, User, Notification } = require('../models');
const { sendMail } = require('../utils/mailer');
const { logAction } = require('../middleware/audit');

async function createAssignment(req, res, next) {
  try {
    const {
      assetId, assignedToUserId, externalAssigneeName, externalAssigneeEmail,
      externalAssigneePhone, expectedReturnDate, purpose, notes,
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
      await sendMail({
        to: recipientEmail,
        subject: `Asset assigned to you: ${asset.name}`,
        html: `<p>Hi ${recipientName || ''},</p><p>You have been assigned <strong>${asset.name}</strong> (${asset.assetTag}).</p>${expectedReturnDate ? `<p>Expected return date: <strong>${expectedReturnDate}</strong></p>` : ''}<p>${purpose ? `Purpose: ${purpose}` : ''}</p>`,
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
        { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
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

module.exports = { createAssignment, listAssignments, returnAsset, confirmReturnPublic };
