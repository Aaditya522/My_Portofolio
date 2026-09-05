import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { ShieldCheck, Lock, X, Eye, EyeOff, KeyRound, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

export default function PinVerificationModal() {
  const { isPinModalOpen, closePinModal, verifyPin } = usePortfolio();
  const [pinInput, setPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isPinModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setVerifying(true);
    setErrorMsg("");

    const result = await verifyPin(pinInput.trim());
    setVerifying(false);

    if (!result.success) {
      setErrorMsg(result.message || "Invalid confidential PIN. Access Denied.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closePinModal}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
            <Lock className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Confidential Access Required</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Please enter your unique confidential PIN to unlock and edit portfolio information.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Confidential PIN
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <KeyRound className="w-5 h-5 text-emerald-400" />
              </div>
              <input
                type={showPin ? "text" : "password"}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Enter confidential PIN"
                autoFocus
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-11 pr-11 py-3 text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={verifying || !pinInput.trim()}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95 mt-2"
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying PIN...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock & Edit Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
