import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  SlidersHorizontal, 
  Loader2,
  Wand2,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { PRESETS } from '../lib/presets';

const LANGUAGES = [
  { id: 'typescript', name: 'TypeScript', swatch: '#3178C6', frameworks: ['jest', 'vitest', 'mocha'] },
  { id: 'javascript', name: 'JavaScript', swatch: '#F7DF1E', frameworks: ['jest', 'vitest', 'mocha'] },
  { id: 'python', name: 'Python', swatch: '#3776AB', frameworks: ['pytest', 'unittest'] },
  { id: 'java', name: 'Java', swatch: '#EA2D2E', frameworks: ['junit'] },
];

const FRAMEWORK_LABELS = {
  jest: 'Jest',
  vitest: 'Vitest',
  mocha: 'Mocha',
  pytest: 'PyTest',
  unittest: 'unittest',
  junit: 'JUnit 5'
};

const MODELS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
];

export const LanguageFrameworkBar = ({
  language,
  setLanguage,
  framework,
  setFramework,
  modelName,
  setModelName,
  customInstructions,
  setCustomInstructions,
  onSelectPreset,
  onGenerate,
  generating,
  generationStep
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const currentLangObj = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const targetObj = LANGUAGES.find(l => l.id === newLang);
    if (targetObj && !targetObj.frameworks.includes(framework)) {
      setFramework(targetObj.frameworks[0]);
    }
  };

  return (
    <div className="w-full border-b border-dusk bg-dusk py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Editorial Subheader */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              A test generator that tests every edge.
            </h1>
            <p className="text-muted-dusk text-sm sm:text-base mt-1 max-w-2xl">
              Paste a function, choose a language and framework, and generate a complete suite of unit tests with boundary checks and error cases.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="relative shrink-0">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onSelectPreset(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="pill-select pr-8 text-xs text-ink"
            >
              <option value="" disabled>Load preset function...</option>
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.language})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted-dusk absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Minimalist Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-dusk">
          
          {/* Language selection pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-dusk font-medium mr-1">Language:</span>
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-dusk-btn-bg text-dusk-btn-fg shadow-sm'
                      : 'bg-dusk-card text-muted-dusk border border-dusk hover:border-ink hover:text-ink'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: lang.swatch }}
                  />
                  <span>{lang.name}</span>
                </button>
              );
            })}
          </div>

          {/* Framework and Action */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Framework Select */}
            <div className="flex items-center gap-1.5 text-xs text-muted-dusk">
              <span>Framework:</span>
              <div className="relative">
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="pill-select text-xs py-1.5 pr-7"
                >
                  {currentLangObj.frameworks.map((fw) => (
                    <option key={fw} value={fw}>{FRAMEWORK_LABELS[fw] || fw}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-muted-dusk absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Model Select */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-dusk">
              <span>Model:</span>
              <div className="relative">
                <select
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="pill-select text-xs py-1.5 pr-7"
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-muted-dusk absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Custom Requirements toggle */}
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className={`pill-btn text-xs py-1.5 ${
                customInstructions ? 'border-ink text-ink font-semibold' : 'text-muted-dusk'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Specs</span>
              {customInstructions && <span className="w-1.5 h-1.5 rounded-full bg-[#FFB73A]" />}
            </button>

            {/* Primary Action Button (matching Dusk's .button style) */}
            <button
              onClick={onGenerate}
              disabled={generating}
              className={`btn-dusk px-6 py-2.5 text-xs font-semibold tracking-tight inline-flex items-center justify-center gap-2 ${
                generating ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {generating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-dusk-btn-fg" />
                  <span>{generationStep || 'Generating...'}</span>
                </>
              ) : (
                <>
                  <span>Generate tests</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom Requirements Drawer */}
        {showInstructions && (
          <div className="pt-3 border-t border-dusk animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Optional test criteria: e.g. mock Stripe API, enforce 100% boundary check, test for zero division..."
                className="flex-1 bg-dusk-card border border-dusk rounded-full px-4 py-2 text-xs text-ink placeholder:text-muted-dusk focus:outline-none focus:border-ink transition font-sans"
              />
              {customInstructions && (
                <button
                  onClick={() => setCustomInstructions('')}
                  className="text-xs text-muted-dusk hover:text-ink px-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
