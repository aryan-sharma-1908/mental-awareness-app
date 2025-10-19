const cookies = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const checkAuth = async (req,res,next) => {
    console.log('=== CheckAuth Middleware ===');
    console.log('All cookies:', req.cookies);
    console.log('Token:', req.cookies.token);

    const token = req.cookies?.token || '';

    if(!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. User not found.'
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        })
    }
}

module.exports = checkAuth;