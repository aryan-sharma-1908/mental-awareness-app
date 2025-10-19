const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller.js');
const checkAuth = require('../middlewares/auth.middleware.js');

router.post('/', checkAuth, PostController.post);
router.get('/', checkAuth, PostController.getAllPosts);
module.exports = router;