const express = require('express');
const { authenticate, requireRole, requireCompanyContext } = require('../middleware/auth');
const ctrl = require('../controllers/locationController');

const router = express.Router();

router.use(authenticate, requireCompanyContext);

router.get('/', ctrl.listLocations);
router.post('/', requireRole('company_admin', 'manager', 'super_admin'), ctrl.createLocation);
router.patch('/:id', requireRole('company_admin', 'manager', 'super_admin'), ctrl.updateLocation);
router.delete('/:id', requireRole('company_admin', 'super_admin'), ctrl.deleteLocation);

router.post('/scan', ctrl.scanAsset);
router.get('/history/:assetId', ctrl.getAssetLocationHistory);

module.exports = router;
