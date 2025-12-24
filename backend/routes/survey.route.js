const express = require('express')
const router = express.Router()
const SurveyController = require('../controllers/survey.controller.js');
const checkAuth = require('../middlewares/auth.middleware.js');

router.post('/', checkAuth, SurveyController.postSurvey);
router.get('/', checkAuth, SurveyController.getMySurveys);

module.exports = router;
