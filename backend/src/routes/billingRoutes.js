const express = require('express');
const { authenticate, requireRole, requireCompanyContext } = require('../middleware/auth');
const ctrl = require('../controllers/billingController');

const router = express.Router();

// Flutterwave webhook - receives its own JSON body parser (kept separate from
// any global raw-body needs the app might add later for other providers)
router.post('/webhook', express.json(), ctrl.webhook);

router.use(authenticate, requireCompanyContext);

router.get('/subscription', ctrl.getMySubscription);
router.get('/invoices', ctrl.listInvoices);
router.post('/checkout', requireRole('company_admin', 'super_admin'), ctrl.startCheckout);
router.post('/verify', requireRole('company_admin', 'super_admin'), ctrl.verifyCheckout);
router.post('/cancel', requireRole('company_admin', 'super_admin'), ctrl.cancelSubscription);

module.exports = router;
