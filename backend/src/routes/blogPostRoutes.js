const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/blogPostController');

const router = express.Router();

const commentLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many comments submitted - please try again later.' } });

router.get('/', ctrl.listPublic);
router.get('/all', authenticate, requireRole('super_admin'), ctrl.listAll);
router.get('/slug/:slug', ctrl.getBySlug);
router.get('/slug/:slug/comments', ctrl.listComments);
router.post('/slug/:slug/comments', commentLimiter, ctrl.createComment);
router.post('/', authenticate, requireRole('super_admin'), ctrl.create);
router.patch('/:id', authenticate, requireRole('super_admin'), ctrl.update);
router.delete('/:id', authenticate, requireRole('super_admin'), ctrl.remove);

module.exports = router;
