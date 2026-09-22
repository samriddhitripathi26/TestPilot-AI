import React from 'react';
import Editor from '@monaco-editor/react';
import { Trash2, Copy, Check, FileCode } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const CodeInputPane = ({
  sourceCode,
  setSourceCode,
  language,
  detectedInfo
}) => {
  const [copied, setCopied] = React.useState(false);
  const { isDark } = useTheme();

  const handleCopy = () => {
    if (!sourceCode) return;
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setSourceCode('');
  };

  const monacoLanguage = language === 'typescript' ? 'typescript' : language === 'python' ? 'python' : language === 'java' ? 'java' : 'javascript';

  const lineCount = sourceCode.split('\n').length;
  const charCount = sourceCode.length;

  return (
    <div className="flex flex-col h-full bg-dusk-card border border-dusk rounded-xl overflow-hidden">
      {/* Pane Header */}
      <div className="h-12 px-4 border-b border-dusk flex items-center justify-between bg-dusk-card">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink">
            Source Function
          </span>
          {detectedInfo && (
            <span className="text-[10px] text-muted-dusk border border-dusk px-2 py-0.5 rounded-full font-mono">
              detected: {detectedInfo.language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-dusk font-mono hidden sm:inline">
            {lineCount} lines · {charCount} chars
          </span>
          <div className="h-3 w-px bg-dusk-line hidden sm:block" />
          <button
            onClick={handleCopy}
            disabled={!sourceCode}
            className="p-1.5 rounded-md text-muted-dusk hover:text-ink hover:bg-dusk transition disabled:opacity-40"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#FFB73A]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClear}
            disabled={!sourceCode}
            className="p-1.5 rounded-md text-muted-dusk hover:text-rose-500 hover:bg-dusk transition disabled:opacity-40"
            title="Clear code"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full min-h-[360px] relative">
        <Editor
          height="100%"
          language={monacoLanguage}
          theme={isDark ? 'vs-dark' : 'vs'}
          value={sourceCode}
          onChange={(val) => setSourceCode(val || '')}
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
            cursorBlinking: 'smooth',
            smoothScrolling: true
          }}
          loading={
            <div className="flex items-center justify-center h-full text-xs text-muted-dusk">
              Loading editor...
            </div>
          }
        />
      </div>
    </div>
  );
};
