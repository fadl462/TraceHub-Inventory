const { verifyAccessToken } = require('../utils/jwt');
const { User, Company } = require('../models');

/**
 * Unlike `authenticate`, this never rejects the request. Used for endpoints
 * like the AI chat widget that work for anonymous landing-page visitors but
 * can give richer, personalized answers when the visitor happens to be
 * logged in.
 */
async function optionalAuthenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();

    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.sub);
    if (user && user.isActive) {
      req.user = user;
      req.companyId = user.companyId;
      if (user.companyId) req.company = await Company.findByPk(user.companyId);
    }
    next();
  } catch {
    next(); // invalid/expired token - just proceed as anonymous
  }
}

module.exports = { optionalAuthenticate };
