import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function ToastNotification() {
  const { notification, closeNotification } = usePortfolio();

  if (!notification) return null;

  const isSuccess = notification.type === "success";

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full px-4 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 ${
          isSuccess
            ? "bg-slate-900/90 text-white border-emerald-500/40 shadow-emerald-500/10"
            : "bg-red-950/90 text-white border-red-500/40 shadow-red-500/10"
        }`}
      >
        {/* Icon */}
        <div
          className={`p-2 rounded-xl shrink-0 ${
            isSuccess ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>

        {/* Message Content */}
        <div className="flex-1 pt-0.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-0.5">
            <span>{isSuccess ? "Success Notification" : "Action Alert"}</span>
          </h4>
          <p className="text-sm font-semibold text-white leading-snug">
            {notification.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={closeNotification}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
