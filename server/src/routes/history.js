const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, historyController.getHistory);
router.get('/:id', authMiddleware, historyController.getHistoryItem);
router.patch('/:id/favorite', authMiddleware, historyController.toggleFavorite);
router.delete('/:id', authMiddleware, historyController.deleteHistoryItem);

module.exports = router;
