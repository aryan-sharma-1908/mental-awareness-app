const cookies = require('cookie-parser');
const jwt = require('jsonwebtoken');
const checkAuth = (req,res,next) => {
    console.log('=== CheckAuth Middleware ===');
    console.log('All cookies:', req.cookies);
    console.log('Token:', req.cookies.token);

    const token = req.cookies?.token || '';

    if(!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        })
    }
}

module.exports = checkAuth;