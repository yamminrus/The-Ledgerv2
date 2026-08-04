import React from 'react';
import { ExportButtonProps } from '../types/ledger';
import { exportButtonTone } from './variants';
import { FileDown, Sparkles, AlertCircle } from 'lucide-react';

export const ExportButton: React.FC<ExportButtonProps> = ({
  state,
  onExport,
  label = 'Export PDF Audit Artifact',
  className = ''
}) => {
  const tone = exportButtonTone[state];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state === 'enabled') {
      onExport();
    }
  };

  return (
    <button
      id="btn-export-pdf-artifact"
      onClick={handleClick}
      disabled={state === 'disabled' || state === 'exporting'}
      className={`relative group flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border ${tone.border} ${tone.bg} ${tone.text} transition-all duration-200 cursor-pointer ${tone.glow || ''} ${className}`}
    >
      {state === 'exporting' ? (
        <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
      ) : (
        <FileDown className={`w-4 h-4 ${tone.iconColor} group-hover:scale-110 transition-transform`} />
      )}
      <span className="text-xs font-bold font-mono tracking-wide">
        {state === 'exporting' ? 'Generating PDF Artifact...' : label}
      </span>
      {state === 'enabled' && (
        <span className="ml-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-950/20 text-slate-900 border border-slate-950/20 font-mono">
          Audit Ready
        </span>
      )}
    </button>
  );
};
