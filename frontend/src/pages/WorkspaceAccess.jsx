import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import {
  KeyRound,
  Sparkles,
  ArrowRight,
  Code2,
  ShieldCheck,
  PlusCircle,
  FolderKey,
  Trash2,
  Check,
  Copy,
} from "lucide-react";

export default function WorkspaceAccess() {
  const [activeTab, setActiveTab] = useState("create"); // 'create' | 'enter'
  const [customIdInput, setCustomIdInput] = useState("");
  const [enterIdInput, setEnterIdInput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    enterWorkspace,
    generateNewWorkspaceId,
    workspaceId,
    savedWorkspaces,
    removeSavedWorkspace,
  } = useWorkspace();

  const navigate = useNavigate();

  const handleCreateCustomWorkspace = (e) => {
    e.preventDefault();
    setError("");

    const targetId = customIdInput.trim();
    if (!targetId) {
      setError("Please enter a custom Workspace ID or click 'Generate Unique ID'");
      return;
    }

    const res = enterWorkspace(targetId);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.error);
    }
  };

  const handleEnterWorkspace = (e) => {
    e.preventDefault();
    setError("");

    const targetId = enterIdInput.trim();
    if (!targetId) {
      setError("Please enter your existing Workspace ID");
      return;
    }

    const res = enterWorkspace(targetId);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.error);
    }
  };

  const handleQuickSelectWorkspace = (id) => {
    const res = enterWorkspace(id);
    if (res.success) {
      navigate("/dashboard");
    }
  };

  const handleGenerateRandomId = () => {
    const generated = generateNewWorkspaceId();
    setCustomIdInput(generated);
    setError("");
  };

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-400 p-0.5 shadow-xl shadow-emerald-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Code2 className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Application Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            No login or password needed. Create your manual unique Workspace ID to access your personal dashboard anytime.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          {/* Active Workspace Banner */}
          {workspaceId && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                  Active Workspace ID
                </div>
                <div className="text-sm font-mono text-white font-bold">{workspaceId}</div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 border border-slate-800/80 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("create");
                setError("");
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === "create"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Manual ID</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("enter");
                setError("");
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === "enter"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FolderKey className="w-4 h-4" />
              <span>Enter Existing ID</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: Create Manual Unique Workspace ID */}
          {activeTab === "create" && (
            <form onSubmit={handleCreateCustomWorkspace} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider flex items-center justify-between">
                  <span>Define Your Manual Workspace ID</span>
                  <span className="text-slate-500 text-[11px] normal-case font-normal">
                    e.g. my_personal_ws
                  </span>
                </label>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <KeyRound className="w-5 h-5 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={customIdInput}
                    onChange={(e) => {
                      setCustomIdInput(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your custom unique ID (e.g. alex_dev_space)"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-11 pr-24 py-3 text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                  />
                  {customIdInput && (
                    <button
                      type="button"
                      onClick={() => handleCopy(customIdInput)}
                      className="absolute right-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  Pick any custom unique identifier you like. Use this ID anytime on any device to return to your workspace.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Save & Access Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerateRandomId}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2 active:scale-95 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Auto-Generate</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Enter Existing Workspace ID */}
          {activeTab === "enter" && (
            <form onSubmit={handleEnterWorkspace} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Enter Existing Workspace ID
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <FolderKey className="w-5 h-5 text-teal-400" />
                  </div>
                  <input
                    type="text"
                    value={enterIdInput}
                    onChange={(e) => {
                      setEnterIdInput(e.target.value);
                      setError("");
                    }}
                    placeholder="Type your existing Workspace ID"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3 text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Saved Workspaces History List */}
          {savedWorkspaces.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Your Recent / Saved Workspaces
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {savedWorkspaces.map((savedId) => (
                  <div
                    key={savedId}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/50 transition group"
                  >
                    <button
                      type="button"
                      onClick={() => handleQuickSelectWorkspace(savedId)}
                      className="flex items-center gap-2.5 text-left font-mono text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition flex-1 truncate"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
                      <span className="truncate">{savedId}</span>
                      {savedId === workspaceId && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuickSelectWorkspace(savedId)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[11px] font-bold transition"
                      >
                        Enter
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSavedWorkspace(savedId)}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition"
                        title="Remove from saved history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Helper info footer */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-start gap-3 text-slate-400 text-xs">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <p>
              Creating a manual unique Workspace ID allows you to isolate your developer tasks, expenses, and GitHub branches under your own custom key.
            </p>
          </div>
        </div>

        {/* Link back to public portfolio */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-slate-500 hover:text-slate-300 transition underline"
          >
            ← Back to Public Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
