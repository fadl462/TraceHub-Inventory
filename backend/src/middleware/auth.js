const { verifyAccessToken } = require('../utils/jwt');
const { User, Company } = require('../models');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.sub);
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid or inactive account' });

    req.user = user;
    req.companyId = user.companyId;

    if (user.companyId) {
      const company = await Company.findByPk(user.companyId);
      if (!company) return res.status(401).json({ error: 'Company not found' });
      if (company.status === 'suspended') return res.status(403).json({ error: 'Company account suspended' });
      req.company = company;
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/** Restrict route to one or more roles */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this action' });
    }
    next();
  };
}

/** Ensures company-scoped users can only access resources within their own tenant */
function requireCompanyContext(req, res, next) {
  if (req.user.role === 'super_admin') return next();
  if (!req.companyId) return res.status(403).json({ error: 'No company context for this account' });
  next();
}

module.exports = { authenticate, requireRole, requireCompanyContext };
