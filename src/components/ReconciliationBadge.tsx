import React from 'react';
import { ReconciliationBadgeProps } from '../types/ledger';
import { reconciliationTone, reconciliationLabel } from './variants';
import { CheckCircle2, AlertCircle, Scale } from 'lucide-react';
import { formatCurrency } from '../lib/formatCurrency';

export const ReconciliationBadge: React.FC<ReconciliationBadgeProps> = ({
  state,
  deltaAmount = 0,
  className = ''
}) => {
  const tone = reconciliationTone[state];
  const label = reconciliationLabel[state];

  return (
    <div
      className={`inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border ${tone.border} ${tone.bg} shadow-sm ${tone.glow || ''} ${className}`}
    >
      {state === 'balanced' ? (
        <CheckCircle2 className={`w-4 h-4 ${tone.iconColor}`} />
      ) : (
        <AlertCircle className={`w-4 h-4 ${tone.iconColor}`} />
      )}
      <span className={`text-xs font-bold font-mono ${tone.text}`}>
        {label}
      </span>
      {state === 'review' && deltaAmount !== 0 && (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 border border-amber-500/30">
          Delta: {formatCurrency(deltaAmount)}
        </span>
      )}
    </div>
  );
};
