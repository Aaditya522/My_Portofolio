import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskKanban from "../components/TaskKanban";
import GithubActivityTracker from "../components/GithubActivityTracker";
import { Briefcase, FolderGit2, ListTodo } from "lucide-react";

export default function WorkWorkspace() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("github-activity"); // 'github-activity' | 'kanban'

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks");
      setTasks(res.data || []);
    } catch (error) {
      console.error("Error fetching tasks for workspace summary:", error);
    }
  };

  const pendingCount = tasks.filter((t) => t.status === "Pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="space-y-8 pb-16 animate-card-fade-in">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl transition-all hover:border-slate-700/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Developer Productivity Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Work Workspace</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track GitHub commits, branch activity, and manage sprint Kanban workflows.
          </p>
        </div>

        {/* Task Counters Banner */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-center transition-transform duration-200 hover:scale-105">
            <div className="text-xs text-slate-400 font-medium">Pending</div>
            <div className="text-lg font-bold text-amber-400">{pendingCount}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-center transition-transform duration-200 hover:scale-105">
            <div className="text-xs text-slate-400 font-medium">In Progress</div>
            <div className="text-lg font-bold text-blue-400">{inProgressCount}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-center transition-transform duration-200 hover:scale-105">
            <div className="text-xs text-slate-400 font-medium">Completed</div>
            <div className="text-lg font-bold text-emerald-400">{completedCount}</div>
          </div>
        </div>
      </div>

      {/* Primary Section Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 max-w-fit">
        <button
          onClick={() => setActiveTab("github-activity")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 active:scale-95 cursor-pointer ${activeTab === "github-activity"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-[1.02]"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>GitHub Activity Tracker</span>
        </button>

        <button
          onClick={() => setActiveTab("kanban")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 active:scale-95 cursor-pointer ${activeTab === "kanban"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-[1.02]"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>Task Board & Kanban</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "github-activity" && (
        <div className="animate-card-fade-in">
          <GithubActivityTracker />
        </div>
      )}

      {activeTab === "kanban" && (
        <div className="animate-card-fade-in">
          <TaskKanban onTasksUpdated={(updatedTasks) => setTasks(updatedTasks)} />
        </div>
      )}
    </div>
  );
}
