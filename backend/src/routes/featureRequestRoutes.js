const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/featureRequestController');

const router = express.Router();

// Deliberately just `authenticate` (no requireCompanyContext) - this board
// is intentionally visible and usable by any logged-in user regardless of
// which company they belong to, since the whole point is measuring
// cross-customer demand.
router.use(authenticate);

const createLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { error: 'Too many requests submitted - please try again later.' } });

router.get('/', ctrl.list);
router.post('/', createLimiter, ctrl.create);
router.post('/:id/vote', ctrl.toggleVote);
router.patch('/:id', requireRole('super_admin'), ctrl.updateStatus);
router.delete('/:id', ctrl.remove);

module.exports = router;
