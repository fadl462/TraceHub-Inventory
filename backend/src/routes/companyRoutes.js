const express = require('express');
const { authenticate, requireRole, requireCompanyContext } = require('../middleware/auth');
const ctrl = require('../controllers/companyController');

const router = express.Router();

router.use(authenticate, requireCompanyContext);

router.get('/me', ctrl.getMyCompany);
router.patch('/me', requireRole('company_admin', 'super_admin'), ctrl.updateMyCompany);
router.post('/me/custom-domain', requireRole('company_admin', 'super_admin'), ctrl.requestCustomDomain);

module.exports = router;
