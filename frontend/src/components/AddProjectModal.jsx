import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { X, FolderPlus, Pencil, Sparkles, CheckCircle, AlertCircle, Loader2, Code2, ExternalLink, Github, Layers } from "lucide-react";

export default function AddProjectModal() {
  const { isAddProjectModalOpen, closeAddProjectModal, addProject, editProject, editingProject } = usePortfolio();

  const [formData, setFormData] = useState({
    title: "",
    category: "Full Stack SaaS Platform",
    description: "",
    featuresText: "",
    techStackText: "",
    githubUrl: "https://github.com",
    demoUrl: "/login",
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'error', text: string }

  const isEditMode = Boolean(editingProject);

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || "",
        category: editingProject.category || "Full Stack SaaS Platform",
        description: editingProject.description || "",
        featuresText: (editingProject.features || []).join("\n"),
        techStackText: (editingProject.techStack || []).join(", "),
        githubUrl: editingProject.githubUrl || "https://github.com",
        demoUrl: editingProject.demoUrl || "/login",
      });
    } else {
      setFormData({
        title: "",
        category: "Full Stack SaaS Platform",
        description: "",
        featuresText: "",
        techStackText: "",
        githubUrl: "https://github.com",
        demoUrl: "/login",
      });
    }
    setStatusMsg(null);
  }, [editingProject, isAddProjectModalOpen]);

  if (!isAddProjectModalOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setStatusMsg({ type: "error", text: "Please enter a valid Project Title and Description." });
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    const projectPayload = {
      title: formData.title.trim(),
      category: formData.category.trim() || "Full Stack Application",
      description: formData.description.trim(),
      features: formData.featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      techStack: formData.techStackText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      githubUrl: formData.githubUrl.trim() || "https://github.com",
      demoUrl: formData.demoUrl.trim() || "/login",
    };

    let result;
    if (isEditMode && editingProject?.id) {
      result = await editProject(editingProject.id, projectPayload);
    } else {
      result = await addProject(projectPayload);
    }

    setSubmitting(false);

    if (result.success) {
      setStatusMsg({
        type: "success",
        text: isEditMode
          ? "Project details updated successfully in DB!"
          : "New project successfully added to portfolio!",
      });
      setTimeout(() => {
        setStatusMsg(null);
        closeAddProjectModal();
      }, 1000);
    } else {
      setStatusMsg({ type: "error", text: result.error || "Failed to save project changes." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-emerald-50 border-2 border-emerald-200/90 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-100 via-teal-100/70 to-emerald-50 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              {isEditMode ? <Pencil className="w-6 h-6" /> : <FolderPlus className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-950 tracking-tight flex items-center gap-2">
                <span>{isEditMode ? "Edit Project Details" : "Add New Project"}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 border border-emerald-300">
                  PIN Authorized
                </span>
              </h3>
              <p className="text-xs text-emerald-700/90 font-semibold">
                {isEditMode
                  ? "Update existing project information in your portfolio database"
                  : "Publish a new project into your portfolio showcase"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAddProjectModal}
            className="p-2 rounded-xl bg-white/80 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-950 transition shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div
            className={`mx-6 mt-4 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              statusMsg.type === "success"
                ? "bg-emerald-100 border border-emerald-300 text-emerald-900"
                : "bg-red-100 border border-red-300 text-red-900"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-emerald-50/50">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Project Title *</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Real-Time Analytics Dashboard"
                className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-semibold shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>Category / Tag *</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="e.g. Full Stack SaaS Platform, Fintech, AI Tool"
                className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-semibold shadow-sm"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1.5">Project Overview / Description *</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Briefly describe what this application does, its core value proposition, and key capabilities..."
              className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-sm leading-relaxed"
              required
            />
          </div>

          {/* Key Features */}
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center justify-between">
              <span>Key Features (One feature per line)</span>
              <span className="text-[11px] text-emerald-700/80 font-medium">Bullet points on project card</span>
            </label>
            <textarea
              rows={3}
              value={formData.featuresText}
              onChange={(e) => handleChange("featuresText", e.target.value)}
              placeholder={"Secure JWT authentication & REST APIs\nInteractive Chart.js analytics dashboard\nTask workflow & GitHub branch synchronization"}
              className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-sm font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center justify-between">
              <span>Tech Stack Badges (Comma-separated)</span>
              <span className="text-[11px] text-emerald-700/80 font-medium">Rendered as technology pills</span>
            </label>
            <input
              type="text"
              value={formData.techStackText}
              onChange={(e) => handleChange("techStackText", e.target.value)}
              placeholder="React.js, Node.js, Express.js, MongoDB, Tailwind CSS, Chart.js"
              className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-sm font-mono text-xs"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                <span>Try Workspace / Demo URL</span>
              </label>
              <input
                type="text"
                value={formData.demoUrl}
                onChange={(e) => handleChange("demoUrl", e.target.value)}
                placeholder="/login or https://..."
                className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-sm font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-emerald-700" />
                <span>GitHub Repository URL</span>
              </label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => handleChange("githubUrl", e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-sm font-mono text-xs"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-emerald-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddProjectModal}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition shadow-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditMode ? "Saving Changes..." : "Saving Project..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isEditMode ? "Save Changes" : "Publish Project"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
