import React, { useState, useEffect, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import {
  X,
  Save,
  User,
  Share2,
  List,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  FileText,
  Github,
  Linkedin,
  Mail,
  Heading,
  Image,
  Upload,
  Loader2,
  KeyRound,
  Percent,
} from "lucide-react";

// Helper function to resolve skill proficiency matching the card defaults
export const getSkillProficiency = (skill, index = 0) => {
  if (skill && skill.proficiency !== undefined && skill.proficiency !== null && skill.proficiency !== "") {
    const num = Number(skill.proficiency);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      return Math.round(num);
    }
  }
  const defaultProficiencies = [95, 90, 92, 88, 85, 87, 82, 90, 86, 94, 84, 92, 80, 78, 85, 83, 81];
  return defaultProficiencies[index % defaultProficiencies.length];
};

export default function EditPortfolioModal() {
  const { profile, updateProfile, uploadAvatarFile, uploadResumeDocument, verifiedPin, isEditModalOpen, closeEditModal, showNotification } = usePortfolio();

  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'socials' | 'roles' | 'skills'
  const [formData, setFormData] = useState({ ...profile, pin: verifiedPin || "ty]:LO1c" });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success'|'error', text: string }
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);

  // Sync state whenever profile or modal opens so inputs ALWAYS have current DB values
  useEffect(() => {
    if (profile) {
      const copy = JSON.parse(JSON.stringify(profile));
      if (Array.isArray(copy.skills)) {
        copy.skills = copy.skills.map((s, idx) => ({
          ...s,
          proficiency: getSkillProficiency(s, idx),
        }));
      }
      setFormData({
        ...copy,
        pin: verifiedPin || "ty]:LO1c",
      });
      setPreviewError(false);
    }
  }, [profile, isEditModalOpen, verifiedPin]);

  if (!isEditModalOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP, etc.).");
      return;
    }

    setUploadingAvatar(true);
    const result = await uploadAvatarFile(file);
    setUploadingAvatar(false);

    if (result.success && result.avatarUrl) {
      setFormData((prev) => ({ ...prev, avatarUrl: result.avatarUrl }));
      showNotification("Profile picture uploaded successfully!", "success");
    } else {
      alert(result.error || "Failed to upload image via Multer.");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      alert("Please select a valid document file (.pdf, .doc, .docx).");
      return;
    }

    setUploadingResume(true);
    const result = await uploadResumeDocument(file);
    setUploadingResume(false);

    if (result.success && result.resumeUrl) {
      setFormData((prev) => ({ ...prev, resumeUrl: result.resumeUrl }));
      showNotification(`Resume file "${result.originalName || file.name}" uploaded successfully!`, "success");
    } else {
      alert(result.error || "Failed to upload resume document via Multer.");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Role management handlers
  const handleRoleChange = (index, value) => {
    const updatedRoles = [...formData.roles];
    updatedRoles[index] = value;
    setFormData((prev) => ({ ...prev, roles: updatedRoles }));
  };

  const handleAddRole = () => {
    setFormData((prev) => ({ ...prev, roles: [...(prev.roles || []), "New Role / Specialty"] }));
    showNotification("New role added to list", "success");
  };

  const handleRemoveRole = (index) => {
    const updatedRoles = formData.roles.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, roles: updatedRoles }));
    showNotification("Role removed from list", "success");
  };

  // Skill management handlers
  const handleSkillChange = (index, key, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = { ...updatedSkills[index], [key]: value };
    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleAddSkill = () => {
    const newSkill = {
      id: `skill_${Date.now()}`,
      title: "New Skill",
      description: "Description of your skill capability and experience.",
      proficiency: 80,
      bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
      iconColor: "text-amber-800 bg-lime-200/80",
    };
    setFormData((prev) => ({ ...prev, skills: [...(prev.skills || []), newSkill] }));
    showNotification("New skill card added to list", "success");
  };

  const handleRemoveSkill = (index) => {
    const targetSkillName = formData.skills?.[index]?.title || "Skill";
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
    showNotification(`Removed "${targetSkillName}" from skills list`, "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Skills Proficiency percentages
    if (Array.isArray(formData.skills)) {
      for (let i = 0; i < formData.skills.length; i++) {
        const s = formData.skills[i];
        const title = s.title?.trim() || `Skill #${i + 1}`;
        const rawProf = s.proficiency;

        if (rawProf === "" || rawProf === undefined || rawProf === null) {
          setActiveTab("skills");
          setSaveStatus({
            type: "error",
            text: `Validation Error: Proficiency for "${title}" is required.`,
          });
          showNotification(`Proficiency for "${title}" is required.`, "error");
          return;
        }

        const num = Number(rawProf);
        if (isNaN(num)) {
          setActiveTab("skills");
          setSaveStatus({
            type: "error",
            text: `Validation Error: Proficiency for "${title}" must be a numeric value.`,
          });
          showNotification(`Proficiency for "${title}" must be numeric.`, "error");
          return;
        }

        if (num < 0) {
          setActiveTab("skills");
          setSaveStatus({
            type: "error",
            text: `Validation Error: Proficiency for "${title}" cannot be negative.`,
          });
          showNotification(`Proficiency for "${title}" cannot be negative.`, "error");
          return;
        }

        if (num > 100) {
          setActiveTab("skills");
          setSaveStatus({
            type: "error",
            text: `Validation Error: Proficiency for "${title}" cannot exceed 100.`,
          });
          showNotification(`Proficiency for "${title}" cannot exceed 100.`, "error");
          return;
        }

        if (!Number.isInteger(num)) {
          setActiveTab("skills");
          setSaveStatus({
            type: "error",
            text: `Validation Error: Proficiency for "${title}" must be an integer percentage (between 0 and 100).`,
          });
          showNotification(`Proficiency for "${title}" must be an integer percentage.`, "error");
          return;
        }
      }
    }

    setSaving(true);
    setSaveStatus(null);

    // Format skills proficiency as numbers
    const payload = {
      ...formData,
      skills: Array.isArray(formData.skills)
        ? formData.skills.map((s) => ({
            ...s,
            proficiency: Number(s.proficiency),
          }))
        : [],
    };

    const result = await updateProfile(payload, payload.pin);
    setSaving(false);

    if (result.success) {
      setSaveStatus({ type: "success", text: "Portfolio updated successfully in MongoDB!" });
      showNotification("Portfolio information saved successfully in database!", "success");
      setTimeout(() => {
        closeEditModal();
        setSaveStatus(null);
      }, 1200);
    } else {
      setSaveStatus({ type: "error", text: result.error || "Failed to save portfolio changes" });
      showNotification(result.error || "Failed to save portfolio changes", "error");
    }
  };

  const getAvatarSrc = (url) => {
    if (!url) return "/profile-avatar.png";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
    if (!apiBase) {
      return url.startsWith("/") ? url : `/${url}`;
    }
    return url.startsWith("/") ? `${apiBase}${url}` : `${apiBase}/${url}`;
  };

  const previewAvatarSrc = previewError ? "/profile-avatar.png" : getAvatarSrc(formData.avatarUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md overflow-y-auto">
      <div className="bg-emerald-50 border-2 border-emerald-200/90 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-100 via-teal-100/70 to-emerald-50 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-950 tracking-tight">Edit Portfolio Information</h3>
              <p className="text-xs text-emerald-700/90 font-semibold">Values are synced dynamically with MongoDB database</p>
            </div>
          </div>

          <button
            onClick={closeEditModal}
            className="p-2 rounded-xl bg-white/80 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-950 transition shadow-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex border-b border-emerald-200 bg-emerald-100/60 px-4 pt-3 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`pb-3 px-4 text-xs font-extrabold transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "general"
                ? "border-emerald-600 text-emerald-800 bg-white shadow-xs rounded-t-xl border-t border-x border-emerald-200"
                : "border-transparent text-emerald-700/70 hover:text-emerald-950"
            }`}
          >
            <User className="w-4 h-4" />
            <span>General Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("socials")}
            className={`pb-3 px-4 text-xs font-extrabold transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "socials"
                ? "border-emerald-600 text-emerald-800 bg-white shadow-xs rounded-t-xl border-t border-x border-emerald-200"
                : "border-transparent text-emerald-700/70 hover:text-emerald-950"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Socials & Resume</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("roles")}
            className={`pb-3 px-4 text-xs font-extrabold transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "roles"
                ? "border-emerald-600 text-emerald-800 bg-white shadow-xs rounded-t-xl border-t border-x border-emerald-200"
                : "border-transparent text-emerald-700/70 hover:text-emerald-950"
            }`}
          >
            <Heading className="w-4 h-4" />
            <span>Typewriter Roles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("skills")}
            className={`pb-3 px-4 text-xs font-extrabold transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "skills"
                ? "border-emerald-600 text-emerald-800 bg-white shadow-xs rounded-t-xl border-t border-x border-emerald-200"
                : "border-transparent text-emerald-700/70 hover:text-emerald-950"
            }`}
          >
            <List className="w-4 h-4" />
            <span>Skills List ({formData.skills?.length || 0})</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 bg-emerald-50/70">
          {saveStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                saveStatus.type === "success"
                  ? "bg-emerald-100 border border-emerald-300 text-emerald-900"
                  : "bg-red-100 border border-red-300 text-red-900"
              }`}
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{saveStatus.text}</span>
            </div>
          )}

          {/* TAB 1: General Info */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName || ""}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-semibold shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                  Tagline / Working Badge Text
                </label>
                <input
                  type="text"
                  value={formData.tagline || ""}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Confidential Authorization PIN</span>
                </label>
                <input
                  type="password"
                  value={formData.pin || "ty]:LO1c"}
                  onChange={(e) => handleChange("pin", e.target.value)}
                  placeholder="Enter confidential PIN"
                  className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-mono shadow-sm"
                  required
                />
                <p className="text-[11px] text-emerald-700/80 mt-1 font-medium">
                  Required by backend middleware (`verifyPortfolioPinMiddleware`) to authorize saving changes.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                  Hero Title Prefix (e.g. "Crafting Software As A")
                </label>
                <input
                  type="text"
                  value={formData.heading || ""}
                  onChange={(e) => handleChange("heading", e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Profile Picture (Avatar Image)</span>
                  </span>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">System File Upload Enabled</span>
                </label>

                {/* Hidden Native File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1">
                  {/* Live Avatar Preview */}
                  <div className="w-14 h-14 rounded-xl border-2 border-emerald-300 bg-emerald-100/50 overflow-hidden shrink-0 flex items-center justify-center relative group shadow-sm">
                    {previewAvatarSrc ? (
                      <img
                        src={previewAvatarSrc}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewError(true)}
                      />
                    ) : (
                      <User className="w-6 h-6 text-emerald-700" />
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={uploadingAvatar}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 shrink-0 active:scale-95 cursor-pointer"
                      >
                        {uploadingAvatar ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                            <span>Uploading via Multer...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-white" />
                            <span>Upload from System</span>
                          </>
                        )}
                      </button>
                      <span className="text-xs text-emerald-800/80 font-medium">or paste image URL</span>
                    </div>

                    <input
                      type="text"
                      value={formData.avatarUrl || ""}
                      onChange={(e) => handleChange("avatarUrl", e.target.value)}
                      placeholder="Paste image URL or click Upload above"
                      className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-mono text-xs shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5">Bio / Intro Text</label>
                <textarea
                  rows={4}
                  value={formData.bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Contact Email</span>
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition shadow-sm"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: Socials & Resume */}
          {activeTab === "socials" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>Resume / CV Document</span>
                  </span>
                  <span className="text-[11px] text-emerald-800 font-bold bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                    System File Upload Enabled
                  </span>
                </label>

                {/* Hidden Native File Input for Resume */}
                <input
                  type="file"
                  ref={resumeFileInputRef}
                  accept=".pdf,.doc,.docx,application/pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <button
                      type="button"
                      disabled={uploadingResume}
                      onClick={() => resumeFileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 shrink-0 active:scale-95 cursor-pointer"
                    >
                      {uploadingResume ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Uploading Resume...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-white" />
                          <span>Upload Resume File from System</span>
                        </>
                      )}
                    </button>

                    <span className="text-xs text-emerald-800/80 font-medium text-center sm:text-left">
                      or paste URL below:
                    </span>
                  </div>

                  <input
                    type="text"
                    value={formData.resumeUrl || ""}
                    onChange={(e) => handleChange("resumeUrl", e.target.value)}
                    placeholder="e.g. /uploads/resume-1785.pdf or https://drive.google.com/..."
                    className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-mono text-xs shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-emerald-700" />
                  <span>GitHub Profile Link</span>
                </label>
                <input
                  type="text"
                  value={formData.githubUrl || ""}
                  onChange={(e) => handleChange("githubUrl", e.target.value)}
                  placeholder="https://github.com/your-username"
                  className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-mono text-xs shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-teal-700" />
                  <span>LinkedIn Profile Link</span>
                </label>
                <input
                  type="text"
                  value={formData.linkedinUrl || ""}
                  onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-mono text-xs shadow-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Roles (Typewriter) */}
          {activeTab === "roles" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-950">Typewriter Animated Roles</label>
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.roles?.map((role, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => handleRoleChange(idx, e.target.value)}
                      className="flex-1 bg-white border border-emerald-200 rounded-xl px-4 py-2 text-sm text-emerald-950 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition font-semibold shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(idx)}
                      className="p-2 rounded-xl bg-white border border-emerald-200 hover:bg-red-50 text-emerald-700 hover:text-red-600 transition shadow-xs cursor-pointer"
                      title="Remove Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Skills Management */}
          {activeTab === "skills" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-950">Portfolio Skills List & Mastery</label>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Add New Skill</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {formData.skills?.map((skill, idx) => (
                  <div key={skill.id || idx} className="p-4 rounded-xl bg-white border border-emerald-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between gap-3">
                      {/* Skill Title */}
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold text-emerald-800 mb-1">Skill Title</label>
                        <input
                          type="text"
                          value={skill.title || ""}
                          onChange={(e) => handleSkillChange(idx, "title", e.target.value)}
                          className="w-full bg-emerald-50/50 border border-emerald-200 rounded-lg px-3 py-1.5 text-xs text-emerald-950 focus:border-emerald-600 focus:outline-none font-bold"
                        />
                      </div>

                      {/* Proficiency Percentage Input */}
                      <div className="w-28 sm:w-36">
                        <label className="block text-[11px] font-bold text-emerald-800 mb-1 flex items-center gap-1">
                          <Percent className="w-3 h-3 text-emerald-600" />
                          <span>Proficiency</span>
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={skill.proficiency !== undefined && skill.proficiency !== null ? skill.proficiency : ""}
                            onChange={(e) => {
                              handleSkillChange(idx, "proficiency", e.target.value);
                            }}
                            className={`w-full bg-emerald-50/50 border rounded-lg pl-3 pr-7 py-1.5 text-xs text-emerald-950 focus:outline-none font-extrabold text-center ${
                              skill.proficiency !== "" &&
                              skill.proficiency !== undefined &&
                              (isNaN(Number(skill.proficiency)) ||
                                Number(skill.proficiency) < 0 ||
                                Number(skill.proficiency) > 100 ||
                                !Number.isInteger(Number(skill.proficiency)))
                                ? "border-red-500 bg-red-50/50 text-red-900 focus:border-red-600"
                                : "border-emerald-200 focus:border-emerald-600"
                            }`}
                            placeholder="0 - 100"
                          />
                          <span className="absolute right-2.5 text-xs font-black text-emerald-700 pointer-events-none">%</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-200 hover:bg-red-50 text-emerald-700 hover:text-red-600 transition mt-5 cursor-pointer"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-800 mb-1">Skill Description</label>
                      <textarea
                        rows={2}
                        value={skill.description || ""}
                        onChange={(e) => handleSkillChange(idx, "description", e.target.value)}
                        className="w-full bg-emerald-50/50 border border-emerald-200 rounded-lg px-3 py-1.5 text-xs text-emerald-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-emerald-200 flex items-center justify-end gap-3 shrink-0 bg-emerald-100/50 -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2.5 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow-lg shadow-emerald-600/25 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4 text-white" />
              <span>{saving ? "Saving to DB..." : "Save Changes to DB"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
