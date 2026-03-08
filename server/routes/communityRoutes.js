const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { protect } = require('../services/authMiddleware');

router.post('/posts', protect, communityController.createPost);
router.get('/posts', protect, communityController.getPosts);
router.post('/posts/:id/like', protect, communityController.likePost);
router.post('/posts/:id/comment', protect, communityController.addComment);

router.get('/groups', protect, communityController.getGroups);
router.post('/groups/:id/join', protect, communityController.joinGroup);
router.delete('/posts/:id', protect, communityController.deletePost);
router.delete('/posts/:id/comment/:commentId', protect, communityController.deleteComment);

module.exports = router;
