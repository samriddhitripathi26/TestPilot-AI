const express = require('express');
const router = express.Router();
const generateController = require('../controllers/generateController');
const authMiddleware = require('../middleware/authMiddleware');
const { generateRateLimiter } = require('../middleware/rateLimiter');

// Allow generate either with auth or guest token, rate limited per user/ip
router.post('/', authMiddleware, generateRateLimiter, generateController.generate);

module.exports = router;
