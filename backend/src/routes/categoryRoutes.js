const express = require('express');
const { authenticate, requireRole, requireCompanyContext } = require('../middleware/auth');
const ctrl = require('../controllers/categoryController');

const router = express.Router();

router.use(authenticate, requireCompanyContext);

router.get('/', ctrl.listCategories);
router.post('/', requireRole('company_admin', 'manager', 'super_admin'), ctrl.createCategory);
router.patch('/:id', requireRole('company_admin', 'manager', 'super_admin'), ctrl.updateCategory);
router.delete('/:id', requireRole('company_admin', 'super_admin'), ctrl.deleteCategory);

module.exports = router;
