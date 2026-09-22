const { generateTestsWithAI } = require('../services/aiService');
const { localDb, isUsingMongo } = require('../config/db');
const TestGeneration = require('../models/TestGeneration');

const generate = async (req, res) => {
  try {
    const {
      sourceCode,
      language = 'javascript',
      framework = 'jest',
      customInstructions = '',
      apiKey = null,
      modelName = 'gemini-1.5-flash'
    } = req.body;

    if (!sourceCode || typeof sourceCode !== 'string' || sourceCode.trim().length === 0) {
      return res.status(400).json({ error: 'Source code is required to generate unit tests.' });
    }

    if (sourceCode.length > 25000) {
      return res.status(400).json({
        error: 'Code length exceeds maximum character limit (25,000 characters). Please split into smaller functions.'
      });
    }

    const userId = req.user ? req.user.id : 'guest_anon';

    // Call AI Service
    const aiResult = await generateTestsWithAI({
      sourceCode,
      language,
      framework,
      customInstructions,
      apiKey,
      modelName
    });

    const generationPayload = {
      userId,
      functionName: aiResult.functionName || 'myFunction',
      language,
      framework,
      sourceCode,
      testCode: aiResult.testCode,
      explanation: aiResult.explanation || '',
      testCases: aiResult.testCases || [],
      detectedBugs: aiResult.detectedBugs || [],
      mockingSuggestions: aiResult.mockingSuggestions || [],
      coverageEstimate: aiResult.coverageEstimate || {
        statementCoverage: 95,
        branchCoverage: 90,
        edgeCaseCoverage: 92
      }
    };

    let savedRecord;
    if (isUsingMongo()) {
      savedRecord = await TestGeneration.create(generationPayload);
    } else {
      savedRecord = localDb.createGeneration(generationPayload);
    }

    return res.status(200).json({
      success: true,
      data: {
        id: savedRecord._id || savedRecord.id,
        ...aiResult,
        createdAt: savedRecord.createdAt,
        isFavorite: false
      }
    });
  } catch (error) {
    console.error('[Generate Controller Error]:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate test suite. Please try again.'
    });
  }
};

module.exports = {
  generate
};
