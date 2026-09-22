import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileCheck, 
  ListChecks, 
  Bug, 
  Play, 
  Copy, 
  Check, 
  Download, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Terminal,
  ChevronRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../lib/api';
import { useTheme } from '../contexts/ThemeContext';

export const ResultsPane = ({
  results,
  sourceCode,
  language,
  framework,
  onUpdateTestCode
}) => {
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'breakdown' | 'bugs' | 'runner'
  const [copied, setCopied] = useState(false);
  const [testFilter, setTestFilter] = useState('all');
  const [expandedTests, setExpandedTests] = useState({});
  const { isDark } = useTheme();
  
  // Runner state
  const [runningTests, setRunningTests] = useState(false);
  const [runOutput, setRunOutput] = useState(null);

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[450px] bg-dusk-card border border-dusk rounded-xl p-8 text-center">
        <div className="w-14 h-14 rounded-full border border-dusk bg-dusk flex items-center justify-center mb-4 text-[#FFB73A]">
          <Sparkles className="w-6 h-6 opacity-70" />
        </div>
        <h3 className="text-base font-semibold text-ink">No Tests Generated Yet</h3>
        <p className="text-xs text-muted-dusk max-w-sm mt-1.5 leading-relaxed">
          Paste a code function or pick one of our presets, then click <strong className="text-ink">Generate tests</strong>.
        </p>
      </div>
    );
  }

  const { functionName, testCode, testCases = [], detectedBugs = [], coverageEstimate, isMock, generationNotice } = results;

  const handleCopy = () => {
    if (!testCode) return;
    navigator.clipboard.writeText(testCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFilename = () => {
    const fn = functionName || 'function';
    const lang = (language || '').toLowerCase();
    if (lang.includes('python')) return `test_${fn}.py`;
    if (lang.includes('java')) return `${fn.charAt(0).toUpperCase() + fn.slice(1)}Test.java`;
    if (lang.includes('typescript')) return `${fn}.test.ts`;
    return `${fn}.test.js`;
  };

  const handleDownload = () => {
    const filename = getFilename();
    const blob = new Blob([testCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunTests = async () => {
    setRunningTests(true);
    try {
      const output = await api.runTests({
        sourceCode,
        testCode,
        language
      });
      setRunOutput(output);
      if (output.failed === 0 && output.passed > 0) {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      setRunOutput({
        total: 1,
        passed: 0,
        failed: 1,
        durationMs: 0,
        tests: [{ title: 'Execution failed', status: 'failed', error: err.message }],
        logs: []
      });
    } finally {
      setRunningTests(false);
    }
  };

  const toggleTestExpand = (idx) => {
    setExpandedTests(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredTests = testCases.filter(t => {
    if (testFilter === 'all') return true;
    return t.type === testFilter;
  });

  const monacoLanguage = language === 'typescript' ? 'typescript' : language === 'python' ? 'python' : language === 'java' ? 'java' : 'javascript';

  return (
    <div className="flex flex-col h-full bg-dusk-card border border-dusk rounded-xl overflow-hidden">
      {/* Notice if any */}
      {generationNotice && (
        <div className="bg-[#FFB73A]/10 border-b border-dusk px-4 py-2 text-[11px] text-[#FFB73A] flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{generationNotice}</span>
        </div>
      )}

      {/* Clean Tab Header */}
      <div className="px-4 border-b border-dusk flex flex-wrap items-center justify-between gap-2 bg-dusk-card">
        <div className="flex items-center space-x-6 overflow-x-auto text-xs font-medium">
          
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3.5 transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'code'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-muted-dusk hover:text-ink'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Test Suite</span>
          </button>

          <button
            onClick={() => setActiveTab('breakdown')}
            className={`py-3.5 transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'breakdown'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-muted-dusk hover:text-ink'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>Cases ({testCases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bugs')}
            className={`py-3.5 transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'bugs'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-muted-dusk hover:text-ink'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Bugs ({detectedBugs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('runner')}
            className={`py-3.5 transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'runner'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-muted-dusk hover:text-ink'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Live Runner</span>
            {runOutput && (
              <span className={`w-1.5 h-1.5 rounded-full ${runOutput.failed === 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            )}
          </button>
        </div>

        {/* Coverage & File Actions */}
        <div className="flex items-center gap-2 py-2">
          {coverageEstimate && (
            <span className="hidden sm:inline-block text-[11px] text-muted-dusk font-mono mr-2">
              {coverageEstimate.statementCoverage}% coverage
            </span>
          )}

          <button
            onClick={handleCopy}
            className="pill-btn text-xs py-1 px-2.5 text-muted-dusk hover:text-ink"
            title="Copy test code"
          >
            {copied ? <Check className="w-3 h-3 text-[#FFB73A]" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="pill-btn text-xs py-1 px-2.5 text-muted-dusk hover:text-ink"
            title="Download test file"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Monaco Code Editor */}
      {activeTab === 'code' && (
        <div className="flex-1 w-full min-h-[360px] flex flex-col relative">
          <div className="bg-dusk px-4 py-1.5 text-[11px] text-muted-dusk border-b border-dusk flex items-center justify-between font-mono">
            <span>{getFilename()}</span>
            <span className="text-[10px]">Editable</span>
          </div>
          <div className="flex-1 w-full min-h-[360px]">
            <Editor
              height="100%"
              language={monacoLanguage}
              theme={isDark ? 'vs-dark' : 'vs'}
              value={testCode}
              onChange={(val) => onUpdateTestCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                fontFamily: 'Fira Code, Menlo, monospace',
                padding: { top: 12, bottom: 12 },
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth'
              }}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Test Cases Breakdown */}
      {activeTab === 'breakdown' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-dusk">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 pb-2 border-b border-dusk overflow-x-auto text-xs">
            {['all', 'happy_path', 'edge_case', 'boundary', 'error_case'].map(filter => (
              <button
                key={filter}
                onClick={() => setTestFilter(filter)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize transition ${
                  testFilter === filter
                    ? 'bg-dusk-btn-bg text-dusk-btn-fg shadow-sm'
                    : 'bg-dusk-card text-muted-dusk border border-dusk hover:border-ink hover:text-ink'
                }`}
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Test Case Cards */}
          {filteredTests.map((test, idx) => {
            const isExpanded = expandedTests[idx];

            return (
              <div
                key={idx}
                className="rounded-lg border border-dusk bg-dusk-card overflow-hidden transition"
              >
                <div
                  onClick={() => toggleTestExpand(idx)}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer select-none hover:bg-dusk/50 transition"
                >
                  <div className="flex items-center gap-2.5">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-dusk" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-dusk" />
                    )}
                    <span className="text-xs font-semibold text-ink">{test.title}</span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-dusk bg-dusk text-muted-dusk font-mono uppercase font-medium">
                    {test.type.replace('_', ' ')}
                  </span>
                </div>

                {test.explanation && (
                  <p className="px-4 pb-3 text-xs text-muted-dusk leading-relaxed">
                    {test.explanation}
                  </p>
                )}

                {isExpanded && test.code && (
                  <div className="border-t border-dusk bg-dusk p-3">
                    <pre className="text-xs font-mono text-ink overflow-x-auto">
                      <code>{test.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Detected Bugs */}
      {activeTab === 'bugs' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-dusk">
          <div className="mb-2">
            <h4 className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Potential code vulnerabilities and unhandled conditions</span>
            </h4>
            <p className="text-[11px] text-muted-dusk mt-0.5">
              Evaluated during test synthesis for missing guards, loose comparisons, or exceptions.
            </p>
          </div>

          {detectedBugs.length === 0 ? (
            <div className="p-8 rounded-lg bg-dusk-card border border-dusk text-center">
              <ShieldCheck className="w-7 h-7 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-ink">Clean AST Analysis</p>
              <p className="text-[11px] text-muted-dusk mt-1">No obvious anti-patterns or uncaught exceptions detected.</p>
            </div>
          ) : (
            detectedBugs.map((bug, i) => (
              <div key={i} className="p-4 rounded-lg bg-dusk-card border border-dusk space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    {bug.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-dusk bg-dusk text-muted-dusk uppercase font-medium">
                    {bug.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-dusk leading-relaxed">{bug.description}</p>
                {bug.suggestion && (
                  <div className="bg-dusk rounded p-2.5 text-xs font-mono text-ink border border-dusk">
                    <span className="text-[10px] text-muted-dusk block font-sans uppercase font-bold mb-1">
                      Suggested Fix:
                    </span>
                    {bug.suggestion}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Live Test Runner */}
      {activeTab === 'runner' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 bg-dusk">
          <div className="flex items-center justify-between bg-dusk-card border border-dusk rounded-xl p-4">
            <div>
              <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#FFB73A]" />
                <span>Isolated Test Execution</span>
              </h4>
              <p className="text-[11px] text-muted-dusk mt-0.5">
                Run the generated assertions directly against the function code in a secure sandbox.
              </p>
            </div>
            <button
              onClick={handleRunTests}
              disabled={runningTests}
              className="btn-dusk px-5 py-2 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{runningTests ? 'Running...' : 'Run tests'}</span>
            </button>
          </div>

          {/* Test Execution Output */}
          {runOutput ? (
            <div className="space-y-3">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-lg bg-dusk-card border border-dusk text-center">
                  <span className="text-[10px] text-muted-dusk block uppercase font-medium">Passed</span>
                  <span className="text-base font-bold text-emerald-500">{runOutput.passed}</span>
                </div>
                <div className="p-3 rounded-lg bg-dusk-card border border-dusk text-center">
                  <span className="text-[10px] text-muted-dusk block uppercase font-medium">Failed</span>
                  <span className={`text-base font-bold ${runOutput.failed > 0 ? 'text-rose-500' : 'text-muted-dusk'}`}>
                    {runOutput.failed}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-dusk-card border border-dusk text-center">
                  <span className="text-[10px] text-muted-dusk block uppercase font-medium">Duration</span>
                  <span className="text-base font-bold text-ink font-mono">{runOutput.durationMs} ms</span>
                </div>
              </div>

              {/* Test List */}
              <div className="space-y-1.5">
                {runOutput.tests && runOutput.tests.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-dusk-card border border-dusk text-xs flex flex-col space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {t.status === 'passed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                        <span className="font-mono text-ink">{t.title}</span>
                      </div>
                      <span className="text-[10px] text-muted-dusk font-mono">{t.durationMs || 1}ms</span>
                    </div>
                    {t.error && (
                      <p className="text-[11px] text-rose-500 font-mono bg-dusk p-2 rounded border border-rose-500/20 mt-1">
                        {t.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Console Logs */}
              {runOutput.logs && runOutput.logs.length > 0 && (
                <div className="p-3 bg-dusk rounded-lg border border-dusk font-mono text-xs text-muted-dusk">
                  <span className="text-[10px] text-muted-dusk uppercase font-bold block mb-1">Execution Trace</span>
                  {runOutput.logs.map((l, i) => (
                    <div key={i} className="text-ink">{l}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-dusk rounded-xl text-center text-muted-dusk text-xs">
              Click <strong className="text-ink">Run tests</strong> to evaluate code contracts in the sandbox.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
