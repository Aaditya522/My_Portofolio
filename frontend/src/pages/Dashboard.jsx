import React from "react";
import { useWorkspace } from "../context/WorkspaceContext";

export default function Dashboard() {
  const { workspaceId, leaveWorkspace } = useWorkspace();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <header className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 text-sm">Active Workspace ID: <span className="font-mono text-indigo-400 font-bold">{workspaceId}</span></p>
        </div>
        <button
          onClick={leaveWorkspace}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm transition"
        >
          Switch Workspace
        </button>
      </header>
      <main className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-slate-200 mb-2">Tasks Overview</h3>
          <p className="text-slate-400 text-sm">Manage your developer tasks and priorities.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-slate-200 mb-2">Expenses & Assets</h3>
          <p className="text-slate-400 text-sm">Track monthly budgets and asset lifespan.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-slate-200 mb-2">GitHub Branches</h3>
          <p className="text-slate-400 text-sm">Link task workflows directly to Git branches.</p>
        </div>
      </main>
    </div>
  );
}
