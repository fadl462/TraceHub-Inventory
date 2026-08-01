const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/newsletterController');

const router = express.Router();

const subscribeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post('/subscribe', subscribeLimiter, ctrl.subscribe);
router.get('/', authenticate, requireRole('super_admin'), ctrl.listAll);

module.exports = router;
