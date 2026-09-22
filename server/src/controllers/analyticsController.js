const { localDb, isUsingMongo } = require('../config/db');
const TestGeneration = require('../models/TestGeneration');

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isUsingMongo()) {
      const generations = await TestGeneration.find({ userId });
      const languages = {};
      const frameworks = {};
      let totalTestCases = 0;
      let totalBugsCaught = 0;

      generations.forEach(g => {
        languages[g.language] = (languages[g.language] || 0) + 1;
        frameworks[g.framework] = (frameworks[g.framework] || 0) + 1;
        if (Array.isArray(g.testCases)) {
          totalTestCases += g.testCases.length;
        }
        if (Array.isArray(g.detectedBugs)) {
          totalBugsCaught += g.detectedBugs.length;
        }
      });

      return res.json({
        totalGenerations: generations.length,
        totalTestCases,
        totalBugsCaught,
        languages,
        frameworks,
        estimatedHoursSaved: Math.round(generations.length * 0.75 * 10) / 10
      });
    } else {
      const stats = localDb.getStats(userId);
      return res.json(stats);
    }
  } catch (err) {
    console.error('[Analytics Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve analytics.' });
  }
};

module.exports = {
  getAnalytics
};
