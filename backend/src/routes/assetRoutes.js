const express = require('express');
const { authenticate, requireRole, requireCompanyContext } = require('../middleware/auth');
const { enforceAssetLimit } = require('../middleware/planLimits');
const ctrl = require('../controllers/assetController');

const router = express.Router();

router.use(authenticate, requireCompanyContext);

router.get('/', ctrl.listAssets);
router.post('/', requireRole('company_admin', 'manager', 'staff', 'super_admin'), enforceAssetLimit, ctrl.createAsset);
router.get('/scan/:token', ctrl.resolveByQrToken);
router.get('/:id', ctrl.getAsset);
router.patch('/:id', requireRole('company_admin', 'manager', 'staff', 'super_admin'), ctrl.updateAsset);
router.post('/:id/recalculate-depreciation', requireRole('company_admin', 'manager', 'super_admin'), ctrl.recalculateDepreciation);
router.get('/:id/inspections', ctrl.listInspections);
router.post('/:id/inspections', requireRole('company_admin', 'manager', 'staff', 'super_admin'), ctrl.logInspection);
router.post('/:id/archive', requireRole('company_admin', 'manager', 'super_admin'), ctrl.archiveAsset);
router.get('/:id/qr', ctrl.getAssetQr);

module.exports = router;
