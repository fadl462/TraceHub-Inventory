const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/superAdminController');

const router = express.Router();

router.use(authenticate, requireRole('super_admin'));

router.get('/dashboard', ctrl.dashboardStats);
router.get('/ai-insights', ctrl.aiInsights);
router.get('/search', ctrl.globalSearch);
router.get('/companies', ctrl.listCompanies);
router.get('/companies/:id', ctrl.getCompany);
router.patch('/companies/:id/status', ctrl.updateCompanyStatus);
router.delete('/companies/:id', ctrl.deleteCompany);

module.exports = router;
