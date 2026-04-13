/**
 * Synthetic Survey Data Generator
 * Generates random but realistic survey responses for testing/ML datasets.
 *
 * Usage:
 *   node scripts/generateSyntheticData.js
 *
 * Env vars needed: MONGO_URI (or update the uri below)
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Survey = require("../models/survey.model");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mental_health";
const NUM_USERS = 50;        // synthetic user count
const SURVEYS_PER_USER = 3;  // one of each type per user

/* ─── Score maps (must match controller) ─────────────── */
const PHQ_GAD_OPTIONS = ["Not at all", "Several days", "More than half the days", "Almost every day"];
const WHO_OPTIONS     = ["At no time", "Some of the time", "Less than half of the time",
                         "More than half of the time", "Most of the time", "All of the time"];

const PHQ_GAD_SCORE = { "Not at all": 0, "Several days": 1, "More than half the days": 2, "Almost every day": 3 };
const WHO_SCORE     = { "At no time": 0, "Some of the time": 1, "Less than half of the time": 2,
                        "More than half of the time": 3, "Most of the time": 4, "All of the time": 5 };

const SURVEY_CONFIGS = {
  "PHQ-9": { prefix: "phq", count: 9, options: PHQ_GAD_OPTIONS, scoreMap: PHQ_GAD_SCORE },
  "GAD-7": { prefix: "gad", count: 7, options: PHQ_GAD_OPTIONS, scoreMap: PHQ_GAD_SCORE },
  "WHO-5": { prefix: "who", count: 5, options: WHO_OPTIONS,     scoreMap: WHO_SCORE     },
};

/* ─── Helpers ─────────────────────────────────────────── */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const calculateScore = (answers, scoreMap) =>
  Object.values(answers).reduce((sum, v) => sum + (scoreMap[v] ?? 0), 0);

const getSeverity = (type, score) => {
  if (type === "GAD-7") {
    if (score <= 4) return "Minimal";
    if (score <= 9) return "Mild";
    if (score <= 14) return "Moderate";
    return "Severe";
  }
  if (type === "PHQ-9") {
    if (score <= 4) return "Minimal";
    if (score <= 9) return "Mild";
    if (score <= 14) return "Moderate";
    if (score <= 19) return "Moderately Severe";
    return "Severe";
  }
  return score < 13 ? "Low Well-being" : "Normal Well-being";
};

const generateSurvey = (userId, surveyType) => {
  const { prefix, count, options, scoreMap } = SURVEY_CONFIGS[surveyType];
  const answers = {};
  for (let i = 1; i <= count; i++) {
    answers[`${prefix}-${i}`] = pick(options);
  }
  const totalScore = calculateScore(answers, scoreMap);
  const severity   = getSeverity(surveyType, totalScore);

  return {
    user: userId,
    surveyType,
    answers,
    totalScore,
    severity,
    // spread submissions randomly over the past 90 days
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
  };
};

/* ─── Main ────────────────────────────────────────────── */
async function main() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGO_URI);
  console.log("Connected.");

  const docs = [];
  for (let u = 0; u < NUM_USERS; u++) {
    // Use a fresh ObjectId to simulate distinct users
    const userId = new mongoose.Types.ObjectId();
    for (const surveyType of ["PHQ-9", "GAD-7", "WHO-5"]) {
      docs.push(generateSurvey(userId, surveyType));
    }
  }

  await Survey.insertMany(docs);
  console.log(`✅  Inserted ${docs.length} synthetic surveys (${NUM_USERS} users × ${SURVEYS_PER_USER} surveys).`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});