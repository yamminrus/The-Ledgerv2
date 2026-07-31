import React, { useState } from "react";
import { REPOSITORY_TREE, ECOSYSTEM_REGISTRY } from "../data/repositoryData";
import { RepoFileNode } from "../types";
import Markdown from "react-markdown";
import {
  FolderTree,
  Folder,
  FileText,
  Copy,
  Check,
  Download,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Terminal,
  Cpu
} from "lucide-react";

export const RepoExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<RepoFileNode>(REPOSITORY_TREE.children![0]); // README.md
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "the-ledger/docs": true,
    "the-ledger/docs/technical": true,
    "the-ledger/docs/music-education": true,
    "the-ledger/packages": true,
    "the-ledger/security": true
  });
  const [copied, setCopied] = useState<boolean>(false);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleCopyFile = () => {
    if (selectedFile.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    if (!selectedFile.content) return;
    const blob = new Blob([selectedFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: RepoFileNode, level: number = 0) => {
    if (node.type === "directory") {
      const isExpanded = expandedFolders[node.path];
      return (
        <div key={node.path} className="space-y-0.5">
          <button
            onClick={() => toggleFolder(node.path)}
            className="w-full flex items-center space-x-1.5 px-2 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:bg-slate-800/80 transition-all text-left"
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
            <Folder className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">{node.name}</span>
          </button>

          {isExpanded && node.children && (
            <div className="space-y-0.5">
              {node.children.map((child) => renderTreeNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    const isSelected = selectedFile.path === node.path;
    return (
      <button
        key={node.path}
        onClick={() => setSelectedFile(node)}
        className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-xs font-mono transition-all text-left ${
          isSelected
            ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
        }`}
        style={{ paddingLeft: `${level * 12 + 20}px` }}
      >
        <FileText className="w-3.5 h-3.5 text-slate-400" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 sm:p-8 rounded-2xl border border-amber-500/20 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/30">
          <FolderTree className="w-3.5 h-3.5" />
          <span>Open Source Repository & Architecture Browser</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
          Repository Structure & Ecosystem Specs.
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Inspect the official <code className="text-amber-400 font-mono">the-ledger</code> repository layout, architecture documents, educational specs, threat models, and T&F Ecosystem Registry metadata.
        </p>
      </div>

      {/* Ecosystem Registry Info Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Division</div>
          <div className="text-xs font-bold text-amber-400 mt-1">{ECOSYSTEM_REGISTRY.division}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Foundation</div>
          <div className="text-xs font-bold text-slate-200 mt-1">{ECOSYSTEM_REGISTRY.foundation}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Security Baseline</div>
          <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active</span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">CI Workflows</div>
          <div className="text-xs font-bold text-purple-400 mt-1">Enabled (3 Jobs)</div>
        </div>
      </div>

      {/* Main File Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Tree Explorer Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>the-ledger /</span>
            </span>
          </div>

          <div className="space-y-1 max-h-[550px] overflow-y-auto pr-1">
            {renderTreeNode(REPOSITORY_TREE)}
          </div>
        </div>

        {/* Right File Content Inspector (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">{selectedFile.path}</span>
              <h2 className="text-base font-bold text-slate-100 font-mono mt-0.5">
                {selectedFile.name}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyFile}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center space-x-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <button
                onClick={handleDownloadFile}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono flex items-center space-x-1.5 transition-all border border-amber-500/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Render File Content */}
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 max-h-[550px] overflow-y-auto">
            {selectedFile.language === "markdown" ? (
              <div className="prose prose-invert max-w-none text-slate-300 text-xs leading-relaxed space-y-3">
                <Markdown>{selectedFile.content || ""}</Markdown>
              </div>
            ) : (
              <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedFile.content}
              </pre>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
