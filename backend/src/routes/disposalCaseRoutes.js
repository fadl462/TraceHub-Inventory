const express = require('express');
const { authenticate, requireCompanyContext, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/disposalCaseController');

const router = express.Router();

router.use(authenticate, requireCompanyContext);

router.get('/', ctrl.listCases);
router.get('/:id', ctrl.getCase);
router.post('/', requireRole('company_admin', 'manager', 'super_admin'), ctrl.createCase);
router.post('/:id/transition', requireRole('company_admin', 'manager', 'super_admin'), ctrl.transitionCase);

module.exports = router;
