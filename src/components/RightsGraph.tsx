import React, { useState } from "react";
import { RightsNode, RightsEdge, RightsGraphPreset } from "../types";
import {
  GitFork,
  UserCheck,
  Building2,
  Music,
  Share2,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from "lucide-react";

const GRAPH_PRESETS: RightsGraphPreset[] = [
  {
    id: "major-360",
    name: "Major Label 360 Deal",
    description: "Label owns sound recordings perpetually, takes 82% streaming profits and 15% touring/merch.",
    nodes: [
      {
        id: "artist",
        label: "Artist (Creator)",
        type: "creator",
        role: "Recording Artist",
        royaltyPercent: 18,
        ownershipPercent: 0,
        description: "Creates master recording. Receives 18% royalty post-recoupment.",
        keyObligations: [
          "Deliver 1 full album + option triggers",
          "Grant 15% 360 ancillary revenue from touring and merch",
          "5-year non-compete re-recording restriction"
        ],
        riskFactor: "Critical",
        x: 100,
        y: 150
      },
      {
        id: "label",
        label: "Apex Record Label",
        type: "entity",
        role: "Master Rights Owner",
        royaltyPercent: 82,
        ownershipPercent: 100,
        description: "Owns Master Recordings perpetually under work-made-for-hire.",
        keyObligations: [
          "Pay $25,000 non-returnable advance",
          "Fund recording and video budgets ($10,000 max)",
          "Provide annual royalty accounting statement"
        ],
        riskFactor: "High",
        x: 350,
        y: 80
      },
      {
        id: "publisher",
        label: "Skyline Publishing",
        type: "entity",
        role: "Composition Admin",
        royaltyPercent: 50,
        ownershipPercent: 50,
        description: "Co-owns publishing rights and administers mechanical & sync licensing.",
        keyObligations: [
          "Collect mechanical royalties from DSPs",
          "Pay 100% Writer share directly to PRO"
        ],
        riskFactor: "Medium",
        x: 350,
        y: 250
      },
      {
        id: "distributor",
        label: "DSP Aggregator",
        type: "distributor",
        role: "Digital Delivery",
        royaltyPercent: 15,
        ownershipPercent: 0,
        description: "Delivers audio files to Spotify, Apple Music, TikTok, YouTube.",
        keyObligations: ["Quarterly royalty reporting", "30-day takedown option"],
        riskFactor: "Low",
        x: 600,
        y: 150
      }
    ],
    edges: [
      { from: "artist", to: "label", label: "Perpetual Master Rights Transfer", type: "ownership" },
      { from: "label", to: "artist", label: "18% Royalty (Post-Recoupment)", type: "royalty" },
      { from: "artist", to: "label", label: "15% touring & merch 360 cut", type: "obligation" },
      { from: "label", to: "distributor", label: "Global Digital Distribution", type: "service" },
      { from: "artist", to: "publisher", label: "50% Co-Pub Composition Split", type: "ownership" }
    ]
  },
  {
    id: "co-publishing",
    name: "Standard Co-Publishing Deal",
    description: "Songwriter retains 100% Writer's share + 50% Publisher's share (75% total composition).",
    nodes: [
      {
        id: "writer",
        label: "Songwriter (Writer)",
        type: "creator",
        role: "Composition Author",
        royaltyPercent: 75,
        ownershipPercent: 50,
        description: "Retains 100% Writer share + 50% Publisher share.",
        keyObligations: ["Deliver minimum 10 songs per year", "Recoup $15,000 publishing advance"],
        riskFactor: "Medium",
        x: 100,
        y: 150
      },
      {
        id: "publisher",
        label: "Music Publisher",
        type: "entity",
        role: "Co-Publisher & Admin",
        royaltyPercent: 25,
        ownershipPercent: 50,
        description: "Owns 50% publisher share and administers global sync opportunities.",
        keyObligations: ["Pay $15,000 advance", "Pitch tracks for film/TV sync"],
        riskFactor: "Low",
        x: 400,
        y: 150
      }
    ],
    edges: [
      { from: "writer", to: "publisher", label: "50% Publisher Rights Transfer", type: "ownership" },
      { from: "publisher", to: "writer", label: "75% Net Composition Royalty", type: "royalty" }
    ]
  },
  {
    id: "producer-spec",
    name: "Producer Spec & Letter of Direction",
    description: "Producer receives $2,500 advance fee + 3% master royalty points via Letter of Direction.",
    nodes: [
      {
        id: "artist",
        label: "Artist",
        type: "creator",
        role: "Recording Artist",
        royaltyPercent: 97,
        ownershipPercent: 100,
        description: "Owns master recording and grants producer points.",
        keyObligations: ["Sign Letter of Direction to distributor", "Pay $2,500 producer fee"],
        riskFactor: "Low",
        x: 120,
        y: 150
      },
      {
        id: "producer",
        label: "Producer (Beatsmith)",
        type: "creator",
        role: "Track Producer",
        royaltyPercent: 3,
        ownershipPercent: 0,
        description: "Receives 3% master points and $2,500 upfront fee.",
        keyObligations: ["Deliver mixed stereo stems", "Provide sample clearance warranty"],
        riskFactor: "Low",
        x: 450,
        y: 150
      }
    ],
    edges: [
      { from: "artist", to: "producer", label: "3% Producer Points (Letter of Direction)", type: "royalty" }
    ]
  },
  {
    id: "diy-indie",
    name: "100% Independent DIY Deal",
    description: "Artist owns 100% of master and composition. Uses flat-fee or 15% rev-share distributor.",
    nodes: [
      {
        id: "artist",
        label: "Independent Artist",
        type: "creator",
        role: "Master & Composition Owner",
        royaltyPercent: 100,
        ownershipPercent: 100,
        description: "Retains complete ownership of sound recording and publishing.",
        keyObligations: ["Self-fund recording and marketing", "Register tracks with PRO/MLC"],
        riskFactor: "Low",
        x: 150,
        y: 150
      },
      {
        id: "distributor",
        label: "Digital Distributor",
        type: "distributor",
        role: "Aggregator Service",
        royaltyPercent: 0,
        ownershipPercent: 0,
        description: "Delivers masters to Spotify/Apple Music for flat annual fee or 15% rev-share.",
        keyObligations: ["Distribute audio to DSPs", "Pay monthly streaming statements"],
        riskFactor: "Low",
        x: 480,
        y: 150
      }
    ],
    edges: [
      { from: "artist", to: "distributor", label: "Non-Exclusive Distribution License", type: "service" }
    ]
  }
];

export const RightsGraph: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<RightsGraphPreset>(GRAPH_PRESETS[0]);
  const [selectedNode, setSelectedNode] = useState<RightsNode | null>(GRAPH_PRESETS[0].nodes[0]);

  const handleSelectPreset = (preset: RightsGraphPreset) => {
    setSelectedPreset(preset);
    setSelectedNode(preset.nodes[0]);
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "Critical": return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "High": return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      case "Medium": return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default: return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "creator": return <UserCheck className="w-5 h-5 text-amber-400" />;
      case "entity": return <Building2 className="w-5 h-5 text-blue-400" />;
      case "distributor": return <Share2 className="w-5 h-5 text-purple-400" />;
      default: return <Music className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 sm:p-8 rounded-2xl border border-amber-500/20 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/30">
          <GitFork className="w-3.5 h-3.5" />
          <span>Interactive Rights Mapping Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
          Map Copyrights, Royalties & Obligations.
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Visualizing how master recordings, composition rights, and royalty flows connect between artists, labels, publishers, and distributors. Click any node to inspect obligations and risk factors.
        </p>
      </div>

      {/* Preset Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {GRAPH_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelectPreset(preset)}
            className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between ${
              selectedPreset.id === preset.id
                ? "bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/5"
                : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono">
                {preset.name}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {preset.description}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-amber-400 font-mono">
              <span>{preset.nodes.length} Parties Mapped</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Visual Graph & Node Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Visual Graph Canvas Area (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Rights Node Network Map</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              Click node to inspect
            </span>
          </div>

          {/* Graphical Node Canvas */}
          <div className="relative min-h-[380px] bg-slate-950/80 rounded-xl border border-slate-800/80 p-6 flex flex-col justify-around space-y-6 overflow-hidden">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

            {/* Nodes Rendered in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {selectedPreset.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 scale-102"
                        : "bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                          {getNodeIcon(node.type)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-100 font-mono">{node.label}</div>
                          <div className="text-[10px] text-slate-400">{node.role}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getRiskBadgeColor(node.riskFactor)} font-mono`}>
                        {node.riskFactor}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Royalty Share:</span>
                      <span className="font-bold text-amber-300">{node.royaltyPercent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edges Summary List */}
            <div className="pt-4 border-t border-slate-800 space-y-2 relative z-10">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Active Rights Relationships & Directives:
              </span>
              <div className="space-y-1.5">
                {selectedPreset.edges.map((edge, idx) => (
                  <div key={idx} className="text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between font-mono">
                    <span className="text-amber-400 font-semibold">{edge.from.toUpperCase()}</span>
                    <span className="text-slate-500 font-sans text-[11px]">➔ {edge.label} ➔</span>
                    <span className="text-blue-400 font-semibold">{edge.to.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Node Inspector Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-6">
          {selectedNode ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-mono">
                      {selectedNode.label}
                    </h3>
                    <p className="text-xs text-slate-400">{selectedNode.role}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getRiskBadgeColor(selectedNode.riskFactor)} font-mono`}>
                  {selectedNode.riskFactor} Risk
                </span>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {selectedNode.description}
              </div>

              {/* Rights & Percentage Breakdown */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Royalty Share</div>
                  <div className="text-xl font-bold text-amber-300 mt-0.5">{selectedNode.royaltyPercent}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Master Ownership</div>
                  <div className="text-xl font-bold text-blue-300 mt-0.5">{selectedNode.ownershipPercent}%</div>
                </div>
              </div>

              {/* Contract Obligations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Key Obligations & Rights Granted</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedNode.keyObligations.map((ob, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-amber-400 font-mono font-bold">•</span>
                      <span>{ob}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Guidance */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Rights Tip:</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Always confirm whether royalty accounting statements include audit rights and clear definitions of deductible expenses before signing.
                </p>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a node on the left to inspect detailed rights and obligations.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
