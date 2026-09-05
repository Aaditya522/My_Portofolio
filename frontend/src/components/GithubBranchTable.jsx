import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GitBranch,
  FolderGit2,
  Plus,
  Trash2,
  X,
  Search,
  CheckCircle2,
  GitMerge,
  Loader2,
  Link2,
} from "lucide-react";

export default function GithubBranchTable({ tasks = [] }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    repo: "",
    branchName: "",
    status: "Active",
    taskId: "",
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/github-branches");
      setBranches(res.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!formData.repo.trim() || !formData.branchName.trim()) return;

    try {
      setSubmitting(true);
      await axios.post("/api/github-branches", {
        repo: formData.repo,
        branchName: formData.branchName,
        status: formData.status,
        taskId: formData.taskId || null,
      });
      setFormData({ repo: "", branchName: "", status: "Active", taskId: "" });
      setShowModal(false);
      fetchBranches();
    } catch (error) {
      console.error("Error creating branch:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!window.confirm("Delete this branch record?")) return;
    try {
      await axios.delete(`/api/github-branches/${branchId}`);
      fetchBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  const filteredBranches = branches.filter(
    (b) =>
      b.repo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.branchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Merged":
        return "bg-teal-500/15 text-teal-300 border-teal-500/30";
      case "Draft":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-800">
      {/* Table Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            Local GitHub Branches Tracker
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Log active Git branches and link them directly to specific task cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Branch</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            <span>Loading branch records...</span>
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No local Git branches logged yet. Click "Log Branch" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Repository</th>
                  <th className="px-5 py-3.5">Branch Name</th>
                  <th className="px-5 py-3.5">Linked Task</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBranches.map((branch) => (
                  <tr key={branch._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4 font-semibold text-slate-200 flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{branch.repo}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-purple-300">
                      <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 inline-flex items-center gap-1.5">
                        <GitBranch className="w-3 h-3 text-purple-400" />
                        {branch.branchName}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {branch.taskId ? (
                        <span className="inline-flex items-center gap-1 text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md font-medium">
                          <Link2 className="w-3 h-3 text-indigo-400" />
                          {typeof branch.taskId === "object" ? branch.taskId.title : "Linked Task"}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs italic">Unlinked</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getStatusBadge(branch.status)}`}>
                        {branch.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {new Date(branch.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDeleteBranch(branch._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                        title="Delete Branch Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Branch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg">Log Local Git Branch</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Repository Name *
                </label>
                <input
                  type="text"
                  value={formData.repo}
                  onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                  placeholder="e.g. Portfolio"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  placeholder="e.g. feature/jwt-auth"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Link to Specific Task (Dropdown Selector)
                </label>
                <select
                  value={formData.taskId}
                  onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">-- No Linked Task (Optional) --</option>
                  {tasks.map((task) => (
                    <option key={task._id} value={task._id}>
                      {task.title} [{task.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Branch Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Active">Active</option>
                  <option value="Merged">Merged</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md"
                >
                  {submitting ? "Saving..." : "Log Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
