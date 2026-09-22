import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const token = getAuthToken();
      if (token) {
        const res = await api.getProfile();
        if (res && res.user) {
          setUser(res.user);
          setLoading(false);
          return;
        }
      }
      // Auto create guest session for seamless first-time developer experience
      const guestRes = await api.guestLogin();
      setAuthToken(guestRes.token);
      setUser(guestRes.user);
    } catch (err) {
      console.warn('[AuthContext] Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setAuthToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (email, password, name) => {
    const res = await api.register(email, password, name);
    setAuthToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const guestLogin = async () => {
    const res = await api.guestLogin();
    setAuthToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    // Switch to new guest
    guestLogin();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
