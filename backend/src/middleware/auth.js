const { verifyAccessToken } = require('../utils/jwt');
const { User, Company } = require('../models');

// Routes that stay reachable while a user is forced to set their own
// password after a company-admin invite - just enough to change the
// password, set up 2FA if they want, check who they are, and log out.
const ALLOWED_DURING_PASSWORD_CHANGE = [
  '/api/users/me/change-password',
  '/api/users/me/2fa/setup',
  '/api/users/me/2fa/verify',
  '/api/auth/me',
  '/api/auth/logout',
];

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.sub);
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid or inactive account' });

    const fullPath = req.originalUrl.split('?')[0];
    if (user.mustChangePassword && !ALLOWED_DURING_PASSWORD_CHANGE.includes(fullPath)) {
      return res.status(403).json({ error: 'You must set your own password before continuing.', code: 'PASSWORD_CHANGE_REQUIRED' });
    }

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

/**
 * Like authenticate, but never rejects the request - for genuinely public
 * routes (the docs portal) that should work identically for anonymous
 * visitors while still offering a real, personalized experience (reading
 * progress) to anyone who happens to be logged in. Silently proceeds with
 * no req.user on any missing/invalid/expired token rather than erroring.
 */
async function optionalAuthenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();

    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.sub);
    if (user && user.isActive) req.user = user;
  } catch {
    // Invalid/expired token on a public route - just proceed anonymously.
  }
  next();
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

module.exports = {
  authenticate, optionalAuthenticate, requireRole, requireCompanyContext,
};
