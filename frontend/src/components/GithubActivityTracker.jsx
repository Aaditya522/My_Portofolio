import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  RefreshCw,
  Search,
  FileCode,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  AlertCircle,
  FolderGit2,
  UserCheck,
  ShieldCheck,
  Settings,
  X,
  Database,
  Copy,
  Download,
  Check,
} from "lucide-react";

export default function GithubActivityTracker() {
  const [branches, setBranches] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  // SQL Preview Modal State
  const [previewSql, setPreviewSql] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const formatDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  // Config modal state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState({
    owner: "",
    repo: "",
    username: "",
    prefix: "",
  });

  // State for expanded branch cards: { [branchName]: true/false }
  const [expandedBranches, setExpandedBranches] = useState({});
  // Cache for commits by branch: { [branchName]: [commitArray] }
  const [branchCommits, setBranchCommits] = useState({});
  const [loadingCommits, setLoadingCommits] = useState({});

  // State for expanded commits: { [commitSha]: true/false }
  const [expandedCommits, setExpandedCommits] = useState({});
  // Cache for commit files & diffs: { [commitSha]: [fileArray] }
  const [commitFiles, setCommitFiles] = useState({});
  const [loadingFiles, setLoadingFiles] = useState({});

  // State for expanded diffs per file: { [`${commitSha}_${filename}`]: true/false }
  const [expandedDiffs, setExpandedDiffs] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchSyncStatus(), fetchBranches(), fetchTasks()]);
    } catch (err) {
      console.error("Error loading GitHub Activity data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks");
      setTasks(res.data || []);
    } catch (err) {}
  };

  const handleCopySqlToClipboard = (content) => {
    navigator.clipboard.writeText(content || "");
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSqlFile = (filename, content) => {
    const element = document.createElement("a");
    const file = new Blob([content || ""], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename || "database_changes.sql";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const fetchSyncStatus = async () => {
    try {
      const res = await axios.get("/api/github-activity/sync-status");
      setSyncStatus(res.data);
      if (res.data) {
        const repoParts = (res.data.configuredRepo || "bhawanbaweja/kits-staging-new").split("/");
        setConfigForm({
          owner: repoParts[0] || "bhawanbaweja",
          repo: repoParts[1] || "kits-staging-new",
          username: res.data.configuredUsername || "Aaditya522",
          prefix: res.data.configuredPrefix || "aaditya",
        });
      }
    } catch (err) {
      console.error("Error fetching sync status:", err);
    }
  };

  const [syncBanner, setSyncBanner] = useState(null); // { type: 'success' | 'info' | 'error', message: string }

  const fetchBranches = async () => {
    try {
      const res = await axios.get("/api/github-activity/branches");
      setBranches(res.data);
    } catch (err) {
      console.error("Error fetching activity branches:", err);
    }
  };

  const handleSync = async (customPayload = null) => {
    try {
      setSyncing(true);
      setSyncError(null);
      setSyncBanner(null);
      const payload = customPayload || {};
      const res = await axios.post("/api/github-activity/sync", payload);
      await fetchSyncStatus();
      await fetchBranches();
      if (showConfigModal) setShowConfigModal(false);

      const data = res.data;
      if (data.isUpToDate) {
        setSyncBanner({
          type: "info",
          message: data.syncMessage || `Already up to date! All ${data.branchesCount || branches.length} branches are synced.`,
        });
      } else {
        setSyncBanner({
          type: "success",
          message: data.syncMessage || `Sync successful! (${data.branchesCount || 0} branches tracked)`,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to sync GitHub activity";
      setSyncError(msg);
      setSyncBanner({
        type: "error",
        message: `Sync Failed: ${msg}`,
      });
      await fetchSyncStatus();
    } finally {
      setSyncing(false);
    }
  };

  const toggleBranchExpand = async (branchName) => {
    const isExpanding = !expandedBranches[branchName];
    setExpandedBranches((prev) => ({ ...prev, [branchName]: isExpanding }));

    if (isExpanding && !branchCommits[branchName]) {
      try {
        setLoadingCommits((prev) => ({ ...prev, [branchName]: true }));
        const encoded = encodeURIComponent(branchName);
        const res = await axios.get(`/api/github-activity/branches/${encoded}/commits`);
        setBranchCommits((prev) => ({ ...prev, [branchName]: res.data }));
      } catch (err) {
        console.error(`Error fetching commits for branch ${branchName}:`, err);
      } finally {
        setLoadingCommits((prev) => ({ ...prev, [branchName]: false }));
      }
    }
  };

  const toggleCommitExpand = async (sha) => {
    const isExpanding = !expandedCommits[sha];
    setExpandedCommits((prev) => ({ ...prev, [sha]: isExpanding }));

    if (isExpanding && !commitFiles[sha]) {
      try {
        setLoadingFiles((prev) => ({ ...prev, [sha]: true }));
        const res = await axios.get(`/api/github-activity/commits/${sha}/files`);
        setCommitFiles((prev) => ({ ...prev, [sha]: res.data }));
      } catch (err) {
        console.error(`Error fetching file diffs for commit ${sha}:`, err);
      } finally {
        setLoadingFiles((prev) => ({ ...prev, [sha]: false }));
      }
    }
  };

  const toggleFileDiff = (commitSha, filename) => {
    const key = `${commitSha}_${filename}`;
    setExpandedDiffs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter & sort branches based on search term, status filter, and latest commit date (newest first)
  const filteredBranches = branches
    .filter((b) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        b.branchName.toLowerCase().includes(term) ||
        (b.repo && b.repo.toLowerCase().includes(term)) ||
        (b.prTitle && b.prTitle.toLowerCase().includes(term)) ||
        (b.prNumber && String(b.prNumber).includes(term)) ||
        (b.targetBranch && b.targetBranch.toLowerCase().includes(term));

      if (statusFilter === "ALL") return matchesSearch;
      return matchesSearch && b.status === statusFilter;
    })
    .sort((a, b) => {
      const dateA = a.latestCommitDate ? new Date(a.latestCommitDate).getTime() : 0;
      const dateB = b.latestCommitDate ? new Date(b.latestCommitDate).getTime() : 0;
      return dateB - dateA;
    });

  // Calculate Pagination Slices
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBranches = filteredBranches.slice(startIndex, endIndex);

  // Calculate total stats
  const totalCommitsCount = branches.reduce((acc, b) => acc + (b.commitCount || 0), 0);
  const totalAdditionsCount = branches.reduce((acc, b) => acc + (b.totalAdditions || 0), 0);
  const totalDeletionsCount = branches.reduce((acc, b) => acc + (b.totalDeletions || 0), 0);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "MERGED":
        return "bg-teal-500/15 text-teal-300 border-teal-500/30";
      case "ACTIVE":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "CLOSED":
        return "bg-slate-800 text-slate-400 border-slate-700";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getChangeTypeBadge = (type) => {
    switch (type) {
      case "added":
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold">A</span>;
      case "deleted":
        return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold">D</span>;
      case "renamed":
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold">R</span>;
      default:
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold">M</span>;
    }
  };

  // Helper to render patch line diff with syntax colors
  const renderPatchDiff = (patch) => {
    if (!patch) {
      return (
        <div className="p-3 text-xs text-slate-500 italic bg-slate-950 rounded-lg">
          No detailed patch diff provided by GitHub for this file.
        </div>
      );
    }

    const lines = patch.split("\n");
    return (
      <div className="bg-slate-950 font-mono text-xs overflow-x-auto rounded-lg border border-slate-800 p-2 leading-relaxed">
        {lines.map((line, idx) => {
          let lineStyle = "text-slate-300";
          let bgStyle = "";

          if (line.startsWith("+") && !line.startsWith("+++")) {
            lineStyle = "text-emerald-300";
            bgStyle = "bg-emerald-950/30 border-l-2 border-emerald-500 pl-1";
          } else if (line.startsWith("-") && !line.startsWith("---")) {
            lineStyle = "text-rose-300";
            bgStyle = "bg-rose-950/30 border-l-2 border-rose-500 pl-1";
          } else if (line.startsWith("@@")) {
            lineStyle = "text-purple-400 font-semibold";
            bgStyle = "bg-purple-950/20 pl-1 py-0.5 my-0.5";
          }

          return (
            <div key={idx} className={`${bgStyle} ${lineStyle} whitespace-pre`}>
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Top Banner & Sync Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>GitHub Activity & Commit Tracking</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <span>Developer Commit Dashboard</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700 font-mono font-bold">
                {syncStatus?.configuredPrefix || "aaditya"}
              </span>
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Author: <strong className="text-slate-200">{syncStatus?.configuredUsername || "Aaditya522"}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                Repo: <strong className="text-slate-200">{syncStatus?.configuredRepo || "bhawanbaweja/kits-staging-new"}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Last Synced:{" "}
                <strong className="text-slate-300">
                  {syncStatus?.lastSyncTime
                    ? new Date(syncStatus.lastSyncTime).toLocaleString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not synced yet"}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Configure Target Repository & Identity"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSync()}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 shadow-lg shadow-indigo-600/25 transition active:scale-95 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing GitHub Activity..." : "Sync GitHub Activity"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic UI Notification Banner (Success / Up-to-date / Added New / Failed) */}
        {syncBanner && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 shadow-lg transition ${
              syncBanner.type === "info"
                ? "bg-cyan-950/80 border-cyan-500/40 text-cyan-200 shadow-cyan-950/30"
                : syncBanner.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-200 shadow-emerald-950/30"
                : "bg-rose-950/80 border-rose-500/40 text-rose-200 shadow-rose-950/30"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {syncBanner.type === "info" ? (
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              ) : syncBanner.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className="font-medium">{syncBanner.message}</span>
            </div>
            <button
              onClick={() => setSyncBanner(null)}
              className="text-slate-400 hover:text-white transition p-0.5 rounded-md hover:bg-slate-800/50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 hover:border-indigo-500/30">
            <div className="text-xs text-slate-400 font-medium">Aaditya Branches</div>
            <div className="text-xl font-bold text-white mt-0.5">{branches.length}</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 hover:border-indigo-500/30">
            <div className="text-xs text-slate-400 font-medium">Tracked Commits</div>
            <div className="text-xl font-bold text-indigo-400 mt-0.5">{totalCommitsCount}</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 hover:border-emerald-500/30">
            <div className="text-xs text-slate-400 font-medium">Lines Added</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">+{totalAdditionsCount.toLocaleString()}</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 hover:border-rose-500/30">
            <div className="text-xs text-slate-400 font-medium">Lines Removed</div>
            <div className="text-xl font-bold text-rose-400 mt-0.5">-{totalDeletionsCount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {["ALL", "ACTIVE", "MERGED", "CLOSED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? "bg-indigo-600 text-white font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search repo, branch, or PR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Branch List Container (Branch-Based Organization) */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
          <span>Loading GitHub Activity...</span>
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
          <GitBranch className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">No Aaditya branches found matching criteria.</p>
          <p className="text-slate-500 text-xs">
            Click <strong>Sync GitHub Activity</strong> above to fetch recent branches from GitHub.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedBranches.map((branch) => {
            const isBranchExpanded = !!expandedBranches[branch.branchName];
            const commits = branchCommits[branch.branchName] || [];
            const isLoadingBranchCommits = !!loadingCommits[branch.branchName];

            return (
              <div
                key={branch._id || branch.branchName}
                className="bg-[#0B0F19] border border-slate-800 rounded-2xl overflow-hidden shadow-xl minimal-card-hover hover:border-indigo-500/40 hover:shadow-indigo-950/20"
              >
                {/* Branch Card Summary Header */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm font-bold text-indigo-300 bg-indigo-950/40 border border-indigo-800/50 px-3 py-1 rounded-lg inline-flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-indigo-400" />
                        {branch.branchName}
                      </span>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getStatusBadgeClass(branch.status)}`}>
                        Status: {branch.status}
                      </span>

                      {/* Target Branch info */}
                      {branch.targetBranch && (
                        <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                          {branch.status === "MERGED" ? "Merged into" : "Target"}: <strong className="text-slate-200">{branch.targetBranch}</strong>
                        </span>
                      )}

                      {/* PR Info Badge */}
                      {branch.prNumber && (
                        <a
                          href={branch.prUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-0.5 rounded-full hover:underline"
                        >
                          <GitPullRequest className="w-3 h-3" />
                          PR #{branch.prNumber} {branch.prStatus === "OPEN" ? "- Open" : ""}
                          {branch.prUrl && <ExternalLink className="w-2.5 h-2.5" />}
                        </a>
                      )}


                    </div>

                    {/* Stats metrics */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
                      <span className="font-semibold text-slate-200">{branch.commitCount} Commits</span>
                      <span>•</span>
                      <span>{branch.totalFilesChanged} Files Changed</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono">+{branch.totalAdditions.toLocaleString()}</span>
                      <span className="text-rose-400 font-mono">-{branch.totalDeletions.toLocaleString()}</span>
                      {(branch.firstCommitDate || branch.createdAt) && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">
                            Created: <strong className="text-slate-300">{formatDDMMYYYY(branch.firstCommitDate || branch.createdAt)}</strong>
                          </span>
                        </>
                      )}
                      {branch.latestCommitDate && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">
                            Latest Commit: <strong className="text-slate-300">{formatDDMMYYYY(branch.latestCommitDate)}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleBranchExpand(branch.branchName)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition shrink-0 cursor-pointer"
                  >
                    <span>{isBranchExpanded ? "Hide Activity" : "View Activity"}</span>
                    {isBranchExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Branch Commit List */}
                {isBranchExpanded && (
                  <div className="border-t border-slate-800 bg-slate-950/60 p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-purple-400" />
                      Commits on {branch.branchName} ({branch.commitCount})
                    </h4>

                    {isLoadingBranchCommits ? (
                      <div className="flex items-center justify-center py-6 text-slate-400 text-xs gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                        <span>Loading commits for branch...</span>
                      </div>
                    ) : commits.length === 0 ? (
                      <div className="text-xs text-slate-500 italic py-4">
                        No commits authored by configured GitHub identity on this branch.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {commits.map((commit) => {
                          const isCommitExpanded = !!expandedCommits[commit.sha];
                          const files = commitFiles[commit.sha] || [];
                          const isLoadingCommitFiles = !!loadingFiles[commit.sha];

                          return (
                            <div
                              key={commit.sha}
                              className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-3"
                            >
                              {/* Commit Header Row */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2.5 flex-wrap">
                                    <span className="font-bold text-white text-sm">
                                      {commit.message}
                                    </span>
                                    <a
                                      href={commit.htmlUrl || "#"}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-mono text-xs text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/40 hover:underline inline-flex items-center gap-1"
                                    >
                                      {commit.shortSha}
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  </div>

                                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                                    <span>Author: <strong className="text-slate-300">{commit.authorName}</strong></span>
                                    <span>•</span>
                                    <span>{new Date(commit.commitDate).toLocaleString()}</span>
                                    <span>•</span>
                                    <span className="text-slate-300">{commit.filesChangedCount} files changed</span>
                                    <span>•</span>
                                    <span className="text-emerald-400 font-mono">+{commit.additions}</span>
                                    <span className="text-rose-400 font-mono">-{commit.deletions}</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => toggleCommitExpand(commit.sha)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition shrink-0 cursor-pointer self-start sm:self-center"
                                >
                                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>{isCommitExpanded ? "Hide File Diffs" : "View File Diffs"}</span>
                                  {isCommitExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </button>
                              </div>

                              {/* Expanded Commit Files & Diffs */}
                              {isCommitExpanded && (
                                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3">
                                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Changed Files ({commit.filesChangedCount})
                                  </h5>

                                  {isLoadingCommitFiles ? (
                                    <div className="flex items-center gap-2 py-4 text-xs text-slate-400">
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                                      <span>Loading changed files and diffs...</span>
                                    </div>
                                  ) : files.length === 0 ? (
                                    <div className="text-xs text-slate-500 italic py-2">
                                      No file detail records available for this commit.
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      {files.map((file) => {
                                        const diffKey = `${commit.sha}_${file.filename}`;
                                        const isDiffShown = !!expandedDiffs[diffKey];

                                        return (
                                          <div
                                            key={file._id || file.filename}
                                            className="bg-slate-950 border border-slate-800/70 rounded-lg p-3 space-y-2"
                                          >
                                            <div className="flex items-center justify-between gap-3 text-xs">
                                              <div className="flex items-center gap-2 overflow-hidden">
                                                {getChangeTypeBadge(file.changeType)}
                                                <span className="font-mono text-slate-200 truncate" title={file.filename}>
                                                  {file.filename}
                                                </span>
                                              </div>

                                              <div className="flex items-center gap-3 shrink-0">
                                                <span className="font-mono text-[11px]">
                                                  <span className="text-emerald-400">+{file.additions}</span>{" "}
                                                  <span className="text-rose-400">-{file.deletions}</span>
                                                </span>

                                                {file.patch && (
                                                  <button
                                                    onClick={() => toggleFileDiff(commit.sha, file.filename)}
                                                    className="text-xs text-purple-400 hover:text-purple-300 font-medium underline cursor-pointer"
                                                  >
                                                    {isDiffShown ? "Hide Patch" : "View Patch"}
                                                  </button>
                                                )}
                                              </div>
                                            </div>

                                            {/* Patch Diff view */}
                                            {isDiffShown && file.patch && renderPatchDiff(file.patch)}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Navigation Bar */}
      {filteredBranches.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{startIndex + 1}</strong> to{" "}
            <strong className="text-white">{Math.min(endIndex, filteredBranches.length)}</strong> of{" "}
            <strong className="text-white">{filteredBranches.length}</strong> branches (Page{" "}
            <strong className="text-purple-300">{validCurrentPage}</strong> of {totalPages})
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Per Page Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
              <span>Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Previous Page Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={validCurrentPage === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Previous
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - validCurrentPage) <= 1)
              .map((p, idx, arr) => {
                const prevPage = arr[idx - 1];
                const showEllipsis = prevPage && p - prevPage > 1;

                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="text-xs text-slate-600 px-1">...</span>}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        validCurrentPage === p
                          ? "bg-indigo-600 text-white font-bold shadow-sm"
                          : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            {/* Next Page Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={validCurrentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Configure Target Repository
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSync(configForm);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  GitHub Owner / Organization *
                </label>
                <input
                  type="text"
                  value={configForm.owner}
                  onChange={(e) => setConfigForm({ ...configForm, owner: e.target.value })}
                  placeholder="e.g. Aaditya522 or organization"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Repository Name *
                </label>
                <input
                  type="text"
                  value={configForm.repo}
                  onChange={(e) => setConfigForm({ ...configForm, repo: e.target.value })}
                  placeholder="e.g. kits-staging-new or task8_major"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Developer GitHub Username *
                </label>
                <input
                  type="text"
                  value={configForm.username}
                  onChange={(e) => setConfigForm({ ...configForm, username: e.target.value })}
                  placeholder="e.g. Aaditya522"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Aaditya Branch Prefix Filter *
                </label>
                <input
                  type="text"
                  value={configForm.prefix}
                  onChange={(e) => setConfigForm({ ...configForm, prefix: e.target.value })}
                  placeholder="e.g. aaditya or main"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={syncing}
                  className="px-5 py-2 rounded-xl text-white bg-purple-600 hover:bg-purple-500 font-semibold shadow-md inline-flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                  <span>{syncing ? "Syncing..." : "Save & Sync Now"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
