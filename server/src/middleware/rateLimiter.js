const rateLimit = require('express-rate-limit');

// Rate limit: 15 generations per hour per user/IP
const generateRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user.id : (req.ip || 'anonymous');
  },
  message: {
    error: 'Rate limit exceeded. You can only generate up to 20 test suites per hour. Please wait before generating again or upgrade.'
  }
});

// General API rate limit (for auth/search)
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.'
  }
});

module.exports = {
  generateRateLimiter,
  apiRateLimiter
};
