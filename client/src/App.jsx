import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LanguageFrameworkBar } from './components/LanguageFrameworkBar';
import { CodeInputPane } from './components/CodeInputPane';
import { ResultsPane } from './components/ResultsPane';
import { ApiKeyModal } from './components/ApiKeyModal';
import { HistoryModal } from './components/HistoryModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { AuthModal } from './components/AuthModal';
import { PRESETS } from './lib/presets';
import { detectLanguageAndFramework } from './lib/languageDetect';
import { api } from './lib/api';
import confetti from 'canvas-confetti';

export default function App() {
  const initialPreset = PRESETS[0];

  const [sourceCode, setSourceCode] = useState(initialPreset.code);
  const [language, setLanguage] = useState(initialPreset.language);
  const [framework, setFramework] = useState(initialPreset.framework);
  const [modelName, setModelName] = useState('gemini-1.5-flash');
  const [customInstructions, setCustomInstructions] = useState('');
  
  const [results, setResults] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [detectedInfo, setDetectedInfo] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);

  // Email notify state (inspired by Dusk)
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyStatus, setNotifyStatus] = useState('');

  // Modals
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Load history count
  const refreshHistoryCount = async () => {
    try {
      const items = await api.getHistory();
      if (Array.isArray(items)) {
        setHistoryCount(items.length);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    refreshHistoryCount();
  }, []);

  // Code input language auto-detection
  useEffect(() => {
    const detected = detectLanguageAndFramework(sourceCode);
    if (detected) {
      setDetectedInfo(detected);
    } else {
      setDetectedInfo(null);
    }
  }, [sourceCode]);

  // Handle preset selection
  const handleSelectPreset = (presetId) => {
    const found = PRESETS.find(p => p.id === presetId);
    if (found) {
      setSourceCode(found.code);
      setLanguage(found.language);
      setFramework(found.framework);
      setResults(null);
    }
  };

  // Generation Handler
  const handleGenerate = async () => {
    if (!sourceCode || sourceCode.trim().length === 0) {
      alert('Please enter or paste a function before generating tests.');
      return;
    }

    setGenerating(true);
    setGenerationStep('Analyzing AST & Parameters...');

    const stepTimer1 = setTimeout(() => {
      setGenerationStep('Formulating Edge Cases & Boundaries...');
    }, 900);

    const stepTimer2 = setTimeout(() => {
      setGenerationStep('Synthesizing Test Assertions...');
    }, 2000);

    try {
      const data = await api.generateTests({
        sourceCode,
        language,
        framework,
        customInstructions,
        modelName
      });

      setResults(data);
      refreshHistoryCount();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Test generation error:', err);
      alert(`Generation error: ${err.message}`);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setGenerating(false);
      setGenerationStep('');
    }
  };

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter to generate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!generating) {
          handleGenerate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sourceCode, language, framework, customInstructions, modelName, generating]);

  // Load from history
  const handleLoadGeneration = (item) => {
    if (item.sourceCode) setSourceCode(item.sourceCode);
    if (item.language) setLanguage(item.language);
    if (item.framework) setFramework(item.framework);
    setResults({
      id: item.id || item._id,
      functionName: item.functionName,
      testCode: item.testCode,
      explanation: item.explanation,
      testCases: item.testCases || [],
      detectedBugs: item.detectedBugs || [],
      mockingSuggestions: item.mockingSuggestions || [],
      coverageEstimate: item.coverageEstimate
    });
  };

  const handleUpdateTestCode = (newCode) => {
    setResults(prev => prev ? { ...prev, testCode: newCode } : prev);
  };

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifyStatus('Subscribed. We’ll notify you when new framework integrations arrive.');
    setNotifyEmail('');
    setTimeout(() => setNotifyStatus(''), 4000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-dusk text-ink">
      {/* Navigation */}
      <Navbar
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        onOpenHistoryModal={() => setHistoryModalOpen(true)}
        onOpenAnalyticsModal={() => setAnalyticsModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        historyCount={historyCount}
      />

      {/* Toolbar Bar */}
      <LanguageFrameworkBar
        language={language}
        setLanguage={setLanguage}
        framework={framework}
        setFramework={setFramework}
        modelName={modelName}
        setModelName={setModelName}
        customInstructions={customInstructions}
        setCustomInstructions={setCustomInstructions}
        onSelectPreset={handleSelectPreset}
        onGenerate={handleGenerate}
        generating={generating}
        generationStep={generationStep}
      />

      {/* Main Split Editor Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[580px]">
          {/* Left Pane: Source Function Input */}
          <div className="h-[480px] lg:h-full">
            <CodeInputPane
              sourceCode={sourceCode}
              setSourceCode={setSourceCode}
              language={language}
              detectedInfo={detectedInfo}
            />
          </div>

          {/* Right Pane: Generated Test Suite & Tools */}
          <div className="h-[560px] lg:h-full">
            <ResultsPane
              results={results}
              sourceCode={sourceCode}
              language={language}
              framework={framework}
              onUpdateTestCode={handleUpdateTestCode}
            />
          </div>
        </div>

        {/* Minimalist Details & Specs Section (Dusk inspired) */}
        <section className="mt-12 pt-8 border-t border-dusk">
          <h2 className="text-base font-semibold text-ink mb-4 tracking-tight">System Specifications</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-muted-dusk">
            <div className="space-y-1">
              <dt className="text-ink font-semibold">Test Matrix</dt>
              <dd>Happy path, boundary thresholds, falsy/null values, and expected error assertions.</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-ink font-semibold">AST Analysis</dt>
              <dd>Parses argument contracts, detecting loose equality and uncaught exception paths.</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-ink font-semibold">Isolated Sandbox</dt>
              <dd>In-browser Node VM test runner evaluates assertions safely with real duration tracking.</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-ink font-semibold">Data Privacy</dt>
              <dd>Zero telemetry storage of proprietary secrets. Complete history removal at any time.</dd>
            </div>
          </dl>
        </section>

        {/* Editorial Footer (inspired by Dusk) */}
        <footer className="mt-12 pt-8 border-t border-dusk flex flex-col sm:flex-row sm:items-end justify-between gap-8 text-xs text-muted-dusk pb-8">
          {/* Email notify form */}
          <form onSubmit={handleNotifySubmit} className="max-w-md w-full">
            <label htmlFor="email" className="block text-ink font-medium mb-1.5">
              Get one email when new language models or test runners arrive.
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 min-w-0 bg-transparent text-ink border-0 border-b border-dusk focus:border-ink py-1 px-0 text-xs focus:outline-none placeholder:text-muted-dusk transition"
              />
              <button
                type="submit"
                className="text-ink underline hover:opacity-75 cursor-pointer py-1 px-2 font-medium"
              >
                Notify me
              </button>
            </div>
            {notifyStatus && (
              <p className="text-[11px] text-muted-dusk mt-1.5">{notifyStatus}</p>
            )}
          </form>

          {/* Foot links & shortcut */}
          <div className="flex flex-col sm:items-end gap-2 text-xs">
            <div className="flex items-center gap-4">
              <span>Shortcut: <kbd className="bg-dusk-card border border-dusk px-1.5 py-0.5 rounded text-[10px] text-ink font-mono">Ctrl</kbd> + <kbd className="bg-dusk-card border border-dusk px-1.5 py-0.5 rounded text-[10px] text-ink font-mono">Enter</kbd></span>
            </div>
            <p className="text-muted-dusk text-[11px]">
              TestPilot — Automated unit testing refined to a craft.
            </p>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
      />

      <HistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        onLoadGeneration={handleLoadGeneration}
      />

      <AnalyticsModal
        isOpen={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
