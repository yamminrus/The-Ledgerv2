import React from 'react';
import { RiskSummaryProps } from '../types/ledger';
import { riskToneByLevel, riskLabelByLevel } from './variants';
import { ShieldAlert, ShieldCheck, AlertTriangle, Scale } from 'lucide-react';

export const RiskSummary: React.FC<RiskSummaryProps> = ({
  score,
  level,
  redFlagsCount,
  fairTermsCount,
  topConcern,
  className = ''
}) => {
  const tone = riskToneByLevel[level];
  const label = riskLabelByLevel[level];

  // Calculate score color bar width
  const scorePct = Math.min(100, Math.max(0, score));

  return (
    <div
      className={`rounded-xl border ${tone.border} ${tone.bg} p-5 transition-all shadow-md ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Score gauge & label */}
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <span
              className={`text-2xl font-black font-mono ${
                score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {score}
            </span>
            <span className="absolute bottom-1 text-[9px] text-slate-500 uppercase font-mono tracking-widest">
              /100
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-base font-bold font-mono ${tone.text}`}>
                Fairness Index: {label}
              </span>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${tone.badgeBg} ${tone.badgeText} border ${tone.border}`}
              >
                {level}
              </span>
            </div>

            {/* Score visual bar */}
            <div className="w-48 bg-slate-950 rounded-full h-2 mt-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-500 ${
                  score >= 75
                    ? 'bg-emerald-500'
                    : score >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${scorePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-slate-800/80 pt-3 md:pt-0 md:pl-5">
          <div className="flex items-center space-x-2 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <div>
              <span className="text-xs text-slate-400 block font-mono">Red Flags</span>
              <span className="text-sm font-bold text-rose-300 font-mono">{redFlagsCount}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs text-slate-400 block font-mono">Fair Terms</span>
              <span className="text-sm font-bold text-emerald-300 font-mono">{fairTermsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {topConcern && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center space-x-2 text-xs text-slate-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="font-semibold text-amber-300 font-mono">Primary Concern:</span>
          <span className="text-slate-300 truncate">{topConcern}</span>
        </div>
      )}
    </div>
  );
};
