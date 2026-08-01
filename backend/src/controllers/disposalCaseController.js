const { Op } = require('sequelize');
const { DisposalCase, Asset, User } = require('../models');
const { logAction } = require('../middleware/audit');
const { sendMail } = require('../utils/mailer');

const VALID_TRANSITIONS = {
  flagged: ['manager_review', 'rejected'],
  manager_review: ['finance_review', 'rejected'],
  finance_review: ['approved', 'rejected'],
  approved: ['auctioning', 'selling', 'donating', 'scrapping', 'recycling'],
  auctioning: ['disposed'],
  selling: ['disposed'],
  donating: ['disposed'],
  scrapping: ['disposed'],
  recycling: ['disposed'],
};

/** Open a new disposal case for an asset - typically triggered from the engine's recommendation, but can also be raised manually. */
async function createCase(req, res, next) {
  try {
    const { assetId, notes } = req.body;
    const asset = await Asset.findByPk(assetId);
    if (!asset || asset.companyId !== req.companyId) return res.status(404).json({ error: 'Asset not found' });

    const existing = await DisposalCase.findOne({
      where: { assetId, status: { [Op.notIn]: ['disposed', 'rejected'] } },
    });
    if (existing) return res.status(409).json({ error: 'This asset already has an open disposal case.' });

    const disposalCase = await DisposalCase.create({
      companyId: req.companyId,
      assetId,
      status: 'flagged',
      initiatedByUserId: req.user.id,
      engineRecommendation: asset.disposalRecommendation,
      engineScore: asset.disposalReadinessScore,
      managerNotes: notes || null,
    });

    await logAction(req, { action: 'disposal_case.create', entityType: 'DisposalCase', entityId: disposalCase.id, after: disposalCase.toJSON() });
    res.status(201).json({ disposalCase });
  } catch (err) { next(err); }
}

async function listCases(req, res, next) {
  try {
    const where = { companyId: req.companyId };
    if (req.query.status) where.status = req.query.status;
    const cases = await DisposalCase.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Asset, attributes: ['id', 'name', 'assetTag', 'currentReplacementCost', 'currentMarketValue'] },
        { model: User, as: 'initiatedBy', attributes: ['firstName', 'lastName'] },
      ],
    });
    res.json({ cases });
  } catch (err) { next(err); }
}

async function getCase(req, res, next) {
  try {
    const disposalCase = await DisposalCase.findByPk(req.params.id, {
      include: [
        { model: Asset },
        { model: User, as: 'initiatedBy', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'managerReviewer', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'financeReviewer', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'approver', attributes: ['firstName', 'lastName'] },
      ],
    });
    if (!disposalCase || disposalCase.companyId !== req.companyId) return res.status(404).json({ error: 'Disposal case not found' });
    res.json({ disposalCase });
  } catch (err) { next(err); }
}

/**
 * Advances (or rejects) a disposal case through the workflow. Each stage
 * requires the appropriate role and records who acted, when, and why -
 * a real audit trail, not just a status label.
 */
async function transitionCase(req, res, next) {
  try {
    const { toStatus, notes, disposalMethod, finalSaleAmount, finalSaleCurrency, rejectionReason } = req.body;
    const disposalCase = await DisposalCase.findByPk(req.params.id, { include: [Asset] });
    if (!disposalCase || disposalCase.companyId !== req.companyId) return res.status(404).json({ error: 'Disposal case not found' });

    const allowed = VALID_TRANSITIONS[disposalCase.status] || [];
    if (!allowed.includes(toStatus)) {
      return res.status(400).json({ error: `Cannot move from "${disposalCase.status}" to "${toStatus}". Valid next steps: ${allowed.join(', ') || 'none'}.` });
    }

    // Role gates per stage - a manager can't finance-approve their own flag, etc.
    const roleRequirements = {
      manager_review: ['manager', 'company_admin', 'super_admin'],
      finance_review: ['company_admin', 'super_admin'], // finance sign-off reserved for admin-level roles
      approved: ['company_admin', 'super_admin'],
    };
    const required = roleRequirements[toStatus];
    if (required && !required.includes(req.user.role)) {
      return res.status(403).json({ error: `Only ${required.join('/')} can move a case to "${toStatus}".` });
    }

    const before = disposalCase.toJSON();

    if (toStatus === 'manager_review') {
      disposalCase.managerReviewedByUserId = req.user.id;
      disposalCase.managerReviewedAt = new Date();
      if (notes) disposalCase.managerNotes = notes;
    } else if (toStatus === 'finance_review') {
      disposalCase.financeReviewedByUserId = req.user.id;
      disposalCase.financeReviewedAt = new Date();
      if (notes) disposalCase.financeNotes = notes;
    } else if (toStatus === 'approved') {
      disposalCase.approvedByUserId = req.user.id;
      disposalCase.approvedAt = new Date();
    } else if (['auctioning', 'selling', 'donating', 'scrapping', 'recycling'].includes(toStatus)) {
      const methodMap = { auctioning: 'auction', selling: 'sale', donating: 'donation', scrapping: 'scrap', recycling: 'recycle' };
      disposalCase.disposalMethod = disposalMethod || methodMap[toStatus];
    } else if (toStatus === 'disposed') {
      disposalCase.disposedAt = new Date();
      if (finalSaleAmount !== undefined) disposalCase.finalSaleAmount = finalSaleAmount;
      if (finalSaleCurrency) disposalCase.finalSaleCurrency = finalSaleCurrency;

      // Financial Update step - the asset itself now reflects disposal
      const asset = disposalCase.Asset;
      if (asset) {
        asset.status = 'disposed';
        if (finalSaleAmount !== undefined) asset.currentMarketValue = finalSaleAmount;
        await asset.save();
      }
    } else if (toStatus === 'rejected') {
      disposalCase.rejectionReason = rejectionReason || notes || 'No reason given';
    }

    disposalCase.status = toStatus;
    await disposalCase.save();

    await logAction(req, {
      action: `disposal_case.${toStatus}`, entityType: 'DisposalCase', entityId: disposalCase.id, before, after: disposalCase.toJSON(),
    });

    // Notify the asset's company admins at key milestones so this doesn't
    // silently sit in someone's queue
    if (['manager_review', 'finance_review', 'approved', 'disposed', 'rejected'].includes(toStatus)) {
      const admins = await User.findAll({ where: { companyId: req.companyId, role: 'company_admin' } });
      await Promise.all(admins.map((admin) => sendMail({
        to: admin.email,
        subject: `Disposal case update: ${disposalCase.Asset?.name || 'Asset'}`,
        html: `<p>The disposal case for <strong>${disposalCase.Asset?.name}</strong> moved to <strong>${toStatus.replace('_', ' ')}</strong>.</p>`,
      }).catch(() => {})));
    }

    res.json({ disposalCase });
  } catch (err) { next(err); }
}

module.exports = { createCase, listCases, getCase, transitionCase };
