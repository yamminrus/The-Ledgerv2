import React, { useState } from 'react';
import { RiskCardProps } from '../types/ledger';
import { riskToneByLevel, riskLabelByLevel, riskEmojiByLevel } from './variants';
import { ShieldAlert, HelpCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export const RiskCard: React.FC<RiskCardProps> = ({
  title,
  explanation,
  severity,
  clauseRef,
  questionToAsk,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const tone = riskToneByLevel[severity];
  const label = riskLabelByLevel[severity];
  const emoji = riskEmojiByLevel[severity];

  const handleCopyQuestion = () => {
    if (!questionToAsk) return;
    navigator.clipboard.writeText(questionToAsk);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-xl border ${tone.border} ${tone.bg} p-4 transition-all shadow-sm hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-xl" role="img" aria-label={label}>
            {emoji}
          </span>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h4 className="text-sm font-bold text-slate-100 font-mono">{title}</h4>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tone.badgeBg} ${tone.badgeText} border ${tone.border}`}
              >
                {label}
              </span>
              {clauseRef && (
                <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 font-mono">
                  Ref: {clauseRef}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{explanation}</p>
          </div>
        </div>

        {questionToAsk && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800/60 transition-colors ml-2"
            title="Toggle Question to Ask Attorney"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {questionToAsk && isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 bg-slate-950/60 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-amber-400 flex items-center space-x-1.5 font-mono">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Recommended Question for your Attorney / Manager:</span>
            </span>
            <button
              onClick={handleCopyQuestion}
              className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-amber-300 transition-colors bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-200 italic font-mono bg-slate-900/90 p-2 rounded border border-slate-800/80">
            "{questionToAsk}"
          </p>
        </div>
      )}
    </div>
  );
};
