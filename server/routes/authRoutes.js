const express = require('express');
const { registerUser, authUser, getUsers } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/users', getUsers);
router.get('/all', getUsers);
router.get('/', getUsers);




module.exports = router;
