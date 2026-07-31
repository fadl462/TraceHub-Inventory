const express = require('express');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/notificationController');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.listMyNotifications);
router.post('/:id/read', ctrl.markRead);
router.post('/read-all', ctrl.markAllRead);

module.exports = router;
