const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/planController');

const router = express.Router();

router.get('/', authenticate, ctrl.listPlans); // any logged-in user can view plans (for upgrade UI)
router.post('/', authenticate, requireRole('super_admin'), ctrl.createPlan);
router.patch('/:id', authenticate, requireRole('super_admin'), ctrl.updatePlan);
router.delete('/:id', authenticate, requireRole('super_admin'), ctrl.deletePlan);

module.exports = router;
