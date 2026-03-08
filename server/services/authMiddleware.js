const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    console.log(`[AUTH CHECK] Path: ${req.url}, Auth Header: ${req.headers.authorization ? 'Present' : 'MISSING'}`);

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            console.log(`[AUTH CHECK] Success: ${req.user ? req.user.email : 'User not found in DB'}`);
            return next();
        } catch (error) {
            console.error(`[AUTH CHECK] Token verification failed: ${error.message}`);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.log(`[AUTH CHECK] No token found in headers`);
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};


module.exports = { protect };
