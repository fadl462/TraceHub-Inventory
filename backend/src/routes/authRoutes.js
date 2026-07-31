const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/authController');

const router = express.Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many attempts, please try again later.' } });

router.post('/register', authLimiter, [
  body('companyName').notEmpty().withMessage('Company/workspace name is required'),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], validate, ctrl.registerCompany);

router.post('/login', authLimiter, [
  body('email').isEmail(),
  body('password').notEmpty(),
], validate, ctrl.login);

router.post('/refresh', ctrl.refresh);

router.post('/forgot-password', authLimiter, [body('email').isEmail()], validate, ctrl.forgotPassword);

router.post('/reset-password', authLimiter, [
  body('uid').notEmpty(),
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
], validate, ctrl.resetPassword);

router.get('/me', authenticate, ctrl.me);

module.exports = router;
