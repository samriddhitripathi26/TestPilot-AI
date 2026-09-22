const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');

// Test runner endpoint - available for immediate execution
router.post('/', runController.runTests);

module.exports = router;
