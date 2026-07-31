const express = require('express');
const { authenticate, requireRole, requireCompanyContext } = require('../middleware/auth');
const ctrl = require('../controllers/assignmentController');

const router = express.Router();

// Public confirmation link (borrower clicks from email, no auth)
router.get('/confirm-return/:token', ctrl.confirmReturnPublic);

router.use(authenticate, requireCompanyContext);

router.get('/', ctrl.listAssignments);
router.post('/', requireRole('company_admin', 'manager', 'staff', 'super_admin'), ctrl.createAssignment);
router.post('/:id/return', requireRole('company_admin', 'manager', 'staff', 'super_admin'), ctrl.returnAsset);

module.exports = router;
