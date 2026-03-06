const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');
const { protect } = require('../services/authMiddleware');

router.get('/', protect, expertController.getAllExperts);
router.post('/recommendations', protect, expertController.getRecommendations);

module.exports = router;
