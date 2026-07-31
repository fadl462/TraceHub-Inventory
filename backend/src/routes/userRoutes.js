const express = require('express');
const { body } = require('express-validator');
const { authenticate, requireRole, requireCompanyContext } = require('../middleware/auth');
const { enforceUserLimit } = require('../middleware/planLimits');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/userController');

const router = express.Router();

router.use(authenticate, requireCompanyContext);

router.get('/', ctrl.listStaff);
router.get('/:id', ctrl.getStaff);

router.post('/', requireRole('company_admin', 'manager', 'super_admin'), enforceUserLimit, [
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('email').isEmail(),
  body('role').isIn(['manager', 'staff']),
], validate, ctrl.createStaff);

router.patch('/:id', requireRole('company_admin', 'manager', 'super_admin'), ctrl.updateStaff);
router.delete('/:id', requireRole('company_admin', 'super_admin'), ctrl.deleteStaff);

router.post('/me/change-password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
], validate, ctrl.changePassword);

module.exports = router;
