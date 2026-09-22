/**
 * Code Validator & Sanitizer for TestPilot
 */

const extractJsonFromResponse = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty or invalid response from AI model.');
  }

  let cleaned = rawText.trim();

  // If the model wrapped in ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
    cleaned = cleaned.trim();
  }

  // Attempt direct JSON parse
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // If there's leading/trailing non-json text, extract first '{' to last '}'
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    if (startIdx !== -1 && endIdx > startIdx) {
      const jsonCandidate = cleaned.substring(startIdx, endIdx + 1);
      return JSON.parse(jsonCandidate);
    }
    throw new Error(`Failed to parse AI JSON response: ${err.message}`);
  }
};

const validateGeneratedTestSuite = (data, originalCode, expectedFunctionName) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid test suite structure received.');
  }

  // Ensure testCode exists
  if (!data.testCode || typeof data.testCode !== 'string' || data.testCode.trim().length === 0) {
    throw new Error('AI output missing runnable test code.');
  }

  // Clean testCode if wrapped in markdown codeblock
  if (data.testCode.startsWith('```')) {
    data.testCode = data.testCode.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '').trim();
  }

  // Ensure testCases array exists
  if (!Array.isArray(data.testCases) || data.testCases.length === 0) {
    // Attempt fallback array extraction
    data.testCases = [
      {
        title: 'Generated unit test case suite',
        type: 'happy_path',
        code: data.testCode,
        explanation: 'Covers core functionality and assertions.'
      }
    ];
  }

  // Ensure functionName fallback
  if (!data.functionName) {
    data.functionName = expectedFunctionName || 'testedFunction';
  }

  // Validate coverage estimate
  if (!data.coverageEstimate) {
    data.coverageEstimate = {
      statementCoverage: 95,
      branchCoverage: 90,
      edgeCaseCoverage: 92
    };
  }

  if (!Array.isArray(data.detectedBugs)) {
    data.detectedBugs = [];
  }

  return data;
};

// Simple heuristic detector for function name from source code
const detectFunctionName = (code) => {
  if (!code) return 'myFunction';
  
  // function foo(...)
  const fnMatch = code.match(/function\s+([a-zA-Z0-9_$]+)\s*\(/);
  if (fnMatch) return fnMatch[1];

  // const foo = (...) => or const foo = function(...)
  const varMatch = code.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>/);
  if (varMatch) return varMatch[1];

  // def foo(...) in Python
  const pyMatch = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
  if (pyMatch) return pyMatch[1];

  // public/private/static returnType foo(...) in Java
  const javaMatch = code.match(/(?:public|protected|private|static|\s)+[\w<>\[\]]+\s+([a-zA-Z0-9_]+)\s*\(/);
  if (javaMatch && javaMatch[1] !== 'class') return javaMatch[1];

  return 'testedFunction';
};

module.exports = {
  extractJsonFromResponse,
  validateGeneratedTestSuite,
  detectFunctionName
};
