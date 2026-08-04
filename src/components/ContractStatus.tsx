import React from 'react';
import { ContractStatusProps } from '../types/ledger';
import { contractStatusCopy, contractStatusTone, contractStatusBorder } from './variants';
import { Sparkles, FileText, AlertTriangle, RefreshCw, CheckCircle2, FileDown } from 'lucide-react';

export const ContractStatus: React.FC<ContractStatusProps> = ({
  phase,
  fileName,
  progressPct,
  errorMessage,
  onRetry,
  className = ''
}) => {
  const tone = contractStatusTone[phase];
  const copy = contractStatusCopy[phase];
  const borderClass = contractStatusBorder[phase];

  const renderIcon = () => {
    switch (phase) {
      case 'idle':
        return <FileText className={`w-5 h-5 ${tone.iconColor}`} />;
      case 'uploading':
      case 'analyzing':
        return <Sparkles className={`w-5 h-5 ${tone.iconColor} animate-spin`} />;
      case 'ready':
        return <CheckCircle2 className={`w-5 h-5 ${tone.iconColor}`} />;
      case 'pdf-exporting':
        return <FileDown className={`w-5 h-5 ${tone.iconColor} animate-bounce`} />;
      case 'error':
        return <AlertTriangle className={`w-5 h-5 ${tone.iconColor}`} />;
    }
  };

  return (
    <div
      id="ledger-contract-status"
      className={`rounded-xl border ${borderClass} ${tone.bg} p-4 transition-all shadow-md ${tone.glow || ''} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${tone.badgeBg} border ${tone.border}`}>
            {renderIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold font-mono ${tone.text}`}>
                {copy}
              </span>
              {fileName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-950/60 text-slate-300 border border-slate-700 font-mono">
                  {fileName}
                </span>
              )}
            </div>
            {errorMessage ? (
              <p className="text-xs text-rose-400 mt-0.5">{errorMessage}</p>
            ) : (
              <p className="text-xs text-slate-400 mt-0.5">
                {phase === 'ready'
                  ? 'Clause analysis, risk assessment, and financial terms extracted.'
                  : phase === 'analyzing'
                  ? 'Running deep neural clause extraction & terms reconciliation...'
                  : phase === 'idle'
                  ? 'Select or upload an agreement to begin verification.'
                  : 'Processing document...'}
              </p>
            )}
          </div>
        </div>

        {/* Action / Progress indicator */}
        <div className="flex items-center space-x-3">
          {typeof progressPct === 'number' && (phase === 'uploading' || phase === 'analyzing') && (
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
                />
              </div>
              <span className="text-xs font-mono text-amber-300">{progressPct}%</span>
            </div>
          )}

          {phase === 'error' && onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-medium transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
