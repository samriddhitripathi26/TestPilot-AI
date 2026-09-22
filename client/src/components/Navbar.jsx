import React from 'react';
import { 
  Key, 
  History, 
  BarChart3, 
  LogOut, 
  LogIn, 
  Sun, 
  Moon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getCustomApiKey } from '../lib/api';

export const Navbar = ({ 
  onOpenApiKeyModal, 
  onOpenHistoryModal, 
  onOpenAnalyticsModal, 
  onOpenAuthModal,
  historyCount = 0
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const hasCustomKey = !!getCustomApiKey();

  return (
    <header className="w-full border-b border-dusk bg-dusk/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <a href="#top" className="flex items-center space-x-2 no-underline text-ink">
            <span className="font-semibold text-lg sm:text-xl tracking-tight text-ink">
              TestPilot
            </span>
            <span className="w-2 h-2 rounded-full bg-[#FFB73A] inline-block shadow-[0_0_8px_#FFB73A]" />
          </a>
          <span className="hidden sm:inline-block text-xs text-muted-dusk border-l border-dusk pl-3 font-normal">
            Automated unit test generation
          </span>
        </div>

        {/* Actions & Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
          
          {/* API Key configuration */}
          <button
            onClick={onOpenApiKeyModal}
            className="text-xs text-muted-dusk hover:text-ink transition flex items-center gap-1.5 py-1.5 px-2.5 rounded-full border border-transparent hover:border-dusk"
            title="Configure AI API Key"
          >
            <Key className="w-3.5 h-3.5 text-[#FFB73A]" />
            <span className="hidden md:inline">Key:</span>
            <span>{hasCustomKey ? 'Custom' : 'Demo / Built-in'}</span>
          </button>

          {/* History Link */}
          <button
            onClick={onOpenHistoryModal}
            className="text-xs text-muted-dusk hover:text-ink transition flex items-center gap-1.5 py-1.5 px-2.5 rounded-full border border-transparent hover:border-dusk"
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-dusk bg-dusk text-ink">
                {historyCount}
              </span>
            )}
          </button>

          {/* Analytics Link */}
          <button
            onClick={onOpenAnalyticsModal}
            className="text-xs text-muted-dusk hover:text-ink transition flex items-center gap-1.5 py-1.5 px-2.5 rounded-full border border-transparent hover:border-dusk hidden sm:flex"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted-dusk hover:text-ink border border-dusk bg-dusk hover:bg-dusk/50 transition"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-[#FFB73A]" /> : <Moon className="w-3.5 h-3.5 text-ink" />}
          </button>

          {/* Auth button */}
          {user && !user.isGuest ? (
            <div className="flex items-center gap-2 pl-1 border-l border-dusk">
              <span className="text-xs text-muted-dusk hidden md:inline truncate max-w-[110px]">
                {user.name || user.email}
              </span>
              <button
                onClick={logout}
                className="p-1.5 rounded-full text-muted-dusk hover:text-ink hover:bg-dusk/70 transition"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="pill-btn text-xs text-ink ml-1 hover:border-ink"
            >
              <LogIn className="w-3.5 h-3.5 text-[#FFB73A]" />
              <span>Sign In</span>
            </button>
          )}

        </nav>
      </div>
    </header>
  );
};
