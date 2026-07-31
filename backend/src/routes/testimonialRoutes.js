const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/testimonialController');

const router = express.Router();

router.get('/', ctrl.listPublic);
router.get('/all', authenticate, requireRole('super_admin'), ctrl.listAll);
router.post('/', authenticate, requireRole('super_admin'), ctrl.create);
router.patch('/:id', authenticate, requireRole('super_admin'), ctrl.update);
router.delete('/:id', authenticate, requireRole('super_admin'), ctrl.remove);

module.exports = router;
