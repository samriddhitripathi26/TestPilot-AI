const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { apiRateLimiter } = require('../middleware/rateLimiter');

router.post('/register', apiRateLimiter, authController.register);
router.post('/login', apiRateLimiter, authController.login);
router.post('/guest', apiRateLimiter, authController.guest);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
