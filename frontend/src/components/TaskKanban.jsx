import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  X,
  Loader2,
  Tag,
  GitBranch,
  Pencil,
  FileCode,
  Database,
  Upload,
  Copy,
  Download,
  Check,
  RotateCw,
} from "lucide-react";

export default function TaskKanban({ onTasksUpdated }) {
  const [tasks, setTasks] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // SQL Preview Modal State
  const [previewSql, setPreviewSql] = useState(null); // { taskTitle, file }
  const [copiedSql, setCopiedSql] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    branchName: "",
    sqlAttachments: [],
  });

  // State for raw SQL input inside modal
  const [rawSqlFilename, setRawSqlFilename] = useState("");
  const [rawSqlContent, setRawSqlContent] = useState("");
  const [showRawSqlInput, setShowRawSqlInput] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchAvailableBranches();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/tasks");
      setTasks(res.data);
      if (onTasksUpdated) onTasksUpdated(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableBranches = async () => {
    try {
      const res = await axios.get("/api/github-activity/branches");
      setAvailableBranches(res.data || []);
    } catch (error) {
      console.error("Error fetching activity branches for selector:", error);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      priority: "Medium",
      status: "Pending",
      dueDate: "",
      branchName: "",
      sqlAttachments: [],
    });
    setRawSqlFilename("");
    setRawSqlContent("");
    setShowRawSqlInput(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title || "",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      branchName: task.branchName || "",
      sqlAttachments: Array.isArray(task.sqlAttachments) ? task.sqlAttachments : [],
    });
    setRawSqlFilename("");
    setRawSqlContent("");
    setShowRawSqlInput(false);
    setShowModal(true);
  };

  // Handle uploading local .sql files via file picker
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    const validFiles = files.filter(
      (file) => file.name.endsWith(".sql") || file.name.endsWith(".txt") || file.name.endsWith(".queries")
    );

    if (validFiles.length === 0) {
      alert("Please select valid .sql files.");
      return;
    }

    const readPromises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            filename: file.name,
            content: event.target.result || "",
            uploadedAt: new Date(),
          });
        };
        reader.readAsText(file);
      });
    });

    const newAttachments = await Promise.all(readPromises);

    setFormData((prev) => {
      const existingMap = new Map();
      (prev.sqlAttachments || []).forEach((att) => existingMap.set(att.filename, att));
      newAttachments.forEach((att) => existingMap.set(att.filename, att));

      return {
        ...prev,
        sqlAttachments: Array.from(existingMap.values()),
      };
    });

    e.target.value = null;
  };

  // Add raw pasted SQL snippet
  const handleAddRawSql = () => {
    if (!rawSqlFilename.trim()) {
      alert("Please enter a SQL filename (e.g. migration.sql)");
      return;
    }
    const fname = rawSqlFilename.trim().endsWith(".sql") ? rawSqlFilename.trim() : `${rawSqlFilename.trim()}.sql`;

    setFormData((prev) => {
      const existingMap = new Map();
      (prev.sqlAttachments || []).forEach((att) => existingMap.set(att.filename, att));
      existingMap.set(fname, {
        filename: fname,
        content: rawSqlContent || "",
        uploadedAt: new Date(),
      });

      return {
        ...prev,
        sqlAttachments: Array.from(existingMap.values()),
      };
    });

    setRawSqlFilename("");
    setRawSqlContent("");
    setShowRawSqlInput(false);
  };

  const handleRemoveSqlAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sqlAttachments: prev.sqlAttachments.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setSubmitting(true);
      if (editingTaskId) {
        const res = await axios.put(`/api/tasks/${editingTaskId}`, formData);
        setTasks((prev) => prev.map((t) => (t._id === editingTaskId ? res.data : t)));
      } else {
        const res = await axios.post("/api/tasks", formData);
        setTasks((prev) => [res.data, ...prev]);
      }
      setShowModal(false);
      setEditingTaskId(null);
      await fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
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

  const columns = [
    {
      id: "Pending",
      title: "Pending",
      color: "border-amber-500/40 text-amber-400 bg-amber-500/10",
      badge: "bg-amber-500/20 text-amber-300",
    },
    {
      id: "In Progress",
      title: "In Progress",
      color: "border-blue-500/40 text-blue-400 bg-blue-500/10",
      badge: "bg-blue-500/20 text-blue-300",
    },
    {
      id: "Completed",
      title: "Completed",
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
      badge: "bg-emerald-500/20 text-emerald-300",
    },
  ];

  const formatDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "Medium":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      default:
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Task Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Task Management Kanban
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Organize developer tasks by status, priority, due dates, Git branches, and attached SQL DB migration files.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Loading tasks board...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col min-h-[420px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.badge}`} />
                    <h3 className="font-bold text-white text-sm">{col.title}</h3>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${col.badge}`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Task Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                      No tasks in {col.title}
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task._id}
                        className="group perspective-1000 min-h-[175px] w-full cursor-pointer"
                      >
                        <div className="relative w-full h-full min-h-[175px] duration-500 preserve-3d transition-transform group-hover:[transform:rotateY(180deg)] rounded-2xl">
                          {/* FRONT SIDE: Shows ONLY Task Name, Date, and Priority */}
                          <div className="absolute inset-0 w-full h-full backface-hidden bg-slate-950 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-colors">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-slate-100 text-sm leading-snug">
                                  {task.title}
                                </h4>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${getPriorityBadge(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              </div>

                              <div className="space-y-1.5 text-xs text-slate-400">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  <span>Added: {task.createdAt ? formatDDMMYYYY(task.createdAt) : "Recently"}</span>
                                </div>
                                {task.dueDate && (
                                  <div className="flex items-center gap-1.5 text-slate-400">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span>Due: {formatDDMMYYYY(task.dueDate)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-900/90 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                              <span className="flex items-center gap-1">
                                <RotateCw className="w-3 h-3 text-indigo-400 animate-spin" style={{ animationDuration: "4s" }} />
                                Hover to flip details
                              </span>
                              <span className="text-[10px] bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-full text-indigo-300">
                                3D Info
                              </span>
                            </div>
                          </div>

                          {/* BACK SIDE: Detailed info, Branch name, Attached SQL files, & Actions */}
                          <div className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] bg-[#0F172A] border border-indigo-500/40 rounded-2xl p-3.5 flex flex-col justify-between shadow-2xl overflow-y-auto pr-1">
                            <div className="space-y-2">
                              {/* Header Title & Priority */}
                              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
                                <div>
                                  <h5 className="font-bold text-slate-200 text-xs truncate max-w-[140px]">
                                    {task.title}
                                  </h5>
                                  <div className="text-[10px] text-slate-400">
                                    Added: {task.createdAt ? formatDDMMYYYY(task.createdAt) : "Recently"}
                                  </div>
                                </div>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${getPriorityBadge(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              </div>

                              {/* Git Branch Badge */}
                              {task.branchName && (
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-[11px] font-mono font-medium max-w-full">
                                  <GitBranch className="w-3 h-3 text-indigo-400 shrink-0" />
                                  <span className="truncate">{task.branchName}</span>
                                </div>
                              )}

                              {/* Attached SQL DB Files Block */}
                              <div className="bg-slate-950/80 border border-cyan-900/60 rounded-lg p-2 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                                    <Database className="w-3 h-3 text-cyan-400 shrink-0" />
                                    DB Changes (.sql)
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEditModal(task);
                                    }}
                                    className="text-[9px] font-semibold text-cyan-400 hover:underline flex items-center gap-0.5"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                    <span>{Array.isArray(task.sqlAttachments) && task.sqlAttachments.length > 0 ? "More" : "Attach"}</span>
                                  </button>
                                </div>

                                {Array.isArray(task.sqlAttachments) && task.sqlAttachments.length > 0 ? (
                                  <div className="flex flex-wrap gap-1 pt-0.5">
                                    {task.sqlAttachments.map((sqlFile, idx) => (
                                      <button
                                        key={idx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewSql({ taskTitle: task.title, file: sqlFile });
                                        }}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/70 text-cyan-300 text-[10px] font-mono font-medium hover:bg-cyan-900 transition"
                                        title="Click to view SQL code diff"
                                      >
                                        <FileCode className="w-3 h-3 text-cyan-400 shrink-0" />
                                        <span className="truncate max-w-[120px]">{sqlFile.filename}</span>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-slate-500 italic">
                                    No .sql migration attached
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Card Actions Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                              <div className="flex items-center gap-1">
                                {col.id === "In Progress" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(task._id, "Pending");
                                    }}
                                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition"
                                    title="Move to Pending"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}
                                {col.id === "Completed" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(task._id, "In Progress");
                                    }}
                                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition"
                                    title="Move to In Progress"
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {col.id === "Pending" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(task._id, "In Progress");
                                    }}
                                    className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-semibold flex items-center gap-1 hover:bg-blue-500/30 transition"
                                  >
                                    <span>Start</span>
                                    <ArrowRight className="w-2.5 h-2.5" />
                                  </button>
                                )}
                                {col.id === "In Progress" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(task._id, "Completed");
                                    }}
                                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 hover:bg-emerald-500/30 transition"
                                  >
                                    <span>Complete</span>
                                    <ArrowRight className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(task);
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-cyan-300 transition"
                                  title="Attach / Edit .sql files"
                                >
                                  <Database className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(task);
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-purple-300 transition"
                                  title="Edit Task & Branch"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTask(task._id);
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-rose-400 transition"
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg">
                {editingTaskId ? "Edit Task" : "Create New Task"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Implement Store Delivery DB migration"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Git Branch Name Selector & Custom Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                    Git Branch Name (Optional)
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Select or type custom</span>
                </label>

                {availableBranches.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        setFormData({ ...formData, branchName: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-purple-300 font-mono mb-2 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="">-- Quick Select Synced Branch --</option>
                    {availableBranches.map((b) => (
                      <option key={b._id || b.branchName} value={b.branchName}>
                        {b.branchName} [{b.status}]
                      </option>
                    ))}
                  </select>
                )}

                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  placeholder="e.g. feature/aaditya_str_dlvry_staging"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-purple-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Database Changes (.sql Files) Section */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-cyan-400" />
                    Attach Database Changes (.sql)
                  </span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950 border border-cyan-800/60 hover:bg-cyan-900/80 transition cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload .sql</span>
                    <input
                      type="file"
                      accept=".sql,.txt"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Attached SQL Files List */}
                {formData.sqlAttachments.length > 0 ? (
                  <div className="space-y-2">
                    {formData.sqlAttachments.map((sqlFile, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-cyan-300"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="truncate">{sqlFile.filename}</span>
                          <span className="text-[10px] text-slate-500">
                            ({(sqlFile.content || "").split("\n").length} lines)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSqlAttachment(idx)}
                          className="text-slate-400 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                          title="Remove attachment"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 text-[11px] italic text-center py-2 border border-dashed border-slate-800 rounded-lg">
                    No SQL migration files attached yet.
                  </div>
                )}

                {/* Toggle Raw SQL Input */}
                {!showRawSqlInput ? (
                  <button
                    type="button"
                    onClick={() => setShowRawSqlInput(true)}
                    className="text-[11px] text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Or paste raw SQL queries manually</span>
                  </button>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="SQL Filename (e.g. 2026_08_15_schema.sql)"
                      value={rawSqlFilename}
                      onChange={(e) => setRawSqlFilename(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                    <textarea
                      rows={3}
                      placeholder="Paste SQL statements (CREATE TABLE, ALTER TABLE...)"
                      value={rawSqlContent}
                      onChange={(e) => setRawSqlContent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRawSqlInput(false)}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddRawSql}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white rounded-lg"
                      >
                        Add SQL Query
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md cursor-pointer"
                >
                  {submitting ? "Saving..." : editingTaskId ? "Update Task" : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive SQL Migration File Code Viewer Modal */}
      {previewSql && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <h3 className="font-mono font-bold text-cyan-300 text-sm">
                    {previewSql.file?.filename || "database_changes.sql"}
                  </h3>
                  <p className="text-slate-400 text-[11px]">
                    Attached to task: <span className="text-slate-200">{previewSql.taskTitle}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewSql(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">
                {(previewSql.file?.content || "").split("\n").length} Lines • SQL Migration Query
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySqlToClipboard(previewSql.file?.content)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownloadSqlFile(previewSql.file?.filename, previewSql.file?.content)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .sql</span>
                </button>
              </div>
            </div>

            {/* SQL Content Box */}
            <div className="flex-1 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 leading-relaxed whitespace-pre-wrap selection:bg-cyan-900 selection:text-white">
              {previewSql.file?.content || "-- Empty SQL file"}
            </div>

            {/* Close Footer */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setPreviewSql(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
