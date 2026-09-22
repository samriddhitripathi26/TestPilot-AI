/**
 * Prompt Builder for TestPilot AI Test Generator
 */

const getFrameworkExamples = (language, framework) => {
  const fw = (framework || '').toLowerCase();
  const lang = (language || '').toLowerCase();

  if (lang.includes('python') || fw.includes('pytest')) {
    return `
Framework: PyTest
Syntax Style:
import pytest
from module import myFunction

def test_myFunction_valid_input():
    result = myFunction(10)
    assert result == 20

def test_myFunction_raises_value_error_on_negative():
    with pytest.raises(ValueError):
        myFunction(-1)
`;
  }

  if (lang.includes('java') || fw.includes('junit')) {
    return `
Framework: JUnit 5
Syntax Style:
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

class FunctionTest {
    @Test
    @DisplayName("Should return expected result on valid input")
    void testValidInput() {
        assertEquals(20, FunctionClass.myFunction(10));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException on negative input")
    void testNegativeInputThrows() {
        assertThrows(IllegalArgumentException.class, () -> FunctionClass.myFunction(-1));
    }
}
`;
  }

  return `
Framework: ${framework || 'Jest'}
Syntax Style:
// Using modern ${framework || 'Jest'}/Vitest syntax
describe('myFunction', () => {
  test('should return correct value for normal input', () => {
    expect(myFunction(10)).toBe(20);
  });

  test('should throw error or handle null gracefully', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
`;
};

const buildSystemPrompt = (language, framework, customInstructions = '') => {
  const fwExample = getFrameworkExamples(language, framework);

  return `You are TestPilot, an elite Staff Software Engineer and Test Automation Architect specializing in writing exhaustive, production-grade unit tests with 100% meaningful coverage.

TARGET LANGUAGE: ${language}
TARGET TEST FRAMEWORK: ${framework}
${customInstructions ? `USER INSTRUCTIONS: ${customInstructions}` : ''}

FRAMEWORK REFERENCE EXAMPLE:
${fwExample}

YOUR MISSION:
Analyze the user's function and generate a complete, executable, production-ready unit test suite.
You must be extremely thorough, testing:
1. Happy path (normal, typical operational values)
2. Edge cases (empty strings/arrays/objects, 0, -0, negative numbers, undefined, null, NaN, extreme integers, special chars, unicode)
3. Boundary conditions (off-by-one, min/max length, threshold values)
4. Error & exception handling (invalid types, unexpected arguments, thrown errors)
5. Mocking / Dependency isolation (if external APIs, databases, filesystem, or timers are referenced)
6. Potential Bugs: Critically inspect the user's code for real potential bugs, race conditions, edge-case crashes, or unhandled errors, and report them.

CRITICAL OUTPUT REQUIREMENT:
You MUST respond with pure JSON only, strictly matching this exact schema:
{
  "functionName": "the detected primary function name",
  "explanation": "High-level summary of the test strategy and coverage goals",
  "testCode": "The full, ready-to-run test file code with all necessary imports, mocks, and describe/test blocks. No markdown ticks outside the JSON.",
  "testCases": [
    {
      "title": "Clear descriptive test name (e.g. 'handles empty array gracefully')",
      "type": "happy_path | edge_case | boundary | error_case | mocking",
      "code": "Individual test case snippet (e.g. test(...) { ... })",
      "explanation": "Why this specific test is critical and what edge condition it guards against"
    }
  ],
  "detectedBugs": [
    {
      "title": "Title of bug or code smell detected in source code",
      "severity": "high | medium | low | info",
      "description": "Why the current function implementation might fail or behave unpredictably",
      "suggestion": "How the developer should patch the function"
    }
  ],
  "mockingSuggestions": [
    "Advice on any external dependencies, APIs, or time-based mocks needed"
  ],
  "coverageEstimate": {
    "statementCoverage": 98,
    "branchCoverage": 95,
    "edgeCaseCoverage": 94
  }
}

Do not include any conversational filler. Return ONLY valid, parseable JSON.`;
};

module.exports = {
  buildSystemPrompt,
  getFrameworkExamples
};
