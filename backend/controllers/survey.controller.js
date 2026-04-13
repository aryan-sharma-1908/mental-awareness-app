const Survey = require("../models/survey.model");
const { Parser } = require("json2csv");

/* ─────────────────────────────────────────────
   SCORE MAPS
   Each answer string maps to a numeric value.
───────────────────────────────────────────── */

const PHQ_9_SCORE = {
  "Not at all": 0,
  "Several days": 1,
  "More than half the days": 2,
  "Almost every day": 3,
};

const GAD_7_SCORE = PHQ_9_SCORE; // identical scale

const WHO_5_SCORE = {
  "At no time": 0,
  "Some of the time": 1,
  "Less than half of the time": 2,
  "More than half of the time": 3,
  "Most of the time": 4,
  "All of the time": 5,
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

/**
 * Sum scores for all answers using the provided scoreMap.
 * Skips any answer not present in the map (prevents NaN).
 */
const calculateScore = (answers, scoreMap) => {
  return Object.values(answers).reduce((total, answer) => {
    const value = scoreMap[answer];
    return total + (typeof value === "number" ? value : 0);
  }, 0);
};

/** Return a human-readable severity label based on survey type and score. */
const getSeverity = (surveyType, score) => {
  switch (surveyType) {
    case "GAD-7":
      if (score <= 4) return "Minimal";
      if (score <= 9) return "Mild";
      if (score <= 14) return "Moderate";
      return "Severe";

    case "PHQ-9":
      if (score <= 4) return "Minimal";
      if (score <= 9) return "Mild";
      if (score <= 14) return "Moderate";
      if (score <= 19) return "Moderately Severe";
      return "Severe";

    case "WHO-5":
      // WHO-5 raw score 0-25; multiply by 4 for % scale → <52% = low well-being
      // Here we keep raw: raw < 13 is low well-being
      return score < 13 ? "Low Well-being" : "Normal Well-being";

    default:
      return "Unknown";
  }
};

/** Pick the right score map for a given survey type. */
const getScoreMap = (surveyType) => {
  switch (surveyType) {
    case "PHQ-9":
      return PHQ_9_SCORE;
    case "GAD-7":
      return GAD_7_SCORE;
    case "WHO-5":
      return WHO_5_SCORE;
    default:
      return null;
  }
};

/* ─────────────────────────────────────────────
   CONTROLLERS
───────────────────────────────────────────── */

/**
 * POST /api/survey
 * Submit a single survey (PHQ-9, GAD-7, or WHO-5).
 * Body: { surveyType: string, answers: { [uid]: string } }
 */
exports.postSurvey = async (req, res) => {
  try {
    const { answers, surveyType } = req.body;

    // ── Validation ──────────────────────────────────────
    if (!surveyType || !answers || typeof answers !== "object") {
      return res
        .status(400)
        .json({ message: "Missing or invalid survey data." });
    }

    const scoreMap = getScoreMap(surveyType);
    if (!scoreMap) {
      return res
        .status(400)
        .json({ message: `Unknown surveyType: "${surveyType}"` });
    }

    if (Object.keys(answers).length === 0) {
      return res.status(400).json({ message: "Answers cannot be empty." });
    }

    // ── Check 7-day gap ──────────────────────────────────
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSurvey = await Survey.findOne({
      user: req.user._id,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: -1 });

    if (recentSurvey) {
      const daysSince = Math.ceil(
        (Date.now() - new Date(recentSurvey.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const remainingDays = 7 - daysSince;
      return res.status(429).json({
        message: `You can retake the survey in ${remainingDays} ${remainingDays === 1 ? "day" : "days"}.`,
      });
    }

    // ── Score + severity ─────────────────────────────────
    const totalScore = calculateScore(answers, scoreMap);
    const severity = getSeverity(surveyType, totalScore);

    // ── Persist ──────────────────────────────────────────
    const survey = await Survey.create({
      user: req.user._id,
      surveyType,
      answers, // stored as a Map in Mongo
      totalScore,
      severity,
    });

    return res.status(201).json({
      success: true,
      data: { surveyId: survey._id, totalScore, severity },
    });
  } catch (error) {
    console.error("[postSurvey]", error);
    return res
      .status(500)
      .json({ message: "Server error while saving survey." });
  }
};

/**
 * GET /api/survey
 * Return all surveys submitted by the authenticated user.
 */
exports.getMySurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, data: surveys });
  } catch (error) {
    console.error("[getMySurveys]", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching surveys." });
  }
};

/**
 * GET /api/survey/export
 * Admin/export route: returns all survey records as a CSV download.
 *
 * Two CSV formats based on query param:
 *   ?format=raw    → one row per survey record (default)
 *   ?format=pivot  → one row per user: phq_score, gad_score, who_score
 */
exports.exportSurveys = async (req, res) => {
  try {
    const format = req.query.format === "pivot" ? "pivot" : "raw";

    const surveys = await Survey.find({}).lean();

    if (surveys.length === 0) {
      return res.status(404).json({ message: "No survey data found." });
    }

    let csv;

    if (format === "raw") {
      // ── Raw: one row per survey entry ───────────────────
      const fields = [
        "user_id",
        "surveyType",
        "totalScore",
        "severity",
        "createdAt",
      ];
      const data = surveys.map((s) => ({
        user_id: s.user.toString(),
        surveyType: s.surveyType,
        totalScore: s.totalScore,
        severity: s.severity,
        createdAt: s.createdAt.toISOString(),
      }));

      const parser = new Parser({ fields });
      csv = parser.parse(data);
    } else {
      // ── Pivot: one row per user, columns per survey type ─
      const userMap = {}; // { userId: { phq_score, phq_severity, ... } }

      for (const s of surveys) {
        const uid = s.user.toString();
        if (!userMap[uid]) {
          userMap[uid] = {
            user_id: uid,
            phq_score: "",
            phq_severity: "",
            gad_score: "",
            gad_severity: "",
            who_score: "",
            who_severity: "",
          };
        }

        if (s.surveyType === "PHQ-9") {
          userMap[uid].phq_score = s.totalScore;
          userMap[uid].phq_severity = s.severity;
        } else if (s.surveyType === "GAD-7") {
          userMap[uid].gad_score = s.totalScore;
          userMap[uid].gad_severity = s.severity;
        } else if (s.surveyType === "WHO-5") {
          userMap[uid].who_score = s.totalScore;
          userMap[uid].who_severity = s.severity;
        }
      }

      const fields = [
        "user_id",
        "phq_score",
        "phq_severity",
        "gad_score",
        "gad_severity",
        "who_score",
        "who_severity",
      ];
      const parser = new Parser({ fields });
      csv = parser.parse(Object.values(userMap));
    }

    // ── Stream CSV as a file download ────────────────────
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="surveys_${format}_${Date.now()}.csv"`,
    );
    return res.status(200).send(csv);
  } catch (error) {
    console.error("[exportSurveys]", error);
    return res.status(500).json({ message: "Server error during export." });
  }
};
