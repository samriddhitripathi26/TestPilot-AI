import React, { useState, useEffect } from 'react';
import { 
  History, 
  X, 
  Search, 
  Star, 
  Trash2, 
  ArrowUpRight, 
  FileCode
} from 'lucide-react';
import { api } from '../lib/api';

export const HistoryModal = ({
  isOpen,
  onClose,
  onLoadGeneration
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory({
        search,
        language: langFilter !== 'all' ? langFilter : '',
        favorite: favoritesOnly
      });
      setItems(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, search, langFilter, favoritesOnly]);

  if (!isOpen) return null;

  const handleToggleFavorite = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await api.toggleFavorite(id);
      setItems(prev => prev.map(item => item.id === id || item._id === id ? { ...item, isFavorite: res.isFavorite } : item));
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this test suite from your history?')) return;
    try {
      await api.deleteHistoryItem(id);
      setItems(prev => prev.filter(item => (item.id !== id && item._id !== id)));
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleSelect = async (id) => {
    try {
      const full = await api.getHistoryItem(id);
      if (full) {
        onLoadGeneration(full);
        onClose();
      }
    } catch (err) {
      console.error('Failed to load item detail:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-dusk-card border border-dusk rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-dusk flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-dusk bg-dusk flex items-center justify-center text-ink">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Test History</h3>
              <p className="text-[11px] text-muted-dusk">Saved test suites and specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-dusk hover:text-ink hover:bg-dusk transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-dusk border-b border-dusk space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-dusk absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by function name or keywords..."
              className="w-full bg-dusk-card border border-dusk rounded-full pl-9 pr-4 py-2 text-xs text-ink placeholder:text-muted-dusk focus:outline-none focus:border-ink font-sans"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`pill-btn text-xs py-1 ${
                favoritesOnly ? 'border-ink text-ink font-semibold' : 'text-muted-dusk'
              }`}
            >
              <Star className={`w-3 h-3 ${favoritesOnly ? 'fill-current text-[#FFB73A]' : ''}`} />
              <span>Starred</span>
            </button>

            {['all', 'typescript', 'javascript', 'python', 'java'].map(lang => (
              <button
                key={lang}
                onClick={() => setLangFilter(lang)}
                className={`pill-btn text-xs py-1 capitalize ${
                  langFilter === lang ? 'bg-dusk-btn-bg text-dusk-btn-fg border-transparent' : 'text-muted-dusk'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-dusk">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-dusk">Loading history...</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FileCode className="w-8 h-8 text-muted-dusk mx-auto opacity-50" />
              <p className="text-xs text-ink font-medium">No test suites saved yet.</p>
              <p className="text-[11px] text-muted-dusk">Generated test suites will appear here automatically.</p>
            </div>
          ) : (
            items.map((item) => {
              const itemId = item.id || item._id;
              const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '';

              return (
                <div
                  key={itemId}
                  onClick={() => handleSelect(itemId)}
                  className="p-3.5 rounded-xl bg-dusk-card border border-dusk hover:border-ink transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink">
                        {item.functionName}
                      </span>
                      <span className="text-[10px] text-muted-dusk border border-dusk bg-dusk px-2 py-0.5 rounded-full font-mono uppercase">
                        {item.language} · {item.framework}
                      </span>
                      {item.isFavorite && (
                        <Star className="w-3 h-3 text-[#FFB73A] fill-current" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-dusk">
                      <span>{item.testCases ? `${item.testCases.length} test cases` : 'Complete Suite'}</span>
                      <span>·</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleToggleFavorite(itemId, e)}
                      className="p-1.5 rounded-md text-muted-dusk hover:text-[#FFB73A] transition"
                      title={item.isFavorite ? 'Unfavorite' : 'Favorite'}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'text-[#FFB73A] fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(itemId, e)}
                      className="p-1.5 rounded-md text-muted-dusk hover:text-rose-500 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-1.5 text-muted-dusk group-hover:text-ink transition">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
