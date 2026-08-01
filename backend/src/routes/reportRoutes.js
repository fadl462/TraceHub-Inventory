const express = require('express');
const { authenticate, requireCompanyContext } = require('../middleware/auth');
const ctrl = require('../controllers/reportController');

const router = express.Router();

router.use(authenticate, requireCompanyContext);

router.get('/overview', ctrl.companyOverview);
router.get('/intelligence-overview', ctrl.intelligenceOverview);
router.get('/ai-insights', ctrl.aiInsights);
router.get('/assets-by-category', ctrl.assetsByCategory);
router.get('/depreciation', ctrl.depreciationReport);
router.get('/location-activity', ctrl.locationActivityReport);

module.exports = router;
