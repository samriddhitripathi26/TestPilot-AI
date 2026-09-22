import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, Zap } from 'lucide-react';
import { getCustomApiKey, setCustomApiKey } from '../lib/api';

export const ApiKeyModal = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(getCustomApiKey() || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setCustomApiKey(apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKey('');
    setCustomApiKey('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-dusk-card border border-dusk rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-dusk flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-dusk bg-dusk flex items-center justify-center text-[#FFB73A]">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">AI Provider Configuration</h3>
              <p className="text-[11px] text-muted-dusk">Google Gemini API Key</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-dusk hover:text-ink hover:bg-dusk transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-dusk border border-dusk rounded-xl px-3.5 py-2.5 text-xs text-ink placeholder:text-muted-dusk focus:outline-none focus:border-ink font-mono"
            />
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-muted-dusk">Stored locally in your browser.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-ink underline hover:opacity-75 flex items-center gap-1"
              >
                <span>Get free Gemini key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-dusk border border-dusk space-y-1 text-xs text-muted-dusk">
            <div className="flex items-center gap-1.5 text-ink font-medium">
              <Zap className="w-3.5 h-3.5 text-[#FFB73A]" />
              <span>Zero-Config Fallback</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              If omitted, TestPilot automatically uses its built-in AST synthesizer so you can generate tests with zero setup.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="pill-btn text-xs text-muted-dusk hover:text-ink"
            >
              Reset to Demo
            </button>
            <button
              type="submit"
              className="btn-dusk px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
