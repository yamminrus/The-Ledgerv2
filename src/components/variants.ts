import { Phase, RiskLevel, ReconciliationState, ExportButtonState } from '../types/ledger';

export interface ToneVariant {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  iconColor: string;
  glow?: string;
}

// 1. Contract Status Mappings
export const contractStatusCopy: Record<Phase, string> = {
  idle: 'Ready for Contract Upload',
  uploading: 'Uploading Document...',
  analyzing: 'Extracting Rights & Financial Terms...',
  ready: 'Analysis Complete & Verified',
  'pdf-exporting': 'Generating Audit PDF Report...',
  error: 'Analysis Failed'
};

export const contractStatusTone: Record<Phase, ToneVariant> = {
  idle: {
    bg: 'bg-slate-900/80',
    text: 'text-slate-300',
    border: 'border-slate-800',
    badgeBg: 'bg-slate-800',
    badgeText: 'text-slate-400',
    iconColor: 'text-slate-400'
  },
  uploading: {
    bg: 'bg-amber-950/30',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    iconColor: 'text-amber-400',
    glow: 'shadow-amber-500/10'
  },
  analyzing: {
    bg: 'bg-amber-950/40',
    text: 'text-amber-200',
    border: 'border-amber-500/50',
    badgeBg: 'bg-amber-500/30',
    badgeText: 'text-amber-200',
    iconColor: 'text-amber-400',
    glow: 'shadow-amber-500/20'
  },
  ready: {
    bg: 'bg-emerald-950/30',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    iconColor: 'text-emerald-400',
    glow: 'shadow-emerald-500/10'
  },
  'pdf-exporting': {
    bg: 'bg-amber-950/30',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    iconColor: 'text-amber-400'
  },
  error: {
    bg: 'bg-rose-950/40',
    text: 'text-rose-300',
    border: 'border-rose-500/50',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    iconColor: 'text-rose-400',
    glow: 'shadow-rose-500/10'
  }
};

export const contractStatusBorder: Record<Phase, string> = {
  idle: 'border-slate-800',
  uploading: 'border-amber-500/40 animate-pulse',
  analyzing: 'border-amber-400/60 animate-pulse',
  ready: 'border-emerald-500/40',
  'pdf-exporting': 'border-amber-500/40 animate-pulse',
  error: 'border-rose-500/50'
};

// 2. Risk State Mappings
export const riskToneByLevel: Record<RiskLevel, ToneVariant> = {
  low: {
    bg: 'bg-emerald-950/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    iconColor: 'text-emerald-400'
  },
  medium: {
    bg: 'bg-amber-950/20',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    iconColor: 'text-amber-400'
  },
  high: {
    bg: 'bg-orange-950/30',
    text: 'text-orange-300',
    border: 'border-orange-500/40',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-400',
    iconColor: 'text-orange-400'
  },
  critical: {
    bg: 'bg-rose-950/40',
    text: 'text-rose-300',
    border: 'border-rose-500/50',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-400',
    iconColor: 'text-rose-400',
    glow: 'shadow-rose-500/20'
  }
};

export const riskLabelByLevel: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Moderate Risk',
  high: 'High Risk',
  critical: 'Critical Exposure'
};

export const riskEmojiByLevel: Record<RiskLevel, string> = {
  low: '🛡️',
  medium: '⚠️',
  high: '🚨',
  critical: '⛔'
};

// 3. Reconciliation State Mappings
export const reconciliationTone: Record<ReconciliationState, ToneVariant> = {
  balanced: {
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    iconColor: 'text-emerald-400',
    glow: 'shadow-emerald-500/10'
  },
  review: {
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    iconColor: 'text-amber-400',
    glow: 'shadow-amber-500/10'
  }
};

export const reconciliationLabel: Record<ReconciliationState, string> = {
  balanced: 'Reconciled & Balanced (100% Accounted)',
  review: 'Unreconciled Variance — Requires Review'
};

// 4. Export Button Mappings
export const exportButtonTone: Record<ExportButtonState, ToneVariant> = {
  enabled: {
    bg: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950',
    text: 'text-slate-950 font-bold',
    border: 'border-amber-400/50',
    badgeBg: 'bg-slate-950/20',
    badgeText: 'text-slate-900',
    iconColor: 'text-slate-950',
    glow: 'shadow-lg shadow-amber-500/20'
  },
  disabled: {
    bg: 'bg-slate-800 text-slate-500 cursor-not-allowed',
    text: 'text-slate-500 font-medium',
    border: 'border-slate-700/50',
    badgeBg: 'bg-slate-900',
    badgeText: 'text-slate-600',
    iconColor: 'text-slate-600'
  },
  exporting: {
    bg: 'bg-amber-500/80 text-slate-950 cursor-wait animate-pulse',
    text: 'text-slate-950 font-bold',
    border: 'border-amber-300',
    badgeBg: 'bg-slate-950/30',
    badgeText: 'text-slate-950',
    iconColor: 'text-slate-950'
  }
};
