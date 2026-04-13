const express = require("express");
const router = express.Router();
const SurveyController = require("../controllers/survey.controller");
const checkAuth = require("../middlewares/auth.middleware");

// Submit a single survey section
router.post("/", checkAuth, SurveyController.postSurvey);

// Get authenticated user's own survey history
router.get("/", checkAuth, SurveyController.getMySurveys);

const noCache = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};
// Export all surveys as CSV (add your own admin guard if needed)
router.get("/export", checkAuth, noCache, SurveyController.exportSurveys);

module.exports = router;