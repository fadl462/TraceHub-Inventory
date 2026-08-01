const express = require('express');
const rateLimit = require('express-rate-limit');
const { optionalAuthenticate } = require('../middleware/optionalAuth');
const ctrl = require('../controllers/aiController');

const router = express.Router();

// Real API calls cost money per message - cap it generously but firmly.
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { error: 'Too many messages - please wait a few minutes and try again.' },
});

router.post('/chat', chatLimiter, optionalAuthenticate, ctrl.chat);

module.exports = router;
