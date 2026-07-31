const { AuditLog } = require('../models');

/** Fire-and-forget audit log writer. Never throws to avoid breaking the main request. */
async function logAction(req, { action, entityType, entityId, before = null, after = null }) {
  try {
    await AuditLog.create({
      companyId: req.companyId || null,
      userId: req.user ? req.user.id : null,
      action,
      entityType,
      entityId: entityId ? String(entityId) : null,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      before,
      after,
    });
  } catch (err) {
    console.error('[audit] failed to write audit log:', err.message);
  }
}

module.exports = { logAction };
