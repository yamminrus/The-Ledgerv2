import React from 'react';
import { AssumptionPanelProps, AssumptionItem } from '../types/ledger';
import { CheckCircle2, AlertTriangle, Info, HelpCircle, ShieldCheck } from 'lucide-react';

export const AssumptionPanel: React.FC<AssumptionPanelProps> = ({
  assumptions,
  warnings = [],
  title = 'AI System Assumptions & Inferred Contract Logic',
  className = ''
}) => {
  const getIcon = (type: AssumptionItem['type']) => {
    switch (type) {
      case 'verified':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
      case 'inferred':
        return <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />;
      case 'missing':
        return <HelpCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />;
    }
  };

  const getTypeBadge = (type: AssumptionItem['type']) => {
    switch (type) {
      case 'verified':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'inferred':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'warning':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'missing':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100">{title}</h3>
            <p className="text-xs text-slate-400">
              Full transparency on how clauses were interpreted, normalized, and modeled.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-950 text-slate-400 border border-slate-800">
          Trust Layer Engine
        </span>
      </div>

      {/* Assumptions List */}
      <div className="space-y-2.5">
        {assumptions.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            {getIcon(item.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-200 font-mono">
                  {item.label}
                </span>
                <span
                  className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded border ${getTypeBadge(
                    item.type
                  )}`}
                >
                  {item.type}
                </span>
                {item.sourceClause && (
                  <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                    Clause: {item.sourceClause}
                  </span>
                )}
              </div>
              {item.detail && (
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Warnings List */}
      {warnings.length > 0 && (
        <div className="pt-2 border-t border-slate-800/60">
          <h4 className="text-xs font-bold font-mono text-amber-300 mb-2 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Operational Warnings & Omissions</span>
          </h4>
          <ul className="space-y-1.5 pl-2">
            {warnings.map((warning, index) => (
              <li
                key={index}
                className="text-xs text-amber-200/90 flex items-start space-x-2 font-mono bg-amber-950/20 p-2 rounded border border-amber-500/20"
              >
                <span className="text-amber-400 font-bold">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
