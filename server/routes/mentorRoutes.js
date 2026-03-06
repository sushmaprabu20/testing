const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { protect } = require('../services/authMiddleware');

router.post('/register', protect, mentorController.registerMentor);
router.post('/recommendations', protect, mentorController.getRecommendedMentors);
router.get('/profile', protect, mentorController.getUserProfile);
router.put('/profile', protect, mentorController.updateProfile);
router.get('/all', protect, mentorController.getAllMentors);

module.exports = router;
