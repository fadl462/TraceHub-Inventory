const express = require('express');
const { authenticate, requireRole, requireCompanyContext } = require('../middleware/auth');
const ctrl = require('../controllers/customFieldController');

const router = express.Router();

router.use(authenticate, requireCompanyContext);

router.get('/', ctrl.listFields);
router.post('/', requireRole('company_admin', 'super_admin'), ctrl.createField);
router.patch('/:id', requireRole('company_admin', 'super_admin'), ctrl.updateField);
router.delete('/:id', requireRole('company_admin', 'super_admin'), ctrl.deleteField);

module.exports = router;
