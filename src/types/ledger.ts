export type Phase = 
  | 'idle' 
  | 'uploading' 
  | 'analyzing' 
  | 'ready' 
  | 'pdf-exporting' 
  | 'error';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ReconciliationState = 'balanced' | 'review';

export type ExportButtonState = 'enabled' | 'disabled' | 'exporting';

export interface AssumptionItem {
  id: string;
  type: 'verified' | 'inferred' | 'warning' | 'missing';
  label: string;
  detail?: string;
  sourceClause?: string;
}

export interface ContractMetadata {
  id: string;
  title: string;
  dealType: string;
  artistName?: string;
  counterParty?: string;
  effectiveDate?: string;
  territory?: string;
  duration?: string;
  governingLaw?: string;
}

export interface PartyInfo {
  name: string;
  role: 'artist' | 'label' | 'producer' | 'publisher' | 'distributor';
  royaltyRate: number; // percentage (0-100)
  shareAmount?: number;
}

export interface LedgersRiskScore {
  score: number; // 0 - 100 (100 = safest, <50 = high risk)
  level: RiskLevel;
  totalRedFlags: number;
  totalFairTerms: number;
  topConcern: string;
}

export interface LedgersAnalysisModel {
  metadata: ContractMetadata;
  parties: PartyInfo[];
  risk: LedgersRiskScore;
  revenueTotals: {
    projectedGross: number;
    advanceAmount: number;
    distributionFeeRate: number;
    artistRoyaltyRate: number;
    labelShareRate: number;
    producerPoints: number;
  };
  warnings: string[];
  assumptions: AssumptionItem[];
  timestamps: {
    uploadedAt: string;
    analyzedAt: string;
  };
}

export interface LedgersWaterfallStep {
  id: string;
  name: string;
  description: string;
  amount: number;
  remainingBalance: number;
  type: 'gross' | 'fee' | 'recoupment' | 'split' | 'payout';
  recipient?: string;
}

export interface LedgersWaterfallModel {
  grossRevenue: number;
  distributionFeePct: number;
  netAfterDist: number;
  advanceAmount: number;
  recoupmentApplied: number;
  remainingAdvance: number;
  artistShare: number;
  labelShare: number;
  producerShare: number;
  publisherShare: number;
  reconciliationState: ReconciliationState;
  reconciliationDelta: number; // 0 if balanced
  steps: LedgersWaterfallStep[];
  assumptions: string[];
  warnings: string[];
}

export interface PdfResult {
  blob?: Blob;
  fileName: string;
  downloadUrl?: string;
  generatedAt: string;
}

export interface LedgerFlowState {
  phase: Phase;
  activeContract: ContractMetadata | null;
  file: File | null;
  analysis: LedgersAnalysisModel | null;
  waterfall: LedgersWaterfallModel | null;
  pdf: PdfResult | null;
  errors: string[];
}

// Component Props Interfaces
export interface ContractStatusProps {
  phase: Phase;
  fileName?: string;
  progressPct?: number;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

export interface RiskCardProps {
  title: string;
  explanation: string;
  severity: RiskLevel;
  clauseRef?: string;
  questionToAsk?: string;
  className?: string;
}

export interface RiskSummaryProps {
  score: number;
  level: RiskLevel;
  redFlagsCount: number;
  fairTermsCount: number;
  topConcern: string;
  className?: string;
}

export interface RevenueWaterfallProps {
  waterfall: LedgersWaterfallModel;
  onUpdateConfig?: (updatedConfig: Partial<LedgersWaterfallModel>) => void;
  className?: string;
}

export interface ReconciliationBadgeProps {
  state: ReconciliationState;
  deltaAmount?: number;
  className?: string;
}

export interface ExportButtonProps {
  state: ExportButtonState;
  onExport: () => void;
  label?: string;
  className?: string;
}

export interface AssumptionPanelProps {
  assumptions: AssumptionItem[];
  warnings?: string[];
  title?: string;
  className?: string;
}
