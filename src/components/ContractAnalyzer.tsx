import React, { useState, useRef } from "react";
import { SAMPLE_CONTRACTS } from "../data/sampleContracts";
import { ContractAnalysis, SampleContract, RecentDocument, KeyClause } from "../types";
import { generateContractPDF } from "../utils/pdfGenerator";
import { reduce, progress as phaseProgress, mayShowAnalysis, type Phase } from "../lib/extraction/machine";
import { explain } from "../lib/extraction/types";
import { extractPdfText } from "../lib/extraction/extractPdfText";
import {
  Sparkles,
  FileText,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Scale,
  Upload,
  Clock,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  X,
  FileCode,
  Building,
  Briefcase,
  Home as HomeIcon,
  Shield,
  FileSpreadsheet,
  Award,
  Zap,
  Info
} from "lucide-react";

interface ContractAnalyzerProps {
  onNavigateToWaterfall: (estimates?: { artistRoyaltyRate: number; advanceAmount: number; labelShareRate: number }) => void;
  onNavigateToRightsGraph: (dealType: string) => void;
}

const DEFAULT_RECENT_DOCS: RecentDocument[] = [
  {
    id: "employment-agreement",
    name: "Employment_Agreement_Executive.pdf",
    status: "Complete",
    lastOpened: "Today",
    fileSize: "1.4 MB",
    sampleContractId: "employment-agreement"
  },
  {
    id: "residential-lease",
    name: "Residential_Lease_742_Evergreen.pdf",
    status: "Complete",
    lastOpened: "5 min ago",
    fileSize: "2.1 MB",
    sampleContractId: "residential-lease"
  },
  {
    id: "non-disclosure-agreement",
    name: "Mutual_NDA_Nexus_Innovations.pdf",
    status: "Complete",
    lastOpened: "Yesterday",
    fileSize: "890 KB",
    sampleContractId: "non-disclosure-agreement"
  },
  {
    id: "recording-360-deal",
    name: "Apex_Sound_360_Recording.pdf",
    status: "Complete",
    lastOpened: "2 days ago",
    fileSize: "3.2 MB",
    sampleContractId: "recording-360-deal"
  }
];

