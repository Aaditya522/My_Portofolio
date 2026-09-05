import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import { Lock, KeyRound, Eye, EyeOff, ArrowRight, Loader2, RefreshCw } from "lucide-react";

export default function WorkspaceUnlockModal() {
  const { workspaceId, unlockWorkspace, leaveWorkspace } = useWorkspace();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter the workspace password");
      return;
    }

    setLoading(true);
    setError("");

    const res = await unlockWorkspace(workspaceId, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Incorrect password. Access denied.");
    }
  };

  const handleSwitch = () => {
    leaveWorkspace();
    navigate("/workspace");
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-600/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-card-fade-in">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {/* Header Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-amber-500/30 p-1 mb-4 shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Lock className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Workspace Locked
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Enter the password to access this secure workspace
            </p>
          </div>

          {/* Locked Workspace ID Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Target Workspace ID
              </div>
              <div className="text-sm font-mono text-indigo-300 font-bold truncate">
                {workspaceId}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              Locked
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>Workspace Password</span>
              </label>

              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <KeyRound className="w-4 h-4 text-indigo-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoFocus
                  placeholder="Enter workspace password"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none transition shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
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
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Password...</span>
                </>
              ) : (
                <>
                  <span>Unlock Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Workspace option */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={handleSwitch}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch or create another workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
