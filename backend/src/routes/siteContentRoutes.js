const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/siteContentController');

const router = express.Router();

router.get('/', ctrl.getPublic);
router.patch('/', authenticate, requireRole('super_admin'), ctrl.update);

module.exports = router;
