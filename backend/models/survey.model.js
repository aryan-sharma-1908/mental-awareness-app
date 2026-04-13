const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    surveyType: {
      type: String,
      enum: ["PHQ-9", "GAD-7", "WHO-5"],
      required: true,
    },
    // Raw answers: { "phq-1": "Not at all", "phq-2": "Several days", ... }
    answers: {
      type: Map,
      of: String,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    severity: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
);

module.exports = mongoose.model("Survey", surveySchema);