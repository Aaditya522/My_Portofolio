import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import {
  KeyRound,
  RefreshCw,
  ArrowRight,
  Code2,
  ShieldCheck,
  PlusCircle,
  FolderKey,
  Trash2,
  Check,
  Copy,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function WorkspaceAccess() {
  const [activeTab, setActiveTab] = useState("create"); // 'create' | 'enter'
  const [customIdInput, setCustomIdInput] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [enterIdInput, setEnterIdInput] = useState("");
  const [enterPassword, setEnterPassword] = useState("");
  const [showEnterPassword, setShowEnterPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const enterPasswordInputRef = useRef(null);

  const {
    createWorkspace,
    unlockWorkspace,
    generateNewWorkspaceId,
    workspaceId,
    isUnlocked,
    lockWorkspace,
    savedWorkspaces,
    removeSavedWorkspace,
  } = useWorkspace();

  const navigate = useNavigate();

  const handleCreateCustomWorkspace = async (e) => {
    e.preventDefault();
    setError("");

    const targetId = customIdInput.trim().toLowerCase();
    if (!targetId) {
      setError("Please enter a custom Workspace ID or click 'Auto-Generate'");
      return;
    }

    if (targetId.length < 3) {
      setError("Workspace ID must be at least 3 characters long");
      return;
    }

    if (!createPassword) {
      setError("Please enter a secure password for this workspace");
      return;
    }

    if (createPassword.length < 4) {
      setError("Password must be at least 4 characters long");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your workspace password");
      return;
    }

    if (createPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    setLoading(true);
    const res = await createWorkspace(targetId, createPassword, confirmPassword);
    setLoading(false);

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.error || "Failed to create workspace");
    }
  };

  const handleEnterWorkspace = async (e) => {
    e.preventDefault();
    setError("");

    const targetId = enterIdInput.trim().toLowerCase();
    if (!targetId) {
      setError("Please enter your existing Workspace ID");
      return;
    }

    if (!enterPassword) {
      setError("Please enter the workspace password");
      return;
    }

    setLoading(true);
    const res = await unlockWorkspace(targetId, enterPassword);
    setLoading(false);

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.error || "Incorrect password or workspace error");
    }
  };

  const handleQuickSelectWorkspace = (id) => {
    setActiveTab("enter");
    setEnterIdInput(id);
    setEnterPassword("");
    setError("");
    setTimeout(() => {
      enterPasswordInputRef.current?.focus();
    }, 100);
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
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-500 p-0.5 shadow-xl shadow-emerald-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Code2 className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Application Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Secure, password-protected developer workspaces. Create or unlock your workspace with your unique credentials.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          {/* Active Workspace Banner */}
          {workspaceId && (
            <div
              className={`mb-6 p-4 rounded-xl border flex items-center justify-between transition ${
                isUnlocked
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-amber-500/10 border-amber-500/30"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isUnlocked ? "text-emerald-300" : "text-amber-400"
                    }`}
                  >
                    Active Workspace ID
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      isUnlocked
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {isUnlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <div className="text-sm font-mono text-white font-bold">{workspaceId}</div>
              </div>

              <div className="flex items-center gap-2">
                {isUnlocked ? (
                  <>
                    <button
                      type="button"
                      onClick={lockWorkspace}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition flex items-center gap-1.5"
                      title="Lock workspace"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleQuickSelectWorkspace(workspaceId)}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition shadow-md shadow-amber-600/20 flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Enter Password</span>
                  </button>
                )}
              </div>
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
              <span>Create Workspace</span>
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
              <span>Unlock Existing ID</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: Create Manual Password-Protected Workspace */}
          {activeTab === "create" && (
            <form onSubmit={handleCreateCustomWorkspace} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider flex items-center justify-between">
                  <span>Unique Workspace ID</span>
                  <span className="text-slate-500 text-[11px] normal-case font-normal">
                    lowercase, numbers, dashes
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
                    placeholder="e.g. dev_workspace_alpha"
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
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider flex items-center justify-between">
                  <span>Workspace Password</span>
                  <span className="text-slate-500 text-[11px] normal-case font-normal">
                    min. 4 characters
                  </span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    value={createPassword}
                    onChange={(e) => {
                      setCreatePassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Create a strong password"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-11 pr-11 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showCreatePassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Re-enter password to verify"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-11 pr-11 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating & Protecting...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Create & Unlock Workspace</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGenerateRandomId}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2 active:scale-95 shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span>Auto-Generate</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Enter & Unlock Existing Workspace */}
          {activeTab === "enter" && (
            <form onSubmit={handleEnterWorkspace} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Workspace ID
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Workspace Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4 text-teal-400" />
                  </div>
                  <input
                    ref={enterPasswordInputRef}
                    type={showEnterPassword ? "text" : "password"}
                    value={enterPassword}
                    onChange={(e) => {
                      setEnterPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter workspace password"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-11 pr-11 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEnterPassword(!showEnterPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showEnterPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Unlock & Open Workspace</span>
                  </>
                )}
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
                      {savedId === workspaceId && isUnlocked && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuickSelectWorkspace(savedId)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[11px] font-bold transition flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Unlock</span>
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
              Each workspace is protected with bcrypt password encryption. You must enter your workspace password each time to unlock your tasks, expenses, and GitHub branches.
            </p>
          </div>
        </div>

        {/* Link back to public portfolio */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-slate-500 hover:text-slate-300 transition underline cursor-pointer"
          >
            ← Back to Public Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
