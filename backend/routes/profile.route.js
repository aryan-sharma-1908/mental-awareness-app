const userModel = require('../models/user.model.js');
const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/auth.middleware.js');
router.get('/profile',checkAuth, async (req,res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');

        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

module.exports = router;