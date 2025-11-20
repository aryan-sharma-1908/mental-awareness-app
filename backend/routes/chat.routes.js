const express = require('express');
const checkAuth = require('../middlewares/auth.middleware.js');
const router = express.Router();
const chatController = require('../controllers/chat.controller.js');

router.post('/open', checkAuth, chatController.openChat);

router.get('/:chatId/messages', checkAuth, chatController.messageHandler);

module.exports = router;
