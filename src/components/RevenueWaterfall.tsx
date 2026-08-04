import React, { useState } from "react";
import { WaterfallConfig, WaterfallResult } from "../types";
import { formatCurrency } from "../lib/formatCurrency";
import { ReconciliationBadge } from "./ReconciliationBadge";
import { motion, AnimatePresence } from "motion/react";
import {
  DollarSign,
  Calculator,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowDownRight,
  TrendingUp,
  RotateCcw
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

interface RevenueWaterfallProps {
  initialEstimates?: {
    artistRoyaltyRate?: number;
    advanceAmount?: number;
    labelShareRate?: number;
  };
}

export const RevenueWaterfall: React.FC<RevenueWaterfallProps> = ({ initialEstimates }) => {
  const [config, setConfig] = useState<WaterfallConfig>({
    grossRevenue: 100000,
    distributionFeePct: 15,
    labelRoyaltyPct: initialEstimates?.labelShareRate ?? 80,
    artistRoyaltyPct: initialEstimates?.artistRoyaltyRate ?? 20,
    producerPointsPct: 3,
    advanceAmount: initialEstimates?.advanceAmount ?? 25000,
    recordingCosts: 10000,
    videoBudget: 5000,
    publisherSharePct: 50
  });

  // Calculate Waterfall Results
  const calculateWaterfall = (cfg: WaterfallConfig): WaterfallResult => {
    const gross = cfg.grossRevenue;
    const distFee = gross * (cfg.distributionFeePct / 100);
    const netAfterDist = gross - distFee;

    const producerPayout = netAfterDist * (cfg.producerPointsPct / 100);
    const netForLabelArtist = netAfterDist - producerPayout;

    const artistGrossShare = netForLabelArtist * (cfg.artistRoyaltyPct / 100);
    const labelGrossShare = netForLabelArtist * (cfg.labelRoyaltyPct / 100);

    const totalAdvanceToRecoup = cfg.advanceAmount + cfg.recordingCosts + cfg.videoBudget;
    const recoupmentApplied = Math.min(artistGrossShare, totalAdvanceToRecoup);
    const remainingUnrecoupedAdvance = Math.max(0, totalAdvanceToRecoup - artistGrossShare);

    const artistNetPayout = Math.max(0, artistGrossShare - totalAdvanceToRecoup);
    const labelNetPayout = labelGrossShare + recoupmentApplied;

    return {
      grossRevenue: gross,
      distributionFee: distFee,
      netAfterDist: netAfterDist,
      producerPayout: producerPayout,
      labelGrossShare: labelGrossShare,
      artistGrossShare: artistGrossShare,
      totalAdvanceToRecoup: totalAdvanceToRecoup,
      recoupmentApplied: recoupmentApplied,
      remainingUnrecoupedAdvance: remainingUnrecoupedAdvance,
      artistNetPayout: artistNetPayout,
      labelNetPayout: labelNetPayout,
      isRecouped: artistGrossShare >= totalAdvanceToRecoup
    };
  };

  const result = calculateWaterfall(config);

  // Bar chart data for waterfall stages
  const chartData = [
    { name: "Gross DSP", amount: result.grossRevenue, fill: "#f59e0b" },
    { name: "Distro Fee", amount: result.distributionFee, fill: "#a855f7" },
    { name: "Net Receipts", amount: result.netAfterDist, fill: "#3b82f6" },
    { name: "Label Share", amount: result.labelGrossShare, fill: "#64748b" },
    { name: "Recoupment", amount: result.recoupmentApplied, fill: "#f97316" },
    { name: "Artist Net Payout", amount: result.artistNetPayout, fill: "#10b981" }
  ];

  // Side-by-side comparison simulation: Current Deal vs Fair Indie Deal (85% Artist / 15% Distro, $0 Advance)
  const fairIndieArtistNet = (config.grossRevenue * 0.85) - 0; // 85% payout
  const predatoryArtistNet = Math.max(0, (config.grossRevenue * 0.85 * 0.12) - config.advanceAmount - 20000); // 12% royalty + high debt

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 sm:p-8 rounded-2xl border border-amber-500/20 shadow-xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Financial Simulator</span>
          </div>
          <ReconciliationBadge state="balanced" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
          Revenue Waterfall Simulator.
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Simulate how money flows through distribution fees, label splits, producer points, and advance recoupments. See exactly how much cash reaches your bank account.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Waterfall Parameters & Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Deal Parameters & Revenues</span>
            </h2>
            <button
              onClick={() =>
                setConfig({
                  grossRevenue: 100000,
                  distributionFeePct: 15,
                  labelRoyaltyPct: 80,
                  artistRoyaltyPct: 20,
                  producerPointsPct: 3,
                  advanceAmount: 25000,
                  recordingCosts: 10000,
                  videoBudget: 5000,
                  publisherSharePct: 50
                })
              }
              className="text-xs text-amber-400 hover:underline flex items-center space-x-1 font-mono cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Gross DSP Revenue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Gross DSP Revenue:</span>
              <span className="font-bold text-amber-300">{formatCurrency(config.grossRevenue)}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={500000}
              step={5000}
              value={config.grossRevenue}
              onChange={(e) => setConfig({ ...config, grossRevenue: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-950 cursor-pointer"
            />
          </div>

          {/* Slider 2: Artist Royalty Rate % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Artist Royalty Rate:</span>
              <span className="font-bold text-emerald-400">{config.artistRoyaltyPct}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={config.artistRoyaltyPct}
              onChange={(e) => {
                const artistRate = Number(e.target.value);
                setConfig({
                  ...config,
                  artistRoyaltyPct: artistRate,
                  labelRoyaltyPct: Math.max(0, 100 - artistRate)
                });
              }}
              className="w-full accent-emerald-500 bg-slate-950 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% (Major Label)</span>
              <span>50% (Net Profit)</span>
              <span>100% (Indie DIY)</span>
            </div>
          </div>

          {/* Slider 3: Advance Balance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Upfront Advance Paid:</span>
              <span className="font-bold text-amber-400">{formatCurrency(config.advanceAmount)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100000}
              step={2500}
              value={config.advanceAmount}
              onChange={(e) => setConfig({ ...config, advanceAmount: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-950 cursor-pointer"
            />
          </div>

          {/* Slider 4: Recording & Video Costs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-mono">Recording Budget:</label>
              <input
                type="number"
                value={config.recordingCosts}
                onChange={(e) => setConfig({ ...config, recordingCosts: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-mono">Video & Marketing:</label>
              <input
                type="number"
                value={config.videoBudget}
                onChange={(e) => setConfig({ ...config, videoBudget: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200"
              />
            </div>
          </div>

          {/* Slider 5: Distribution Fee % */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Distributor Fee:</span>
              <span className="font-bold text-purple-400">{config.distributionFeePct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={config.distributionFeePct}
              onChange={(e) => setConfig({ ...config, distributionFeePct: Number(e.target.value) })}
              className="w-full accent-purple-500 bg-slate-950 cursor-pointer"
            />
          </div>

        </div>

        {/* Right Column: Calculated Waterfall Results & Charts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Executive Recoupment Banner with motion animation */}
          <motion.div
            key={result.artistNetPayout}
            initial={{ scale: 0.98, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-2xl border shadow-lg space-y-3 ${
              result.isRecouped
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                : "bg-amber-950/40 border-amber-500/30 text-amber-200"
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                {result.isRecouped ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
                <span className="font-extrabold text-sm font-mono uppercase tracking-wider">
                  {result.isRecouped ? "RECUPERATED & PROFITABLE" : "UNRECOUPED ADVANCE DEBT"}
                </span>
              </div>
              <span className="text-2xl font-black font-mono">
                {formatCurrency(result.artistNetPayout)} <span className="text-xs text-slate-400 font-sans font-normal">Artist Net Cash</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {result.isRecouped
                ? `You have earned enough in royalties (${formatCurrency(result.artistGrossShare)}) to fully pay off your ${formatCurrency(result.totalAdvanceToRecoup)} advance and studio costs! You receive a net check of ${formatCurrency(result.artistNetPayout)}.`
                : `Your ${formatCurrency(result.artistGrossShare)} in earned royalties was entirely absorbed by your ${formatCurrency(result.totalAdvanceToRecoup)} advance debt. You still owe ${formatCurrency(result.remainingUnrecoupedAdvance)} before receiving royalty payouts.`}
            </p>
          </motion.div>

          {/* Recharts Bar Breakdown */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Revenue Flow Stages ($ USD)</span>
            </h3>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(val: number) => [formatCurrency(val), "Amount"]}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Deal Model Comparison */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Deal Architecture Comparison (Artist Net Payout):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              
              {/* Current Model */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/40 space-y-2">
                <div className="text-[10px] text-amber-400 uppercase font-semibold">Current Simulation</div>
                <div className="text-lg font-bold text-slate-100">{formatCurrency(result.artistNetPayout)}</div>
                <div className="text-[10px] text-slate-400 font-sans">
                  {config.artistRoyaltyPct}% Royalty • {formatCurrency(config.advanceAmount)} Advance
                </div>
              </div>

              {/* Fair DIY Indie Model */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 space-y-2">
                <div className="text-[10px] text-emerald-400 uppercase font-semibold">Fair DIY Indie Model</div>
                <div className="text-lg font-bold text-emerald-300">{formatCurrency(fairIndieArtistNet)}</div>
                <div className="text-[10px] text-slate-400 font-sans">
                  85% Royalty • $0 Advance Debt
                </div>
              </div>

              {/* Predatory Deal */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/40 space-y-2">
                <div className="text-[10px] text-rose-400 uppercase font-semibold">Predatory 360 Deal</div>
                <div className="text-lg font-bold text-rose-300">{formatCurrency(predatoryArtistNet)}</div>
                <div className="text-[10px] text-slate-400 font-sans">
                  12% Royalty • Heavy Cross-Collateral
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

