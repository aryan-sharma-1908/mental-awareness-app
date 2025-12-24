const Survey = require('../models/survey.model');

exports.postSurvey = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User not found.' });
    }

    const { answers, submittedAt } = req.body || {};
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ success: false, message: 'Answers are required.' });
    }

    const survey = new Survey({ user: userId, answers, submittedAt: submittedAt || Date.now() });
    await survey.save();

    res.status(201).json({ success: true, message: 'Survey submitted successfully', survey });
  } catch (error) {
    console.error('Error saving survey:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

exports.getMySurveys = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const surveys = await Survey.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Surveys fetched', surveys });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};
