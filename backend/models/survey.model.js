const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Object, required: true },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey;


