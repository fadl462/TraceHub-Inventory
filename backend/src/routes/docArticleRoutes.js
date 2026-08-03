const express = require('express');
const { authenticate, optionalAuthenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/docArticleController');

const router = express.Router();

router.get('/', ctrl.listPublic);
router.get('/search', ctrl.search);
router.get('/all', authenticate, requireRole('super_admin'), ctrl.listAll);
router.get('/progress', optionalAuthenticate, ctrl.getProgress);
router.post('/progress', optionalAuthenticate, ctrl.markRead);
router.get('/slug/:slug', ctrl.getBySlug);
router.post('/', authenticate, requireRole('super_admin'), ctrl.create);
router.patch('/:id', authenticate, requireRole('super_admin'), ctrl.update);
router.delete('/:id', authenticate, requireRole('super_admin'), ctrl.remove);

module.exports = router;