export const ContractAnalyzer: React.FC<ContractAnalyzerProps> = ({
  onNavigateToWaterfall,
  onNavigateToRightsGraph
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleContract>(SAMPLE_CONTRACTS[0]);
  const [inputText, setInputText] = useState<string>(SAMPLE_CONTRACTS[0].fullText);
  const [isCustomText, setIsCustomText] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis>(SAMPLE_CONTRACTS[0].analysis);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Upload State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  // Ingestion is driven by the state machine in lib/extraction, not by a timer.
  // `uploadProgress` used to be set by a setInterval that measured nothing.
  const [ingest, setIngest] = useState<Phase>({ phase: "idle" });
  const uploadProgress = phaseProgress(ingest);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadZoneRef = useRef<HTMLDivElement>(null);
  const sampleSectionRef = useRef<HTMLDivElement>(null);

  // Recent Documents State
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>(DEFAULT_RECENT_DOCS);

  // Accordion Expand States
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({
    "Payment Terms": true,
    "Termination": true,
    "Confidentiality": false,
    "Intellectual Property": false,
    "Liability": false,
    "Governing Law": false
  });

  // Action / Feedback states
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [copiedChecklist, setCopiedChecklist] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  // Category filter for sample contracts
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Employment", "Real Estate", "General Business", "Procurement", "Professional Services", "Recording Contracts", "Publishing Agreements", "Producer Agreements", "Management Deals", "Distribution Agreements"];

  const handleSelectSample = (sample: SampleContract) => {
    setSelectedSample(sample);
    setInputText(sample.fullText);
    setAnalysis(sample.analysis);
    setIsCustomText(false);
    setUploadedFileName(null);
    setIngest({ phase: "idle" });
  };

  const toggleClauseExpand = (title: string) => {
    setExpandedClauses((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleRunAIAnalysis = async (textToAnalyze: string, dealCategory?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractText: textToAnalyze,
          dealType: dealCategory || selectedSample.category
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result: ContractAnalysis = await response.json();
      setAnalysis(result);

      // Add to recent docs
      const newDoc: RecentDocument = {
        id: `uploaded-${Date.now()}`,
        name: uploadedFileName || "Uploaded_Contract.pdf",
        status: "Complete",
        lastOpened: "Just now",
        fileSize: uploadedFileSize || "1.2 MB"
      };
      setRecentDocs((prev) => [newDoc, ...prev.filter((d) => d.name !== newDoc.name)]);
    } catch (err) {
      // Was: console.error and nothing else. Two consequences, both bad.
      // The caller could not tell the analysis had failed, and `analysis` kept
      // its PREVIOUS value -- so a failed run left the last contract's findings
      // on screen while the header showed the newly uploaded filename. Same
      // defect as the fabricated text, one layer up: a reading attributed to a
      // document it did not come from.
      console.error("AI Analysis Error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Ingest a file the artist chose.
   *
   * WHAT THIS REPLACED (baseline 09751ab): a setInterval that moved a progress
   * bar 10 -> 100 in 200ms steps while nothing was read, then substituted a
   * hardcoded contract -- Net 60, work-made-for-hire, 24-month non-compete --
   * and called the analyzer with the artist's REAL filename. Two such blocks
   * existed, with different invented clauses.
   *
   * Nothing here can do that. `handleRunAIAnalysis` is reached only from the
   * `extracted` phase, which only a real reader can produce.
   */
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);

    let state = reduce({ phase: "idle" }, {
      type: "FILE_CHOSEN", fileName: file.name, bytes: file.size, mime: file.type,
    });
    setIngest(state);
    if (state.phase === "refused") return;      // preflight said no; say so, stop

    // Plain text is read directly. Anything else goes to the reader, and if the
    // reader cannot do it the artist is told -- not shown a substitute.
    const result = file.type.startsWith("text/") || file.name.endsWith(".txt")
      ? await (async () => {
          const text = await file.text();
          const { extracted } = await import("../lib/extraction/types");
          const { MIN_CHARS } = await import("../lib/extraction/machine");
          return text.trim().length < MIN_CHARS
            ? { status: "failed" as const, failure: { kind: "TEXT_TOO_SHORT" as const,
                charCount: text.trim().length, minChars: MIN_CHARS } }
            : { status: "ok" as const, value: extracted({
                text, charCount: text.length, pageCount: 1,
                source: "plaintext" as const, fileName: file.name }) };
        })()
      : await extractPdfText(file, (done, total) =>
          setIngest((prev) => reduce(prev, { type: "PAGE_READ", pagesDone: done, pagesTotal: total })));

    state = reduce(state, { type: "EXTRACTION_DONE", result });
    setIngest(state);
    if (state.phase !== "extracted") return;    // refused: nothing is analysed

    const started = reduce(state, { type: "ANALYSIS_STARTED" });
    setIngest(started);
    setInputText(state.value.text);
    setIsCustomText(true);
    try {
      await handleRunAIAnalysis(state.value.text, file.name.replace(/\.[^/.]+$/, ""));
      setIngest((prev) => reduce(prev, { type: "ANALYSIS_DONE", analysis: true }));
    } catch (err) {
      setIngest((prev) => reduce(prev, {
        type: "ANALYSIS_FAILED", detail: err instanceof Error ? err.message : "analysis failed" }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCancelUpload = () => {
    setIngest({ phase: "idle" });
    setUploadedFileName(null);
    setUploadedFileSize(null);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(analysis.summary || analysis.plainEnglishTranslation);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyChecklist = () => {
    if (analysis.questionsForAttorney) {
      navigator.clipboard.writeText(analysis.questionsForAttorney.join("\n\n"));
      setCopiedChecklist(true);
      setTimeout(() => setCopiedChecklist(false), 2000);
    }
  };

  const handleShareAnalysis = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const handleDownloadPDFReport = () => {
    try {
      setIsGeneratingPDF(true);
      generateContractPDF(analysis);
    } catch (error) {
      console.error("Failed to generate PDF report:", error);
    } finally {
      setTimeout(() => {
        setIsGeneratingPDF(false);
      }, 800);
    }
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(analysis, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${analysis.title.replace(/[^a-zA-Z0-9]/g, "_")}_Analysis.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const scrollToUpload = () => {
    uploadZoneRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSamples = () => {
    sampleSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Determine risk level badge styling
  const getRiskBadge = (score: number) => {
    if (score < 30) return { label: "LOW RISK", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", iconColor: "text-emerald-400" };
    if (score < 60) return { label: "MODERATE RISK", color: "bg-amber-500/10 text-amber-400 border-amber-500/30", iconColor: "text-amber-400" };
    if (score < 80) return { label: "HIGH RISK", color: "bg-orange-500/10 text-orange-400 border-orange-500/30", iconColor: "text-orange-400" };
    return { label: "CRITICAL RISK", color: "bg-rose-500/10 text-rose-400 border-rose-500/30", iconColor: "text-rose-400" };
  };

  const riskBadge = getRiskBadge(analysis.riskScore);

  const filteredSamples = selectedCategory === "All"
    ? SAMPLE_CONTRACTS
    : SAMPLE_CONTRACTS.filter((s) => s.category === selectedCategory || (selectedCategory === "General Business" && ["Employment", "Real Estate", "General Business", "Procurement", "Professional Services"].includes(s.category)));

  return (
    <div className="space-y-10 animate-fadeIn pb-12">

      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-8 sm:p-10 rounded-3xl border border-amber-500/20 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/30 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Contract Workspace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight font-mono">
            Understand any contract in minutes—not hours.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
            Upload a contract and let AI identify risks, obligations, key clauses, and important dates before you sign.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={scrollToUpload}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Contract</span>
            </button>

            <button
              onClick={scrollToSamples}
              className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all border border-slate-700 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Try Sample Contract</span>
            </button>
          </div>
        </div>

        {/* Decorative background visual */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
          <Scale className="w-64 h-64 text-amber-400" />
        </div>
      </div>

      {/* UPLOAD ZONE & RECENT DOCUMENTS GRID */}
      <div ref={uploadZoneRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* DRAG & DROP UPLOAD ZONE (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Upload Contract Document</span>
            </h2>
            <span className="text-xs text-slate-400">PDF • DOCX • TXT</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />

          {/* Dropzone Container */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
                : "border-slate-800 hover:border-amber-500/50 bg-slate-950/60 hover:bg-slate-950/90"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <FileText className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-100 font-mono mb-1">
              Drag & Drop PDF or document
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              or <span className="text-amber-400 underline font-semibold">click to browse</span> your files
            </p>

            <div className="inline-flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
              <span>Supports PDF • DOCX • TXT</span>
            </div>
          </div>

          {/* Ingestion state. Every phase is shown, including the ones where
              we decline to analyse -- which is the point of the panel. */}
          {ingest.phase !== "idle" && (
            <div className={`p-4 rounded-xl border space-y-3 animate-fadeIn ${
              ingest.phase === "refused"
                ? "bg-slate-950/90 border-rose-500/40"
                : "bg-slate-950/90 border-amber-500/30"
            }`}>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-200 font-mono font-semibold">
                  {ingest.phase === "refused"
                    ? <ShieldAlert className="w-4 h-4 text-rose-400" />
                    : <FileText className="w-4 h-4 text-amber-400" />}
                  <span>{uploadedFileName || "Document"}</span>
                  {uploadedFileSize && (
                    <span className="text-[10px] text-slate-400 font-normal">({uploadedFileSize})</span>
                  )}
                </div>
                <button
                  onClick={handleCancelUpload}
                  className="text-slate-400 hover:text-slate-200 text-xs flex items-center space-x-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{ingest.phase === "refused" ? "Try another file" : "Cancel upload"}</span>
                </button>
              </div>

              {ingest.phase === "refused" ? (
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-rose-300">
                    {explain(ingest.failure).title}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {explain(ingest.failure).detail.split("**").map((part, i) =>
                      i % 2 === 1
                        ? <strong key={i} className="text-rose-200">{part}</strong>
                        : <React.Fragment key={i}>{part}</React.Fragment>
                    )}
                  </p>
                </div>
              ) : (
                <>
                  {/* A bar only moves when pages are actually read. When we do not
                      know, it pulses -- it does not invent a number. */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    {uploadProgress === null ? (
                      <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full w-1/3 animate-pulse" />
                    ) : (
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    )}
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                    <span>
                      {ingest.phase === "extracting" && (
                        ingest.pagesTotal
                          ? `Reading page ${ingest.pagesDone} of ${ingest.pagesTotal}...`
                          : "Opening document..."
                      )}
                      {ingest.phase === "extracted" && "Document read. Starting analysis..."}
                      {ingest.phase === "analyzing" && "Analysing the contract..."}
                      {ingest.phase === "complete" && "Analysis complete"}
                    </span>
                    <span>{uploadProgress === null ? "" : `${uploadProgress}%`}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Custom Text Area Input Fallback */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 font-mono">
                Or Paste Raw Contract Text directly:
              </label>
              {isCustomText && (
                <button
                  onClick={() => handleSelectSample(selectedSample)}
                  className="text-xs text-amber-400 hover:underline flex items-center space-x-1 font-mono"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Sample</span>
                </button>
              )}
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setIsCustomText(true);
              }}
              rows={4}
              placeholder="Paste contract text or clauses here..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all resize-y"
            />

            <button
              onClick={() => handleRunAIAnalysis(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>AI Dissecting Contract...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Run AI Contract Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RECENT DOCUMENTS TABLE (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Recent Documents</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                {recentDocs.length} Docs
              </span>
            </div>

            {/* Documents List */}
            <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
              <div className="grid grid-cols-12 gap-2 p-2.5 text-[10px] font-mono uppercase text-slate-400 font-bold bg-slate-900/90">
                <span className="col-span-6">Document</span>
                <span className="col-span-3 text-center">Status</span>
                <span className="col-span-3 text-right">Opened</span>
              </div>

              {recentDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    if (doc.sampleContractId) {
                      const match = SAMPLE_CONTRACTS.find((s) => s.id === doc.sampleContractId);
                      if (match) handleSelectSample(match);
                    }
                  }}
                  className="w-full grid grid-cols-12 gap-2 p-3 text-xs text-left items-center hover:bg-amber-500/5 transition-all text-slate-300 border-b border-slate-800/40 last:border-0 cursor-pointer"
                >
                  <div className="col-span-6 flex items-center space-x-2 overflow-hidden">
                    <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="truncate font-semibold text-slate-200 text-xs">{doc.name}</span>
                  </div>

                  <div className="col-span-3 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{doc.status}</span>
                    </span>
                  </div>

                  <div className="col-span-3 text-right text-[11px] text-slate-400 font-mono">
                    {doc.lastOpened}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Encrypted & Private Storage</span>
            <span className="text-amber-400 font-semibold">Ready for Analysis</span>
          </div>
        </div>

      </div>

      {/* AI ANALYSIS RESULTS SECTION
          Gated on the ingestion machine. `analysis` holds the last successful
          read, so without this gate a refused upload left the PREVIOUS
          contract's findings on screen while the panel above showed the new
          file's name -- a correct analysis attributed to the wrong document.
          Idle covers the sample and paste-text paths, which never ingest. */}
      {(ingest.phase === "idle" || mayShowAnalysis(ingest)) && (
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-8">

        {/* ANALYSIS HEADER & RISK SCORE GAUGE */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-mono font-bold uppercase border border-amber-500/20">
                {analysis.dealType}
              </span>
              <span className="text-xs text-slate-400 font-mono">• AI Clause Dissection</span>
            </div>
            <h2 className="text-2xl font-black text-slate-100 font-mono tracking-tight">
              {analysis.title}
            </h2>
          </div>

          {/* Risk Gauge Metric Card */}
          <div className="flex items-center space-x-5 bg-slate-950/90 p-4 rounded-2xl border border-slate-800 shadow-inner flex-shrink-0">
            <div className="text-center">
              <div className="text-3xl font-black font-mono text-slate-100 tracking-tight">
                {analysis.riskScore}<span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Overall Risk Score</div>
            </div>

            <div className="h-10 w-px bg-slate-800" />

            <div className="space-y-1">
              <span className={`px-3 py-1 text-xs font-black rounded-lg border uppercase tracking-wider font-mono inline-block ${riskBadge.color}`}>
                {riskBadge.label}
              </span>
              <div className="text-[10px] text-slate-400">Calculated across all clauses</div>
            </div>
          </div>
        </div>

        {/* PLAIN-ENGLISH SUMMARY */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-950 to-amber-950/30 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Plain-English Summary</span>
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {analysis.summary || analysis.plainEnglishTranslation}
          </p>
        </div>

        {/* RISK DETECTION CARDS (Automatic Renewal, Unlimited Liability, Non-Compete, Arbitration, etc.) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Risk Detection & Hazard Warnings</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {analysis.riskCards?.length || analysis.redFlags?.length || 0} Critical Alerts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.riskCards && analysis.riskCards.length > 0 ? (
              analysis.riskCards.map((rc, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 font-mono flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>⚠️ {rc.title}</span>
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 uppercase border border-rose-500/30 font-mono">
                      {rc.severity || "HIGH"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {rc.explanation}
                  </p>
                </div>
              ))
            ) : analysis.redFlags && analysis.redFlags.length > 0 ? (
              analysis.redFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 font-mono flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>⚠️ {flag.clause}</span>
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 uppercase border border-rose-500/30 font-mono">
                      {flag.riskLevel} RISK
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {flag.explanation}
                  </p>
                  <div className="mt-2 pl-6 pt-2 border-t border-slate-800 text-[11px] text-amber-300 font-mono">
                    <span className="font-bold">Ask Attorney:</span> "{flag.questionToAsk}"
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                No critical high-risk flags detected in this agreement.
              </div>
            )}
          </div>
        </div>

        {/* KEY CLAUSES EXPANDABLE ACCORDIONS */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Key Clauses Breakdown (Expandable)</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Payment • Termination • IP • Liability</span>
          </div>

          <div className="space-y-3">
            {analysis.keyClauses && analysis.keyClauses.length > 0 ? (
              analysis.keyClauses.map((clause, idx) => {
                const isOpen = !!expandedClauses[clause.title];
                return (
                  <div
                    key={idx}
                    className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/70 transition-all"
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleClauseExpand(clause.title)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-xs border border-amber-500/20">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-bold text-slate-100 font-mono">{clause.title}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {isOpen ? "Hide Details" : "View Breakdown"}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-amber-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Expanded Content */}
                    {isOpen && (
                      <div className="p-5 border-t border-slate-800/80 space-y-4 bg-slate-950/90 animate-fadeIn">
                        {/* Original Clause */}
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                            📜 Original Clause Text:
                          </div>
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed italic">
                            "{clause.originalClause}"
                          </div>
                        </div>

                        {/* Plain English & Potential Concerns Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
                            <div className="text-[11px] font-bold text-amber-400 uppercase font-mono flex items-center space-x-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>Plain-English Explanation:</span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed">
                              {clause.plainEnglish}
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                            <div className="text-[11px] font-bold text-rose-300 uppercase font-mono flex items-center space-x-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Potential Concerns:</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {clause.potentialConcerns}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* Fallback if keyClauses array is empty */
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800">
                Key clause accordions loaded from contract text.
              </div>
            )}
          </div>
        </div>

        {/* RIGHTS & OBLIGATIONS (Your Responsibilities vs Other Party's) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Rights & Responsibilities Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* YOUR RESPONSIBILITIES */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Your Responsibilities</span>
              </div>

              <ul className="space-y-2.5">
                {analysis.yourResponsibilities && analysis.yourResponsibilities.length > 0 ? (
                  analysis.yourResponsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400">Complete required deliverables and uphold confidentiality.</li>
                )}
              </ul>
            </div>

            {/* OTHER PARTY'S RESPONSIBILITIES */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
                <Building className="w-4 h-4 text-blue-400" />
                <span>Other Party's Responsibilities</span>
              </div>

              <ul className="space-y-2.5">
                {analysis.otherPartyResponsibilities && analysis.otherPartyResponsibilities.length > 0 ? (
                  analysis.otherPartyResponsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400">Process invoices and provide contractual disclosures on time.</li>
                )}
              </ul>
            </div>

          </div>
        </div>

        {/* AI RECOMMENDATIONS SECTION */}
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>AI Actionable Recommendations</span>
          </h3>

          <div className="space-y-2.5">
            {analysis.recommendations && analysis.recommendations.length > 0 ? (
              analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5 border border-emerald-500/20">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400">
                1. Review non-compete and auto-renewal duration before signing.
              </div>
            )}
          </div>
        </div>

        {/* ATTORNEY CHECKLIST & EXPORT BUTTONS */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleDownloadPDFReport}
              disabled={isGeneratingPDF}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center space-x-2 transition-all border border-amber-500/30 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-2 transition-all border border-slate-700 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-2 transition-all border border-slate-700 cursor-pointer"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedSummary ? "Copied!" : "Copy Summary"}</span>
            </button>

            <button
              onClick={handleShareAnalysis}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-2 transition-all border border-slate-700 cursor-pointer"
            >
              {shareSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-blue-400" />}
              <span>{shareSuccess ? "Link Copied!" : "Share Analysis"}</span>
            </button>
          </div>

          {/* Next Tool Navigation */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={() => onNavigateToRightsGraph(analysis.dealType)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center space-x-2 transition-all border border-slate-700 cursor-pointer"
            >
              <span>View Rights Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateToWaterfall(analysis.waterfallEstimates)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md cursor-pointer"
            >
              <span>Revenue Waterfall</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
      )}

      {/* SAMPLE CONTRACTS GRID SECTION */}
      <div ref={sampleSectionRef} className="space-y-6 pt-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-100 font-mono tracking-tight flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-400" />
              <span>Sample Contracts Library</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any sample agreement below to test instant AI clause dissection and risk scoring.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {["All", "General Business", "Recording Contracts", "Publishing Agreements"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sample Contracts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSamples.map((sample) => {
            const isCurrent = selectedSample.id === sample.id;
            return (
              <div
                key={sample.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? "bg-gradient-to-b from-slate-900 to-amber-950/20 border-amber-500/60 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/30"
                    : "bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-bold uppercase">
                      {sample.category}
                    </span>
                    <span className="text-xs font-black font-mono px-2.5 py-0.5 rounded bg-slate-950 text-slate-200 border border-slate-800">
                      Risk {sample.defaultRiskScore}%
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 font-mono line-clamp-2">
                    {sample.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {sample.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">Full AI Breakdown Available</span>

                  <button
                    onClick={() => {
                      handleSelectSample(sample);
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    }`}
                  >
                    <span>{isCurrent ? "Active Sample" : "Analyze Contract"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
