import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  X, 
  CheckCircle2, 
  Bug, 
  Clock, 
  Layers
} from 'lucide-react';
import { api } from '../lib/api';

export const AnalyticsModal = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getAnalytics()
        .then(data => setStats(data))
        .catch(err => console.error('Error fetching analytics:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-dusk-card border border-dusk rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-dusk flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-dusk bg-dusk flex items-center justify-center text-ink">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Productivity & Quality Metrics</h3>
              <p className="text-[11px] text-muted-dusk">Unit test generation impact</p>
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
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-dusk">Loading metrics...</div>
          ) : stats ? (
            <>
              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-dusk border border-dusk space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-dusk text-xs font-medium">
                    <Layers className="w-3.5 h-3.5 text-ink" />
                    <span>Suites Generated</span>
                  </div>
                  <div className="text-2xl font-bold text-ink">{stats.totalGenerations || 0}</div>
                  <p className="text-[10px] text-muted-dusk">Targeted test files</p>
                </div>

                <div className="p-4 rounded-xl bg-dusk border border-dusk space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-dusk text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Test Cases</span>
                  </div>
                  <div className="text-2xl font-bold text-ink">{stats.totalTestCases || 0}</div>
                  <p className="text-[10px] text-muted-dusk">Distinct assertions</p>
                </div>

                <div className="p-4 rounded-xl bg-dusk border border-dusk space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-dusk text-xs font-medium">
                    <Bug className="w-3.5 h-3.5 text-amber-500" />
                    <span>Bugs Caught</span>
                  </div>
                  <div className="text-2xl font-bold text-ink">{stats.totalBugsCaught || 0}</div>
                  <p className="text-[10px] text-muted-dusk">Potential failure modes</p>
                </div>

                <div className="p-4 rounded-xl bg-dusk border border-dusk space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-dusk text-xs font-medium">
                    <Clock className="w-3.5 h-3.5 text-ink" />
                    <span>Time Saved</span>
                  </div>
                  <div className="text-2xl font-bold text-ink">~{stats.estimatedHoursSaved || 0}h</div>
                  <p className="text-[10px] text-muted-dusk">Estimated developer hours</p>
                </div>
              </div>

              {/* Language Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-ink block">
                  Language Distribution
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.languages || {}).length === 0 ? (
                    <span className="text-xs text-muted-dusk">No data yet.</span>
                  ) : (
                    Object.entries(stats.languages).map(([lang, count]) => (
                      <div key={lang} className="px-3 py-1.5 rounded-full bg-dusk border border-dusk text-xs flex items-center gap-2">
                        <span className="capitalize text-ink">{lang}</span>
                        <span className="text-muted-dusk font-mono text-[11px]">
                          {count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Framework Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-ink block">
                  Framework Distribution
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.frameworks || {}).length === 0 ? (
                    <span className="text-xs text-muted-dusk">No data yet.</span>
                  ) : (
                    Object.entries(stats.frameworks).map(([fw, count]) => (
                      <div key={fw} className="px-3 py-1.5 rounded-full bg-dusk border border-dusk text-xs flex items-center gap-2">
                        <span className="uppercase text-ink">{fw}</span>
                        <span className="text-muted-dusk font-mono text-[11px]">
                          {count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-xs text-muted-dusk">Failed to load statistics.</div>
          )}
        </div>
      </div>
    </div>
  );
};
