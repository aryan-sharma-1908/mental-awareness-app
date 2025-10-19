const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller.js');
const checkAuth = require('../middlewares/auth.middleware.js');

router.post('/setup', checkAuth, profileController.setupProfile);
router.get('/', checkAuth, profileController.getProfile);
module.exports = router;