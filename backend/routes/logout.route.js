const express = require('express');
const router = express.Router();
const LogoutController = require('../controllers/logout.controller.js');

router.post('/', LogoutController.logout);

module.exports = router;