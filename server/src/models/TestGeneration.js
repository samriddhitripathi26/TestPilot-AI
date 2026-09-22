const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['happy_path', 'edge_case', 'boundary', 'error_case', 'mocking', 'other'],
    default: 'happy_path'
  },
  code: { type: String, required: true },
  explanation: { type: String }
});

const DetectedBugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  severity: { type: String, enum: ['high', 'medium', 'low', 'info'], default: 'medium' },
  description: { type: String, required: true },
  suggestion: { type: String }
});

const TestGenerationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  functionName: {
    type: String,
    default: 'anonymousFunction'
  },
  language: {
    type: String,
    required: true
  },
  framework: {
    type: String,
    required: true
  },
  sourceCode: {
    type: String,
    required: true
  },
  testCode: {
    type: String,
    required: true
  },
  explanation: {
    type: String
  },
  testCases: [TestCaseSchema],
  detectedBugs: [DetectedBugSchema],
  mockingSuggestions: [String],
  coverageEstimate: {
    statementCoverage: { type: Number, default: 95 },
    branchCoverage: { type: Number, default: 90 },
    edgeCaseCoverage: { type: Number, default: 92 }
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('TestGeneration', TestGenerationSchema);
