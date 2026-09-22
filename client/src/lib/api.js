const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('testpilot_token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('testpilot_token', token);
  else localStorage.removeItem('testpilot_token');
};

export const getCustomApiKey = () => localStorage.getItem('testpilot_gemini_key') || '';
export const setCustomApiKey = (key) => {
  if (key) localStorage.setItem('testpilot_gemini_key', key);
  else localStorage.removeItem('testpilot_gemini_key');
};

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const customKey = getCustomApiKey();
  if (customKey) headers['x-gemini-key'] = customKey;
  return headers;
};

export const api = {
  // Auth
  register: async (email, password, name) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  guestLogin: async () => {
    const res = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Guest login failed');
    return data;
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  },

  // Test Generation
  generateTests: async ({ sourceCode, language, framework, customInstructions, modelName }) => {
    const res = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        sourceCode,
        language,
        framework,
        customInstructions,
        apiKey: getCustomApiKey() || undefined,
        modelName
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Test generation failed');
    return data.data;
  },

  // Test Runner
  runTests: async ({ sourceCode, testCode, language }) => {
    const res = await fetch(`${API_BASE}/run-tests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sourceCode, testCode, language })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Test runner failed');
    return data;
  },

  // History
  getHistory: async ({ search = '', language = '', favorite = false } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (language) params.append('language', language);
    if (favorite) params.append('favorite', 'true');

    const res = await fetch(`${API_BASE}/history?${params.toString()}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch history');
    return data.items || [];
  },

  getHistoryItem: async (id) => {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch item');
    return data.item;
  },

  toggleFavorite: async (id) => {
    const res = await fetch(`${API_BASE}/history/${id}/favorite`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle favorite');
    return data;
  },

  deleteHistoryItem: async (id) => {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete history');
    return data;
  },

  // Analytics
  getAnalytics: async () => {
    const res = await fetch(`${API_BASE}/analytics`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load analytics');
    return data;
  }
};
