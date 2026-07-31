import React, { useState } from "react";
import { SAMPLE_CONTRACTS } from "../data/sampleContracts";
import { ContractAnalysis, SampleContract, TabType } from "../types";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  FileText,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Scale
} from "lucide-react";

interface ContractAnalyzerProps {
  onNavigateToWaterfall: (estimates?: { artistRoyaltyRate: number; advanceAmount: number; labelShareRate: number }) => void;
  onNavigateToRightsGraph: (dealType: string) => void;
}

export const ContractAnalyzer: React.FC<ContractAnalyzerProps> = ({
  onNavigateToWaterfall,
  onNavigateToRightsGraph
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleContract>(SAMPLE_CONTRACTS[0]);
  const [inputText, setInputText] = useState<string>(SAMPLE_CONTRACTS[0].fullText);
  const [isCustomText, setIsCustomText] = useState<boolean>(false);
  
  const [analysis, setAnalysis] = useState<ContractAnalysis>(SAMPLE_CONTRACTS[0].analysis);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"red-flags" | "translation" | "key-terms" | "attorney-questions">("red-flags");
  const [copiedQuestions, setCopiedQuestions] = useState<boolean>(false);

  const handleSelectSample = (sample: SampleContract) => {
    setSelectedSample(sample);
    setInputText(sample.fullText);
    setAnalysis(sample.analysis);
    setIsCustomText(false);
  };

  const handleAnalyzeWithAI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractText: inputText,
          dealType: selectedSample.category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze contract text.");
      }

      const result: ContractAnalysis = await response.json();
      setAnalysis(result);
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyQuestions = () => {
    if (analysis.questionsForAttorney) {
      navigator.clipboard.writeText(analysis.questionsForAttorney.join("\n\n"));
      setCopiedQuestions(true);
      setTimeout(() => setCopiedQuestions(false), 2000);
    }
  };

  // Determine risk level badge styling
  const getRiskBadge = (score: number) => {
    if (score < 35) return { label: "ARTIST FRIENDLY", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
    if (score < 65) return { label: "MODERATE RISK", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
    if (score < 85) return { label: "HIGH ARTIST RISK", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" };
    return { label: "PREDATORY AGREEMENT", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
  };

  const riskBadge = getRiskBadge(analysis.riskScore);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 sm:p-8 rounded-2xl border border-amber-500/20 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Contract Education Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
            Translate Legalese Into Plain English.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Select a sample music agreement or paste your own deal text below. THE LEDGER's Gemini AI dissects clauses, calculates risk scores, extracts red flags, and generates critical questions for your attorney.
          </p>
        </div>
      </div>

      {/* Preset Contract Selector & Input Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Select or Paste Agreement</span>
              </h2>
              {isCustomText && (
                <button
                  onClick={() => handleSelectSample(selectedSample)}
                  className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Sample</span>
                </button>
              )}
            </div>

            {/* Sample Selector Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Preset Sample Contracts:</label>
              <div className="grid grid-cols-1 gap-2">
                {SAMPLE_CONTRACTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-3 rounded-xl text-left transition-all border text-xs flex items-center justify-between ${
                      selectedSample.id === sample.id && !isCustomText
                        ? "bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-sm"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-200">{sample.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{sample.category}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      Risk {sample.defaultRiskScore}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contract Text Input */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Agreement Text / Clauses:</span>
                <span className="text-[10px] text-slate-500">{inputText.length} chars</span>
              </label>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setIsCustomText(true);
                }}
                rows={10}
                placeholder="Paste contract clauses here..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all resize-y"
              />
            </div>

            {/* Run AI Analysis Action Button */}
            <button
              onClick={handleAnalyzeWithAI}
              disabled={isLoading || !inputText.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Gemini AI Dissecting Clauses...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Clause Dissector</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis Results & Dissector Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Analysis Header Card with Risk Gauge */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  {analysis.dealType}
                </span>
                <h2 className="text-xl font-bold text-slate-100 font-mono mt-1">
                  {analysis.title}
                </h2>
              </div>

              {/* Risk Meter Gauge */}
              <div className="flex items-center space-x-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-center">
                  <div className="text-2xl font-black font-mono text-slate-100">
                    {analysis.riskScore}<span className="text-xs text-slate-500">/100</span>
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Artist Risk</div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${riskBadge.color}`}>
                  {riskBadge.label}
                </span>
              </div>
            </div>

            {/* High Level Executive Summary */}
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Executive Summary</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Navigation Tabs for Dissected Analysis */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveView("red-flags")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  activeView === "red-flags"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Red Flags ({analysis.redFlags?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveView("translation")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  activeView === "translation"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Plain English</span>
              </button>

              <button
                onClick={() => setActiveView("key-terms")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  activeView === "key-terms"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Key Terms</span>
              </button>

              <button
                onClick={() => setActiveView("attorney-questions")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  activeView === "attorney-questions"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Attorney Checklist</span>
              </button>
            </div>

            {/* TAB CONTENT 1: RED FLAGS */}
            {activeView === "red-flags" && (
              <div className="space-y-4">
                {analysis.redFlags && analysis.redFlags.length > 0 ? (
                  analysis.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-300 font-mono flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span>{flag.clause}</span>
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 uppercase border border-rose-500/40 font-mono">
                          {flag.riskLevel} RISK
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-6">
                        {flag.explanation}
                      </p>
                      <div className="mt-2 pl-6 pt-2 border-t border-slate-800 text-xs text-amber-300/90 font-medium flex items-start space-x-2">
                        <span className="font-bold text-amber-400 font-mono uppercase text-[10px] px-1.5 py-0.5 bg-amber-500/10 rounded border border-amber-500/20 mt-0.5">
                          Ask Attorney:
                        </span>
                        <span>"{flag.questionToAsk}"</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    No critical red flags detected in this agreement preview!
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: PLAIN ENGLISH TRANSLATION */}
            {activeView === "translation" && (
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans space-y-4">
                <div className="font-bold text-amber-400 font-mono text-xs uppercase tracking-wider">
                  Plain-English Legal Translation:
                </div>
                <p className="whitespace-pre-line text-slate-300">
                  {analysis.plainEnglishTranslation}
                </p>
              </div>
            )}

            {/* TAB CONTENT 3: KEY TERMS */}
            {activeView === "key-terms" && (
              <div className="grid grid-cols-1 gap-3">
                {analysis.keyTerms?.map((term, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-200">{term.term}</div>
                      <div className="text-[11px] text-amber-300 font-mono">{term.value}</div>
                    </div>
                    <div className="text-xs text-slate-400 max-w-xs text-right">
                      {term.impact}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT 4: ATTORNEY QUESTIONS CHECKLIST */}
            {activeView === "attorney-questions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    5 Questions To Ask An Entertainment Attorney:
                  </span>
                  <button
                    onClick={handleCopyQuestions}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center space-x-1.5 transition-all"
                  >
                    {copiedQuestions ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy Checklist</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  {analysis.questionsForAttorney?.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start space-x-3">
                      <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Navigation / Launch Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => onNavigateToRightsGraph(analysis.dealType)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
              >
                <span>View Rights Graph Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() =>
                  onNavigateToWaterfall(analysis.waterfallEstimates)
                }
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-amber-500/30"
              >
                <span>Simulate Revenue Waterfall</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
