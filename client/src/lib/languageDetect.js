export const detectLanguageAndFramework = (code) => {
  if (!code || typeof code !== 'string') return null;

  const trimmed = code.trim();

  // Python detection
  if (
    /def\s+\w+\s*\(/.test(trimmed) ||
    /import\s+pytest/.test(trimmed) ||
    /from\s+[\w.]+\s+import/.test(trimmed) ||
    /self\.\w+/.test(trimmed) ||
    /elif\s+/.test(trimmed) ||
    /__init__/.test(trimmed)
  ) {
    return { language: 'python', framework: 'pytest' };
  }

  // Java detection
  if (
    /public\s+(?:static\s+)?(?:void|class|int|String|boolean)/.test(trimmed) ||
    /System\.out\.println/.test(trimmed) ||
    /@Override/.test(trimmed) ||
    /package\s+[\w.]+;/.test(trimmed)
  ) {
    return { language: 'java', framework: 'junit' };
  }

  // TypeScript detection
  if (
    /interface\s+\w+/.test(trimmed) ||
    /type\s+\w+\s*=/.test(trimmed) ||
    /:\s*(?:string|number|boolean|any|void)[\s,;)\]]/.test(trimmed) ||
    /<[A-Z]\w*>/g.test(trimmed)
  ) {
    return { language: 'typescript', framework: 'jest' };
  }

  // JavaScript default
  if (
    /function\s+\w*/.test(trimmed) ||
    /const\s+\w+/.test(trimmed) ||
    /let\s+\w+/.test(trimmed) ||
    /=>/.test(trimmed) ||
    /console\.log/.test(trimmed)
  ) {
    return { language: 'javascript', framework: 'jest' };
  }

  return null;
};
