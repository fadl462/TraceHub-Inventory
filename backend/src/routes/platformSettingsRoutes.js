const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/platformSettingsController');

const router = express.Router();

// Branding is public-readable (the landing page/app shell needs the app name and logos)
router.get('/branding', ctrl.getBranding);
router.patch('/branding', authenticate, requireRole('super_admin'), ctrl.updateBranding);

router.get('/smtp', authenticate, requireRole('super_admin'), ctrl.getSmtp);
router.patch('/smtp', authenticate, requireRole('super_admin'), ctrl.updateSmtp);
router.post('/smtp/test', authenticate, requireRole('super_admin'), ctrl.testSmtp);

router.get('/payments', authenticate, requireRole('super_admin'), ctrl.getPayments);
router.patch('/payments', authenticate, requireRole('super_admin'), ctrl.updatePayments);
router.post('/payments/test', authenticate, requireRole('super_admin'), ctrl.testPayments);

module.exports = router;
