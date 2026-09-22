import React, { useState } from 'react';
import { LogIn, UserPlus, X, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, guestLogin } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setError('');
    setLoading(true);
    try {
      await guestLogin();
      onClose();
    } catch (err) {
      setError(err.message || 'Guest login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-dusk-card border border-dusk rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-dusk flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-dusk bg-dusk flex items-center justify-center text-ink">
              {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <h3 className="text-sm font-semibold text-ink">
              {isLogin ? 'Sign in to TestPilot' : 'Create an Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-dusk hover:text-ink hover:bg-dusk transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 p-1 rounded-full bg-dusk border border-dusk">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`py-1.5 text-xs font-semibold rounded-full transition ${
                isLogin ? 'bg-dusk-card text-ink shadow-sm' : 'text-muted-dusk hover:text-ink'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`py-1.5 text-xs font-semibold rounded-full transition ${
                !isLogin ? 'bg-dusk-card text-ink shadow-sm' : 'text-muted-dusk hover:text-ink'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs text-ink font-medium">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Developer name"
                className="w-full bg-dusk border border-dusk rounded-xl px-3.5 py-2 text-xs text-ink placeholder:text-muted-dusk focus:outline-none focus:border-ink font-sans"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-ink font-medium">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-dusk border border-dusk rounded-xl px-3.5 py-2 text-xs text-ink placeholder:text-muted-dusk focus:outline-none focus:border-ink font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-ink font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full bg-dusk border border-dusk rounded-xl px-3.5 py-2 text-xs text-ink placeholder:text-muted-dusk focus:outline-none focus:border-ink font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 btn-dusk py-2.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>

          <div className="relative py-2 flex items-center justify-center">
            <div className="border-t border-dusk w-full" />
            <span className="bg-dusk-card px-2 text-[10px] text-muted-dusk absolute uppercase">Or</span>
          </div>

          <button
            type="button"
            onClick={handleGuest}
            disabled={loading}
            className="w-full py-2 rounded-full bg-dusk hover:bg-dusk/70 text-ink text-xs font-medium border border-dusk transition"
          >
            Continue as Guest
          </button>
        </form>
      </div>
    </div>
  );
};
