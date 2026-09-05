import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import {
  Briefcase,
  Globe,
  LogOut,
  Menu,
  X,
  Code2,
  ChevronRight,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";

export default function DashboardLayout() {
  const { workspaceId, leaveWorkspace } = useWorkspace();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSwitchWorkspace = () => {
    leaveWorkspace();
    navigate("/workspace");
  };

  const handleCopyId = () => {
    if (workspaceId) {
      navigator.clipboard.writeText(workspaceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navItems = [
    {
      name: "Work Workspace",
      path: "/dashboard/work",
      icon: Briefcase,
      description: "Tasks & GitHub Branches",
    },
  ];

  const activePath = location.pathname === "/dashboard" ? "/dashboard/work" : location.pathname;

  return (
    <div className="h-screen w-screen bg-[#020617] text-slate-100 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B0F19] border-b border-slate-800 shrink-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-base">DevWorkspace</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Fixed Non-Scrolling Sidebar Component */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 shrink-0 z-40 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Sidebar Header Brand */}
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <div className="w-full h-full bg-[#020617] rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-white tracking-tight">DevWorkspace</h2>
              <p className="text-[11px] text-indigo-400/90 font-medium">Developer Suite</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Workspaces
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group ${isActive
                      ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 shadow-md shadow-indigo-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${isActive
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-400 group-hover:text-white"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{item.description}</div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${isActive ? "text-indigo-400 opacity-100" : "opacity-0 group-hover:opacity-50"
                      }`}
                  />
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-800/80 my-2">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Navigation
              </div>
              <Link
                to="/"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 text-sm font-medium transition"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Public Portfolio Site</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Workspace Info & Switch */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Workspace ID</div>
                  <div className="text-xs font-mono font-bold text-white truncate">{workspaceId}</div>
                </div>
              </div>
              <button
                onClick={handleCopyId}
                title="Copy Workspace ID"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSwitchWorkspace}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-95 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Switch Workspace</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport - Only Right Content Scrolls */}
      <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-8 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
