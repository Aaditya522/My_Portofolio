import GithubBranch from "../models/GithubBranch.js";

// @desc    Get all GitHub branches for workspace
// @route   GET /api/github-branches
// @access  Private
export const getGithubBranches = async (req, res) => {
  try {
    const branches = await GithubBranch.find({ workspaceId: req.workspaceId })
      .populate("taskId", "title status priority")
      .sort({ createdAt: -1 });
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch branches" });
  }
};

// @desc    Get single branch by ID
// @route   GET /api/github-branches/:id
// @access  Private
export const getGithubBranchById = async (req, res) => {
  try {
    const branch = await GithubBranch.findOne({ _id: req.params.id, workspaceId: req.workspaceId })
      .populate("taskId", "title status priority");
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch branch" });
  }
};

// @desc    Create new branch record
// @route   POST /api/github-branches
// @access  Private
export const createGithubBranch = async (req, res) => {
  try {
    const { taskId, repo, branchName, status } = req.body;
    if (!repo || !branchName) {
      return res.status(400).json({ message: "Repo and branch name are required" });
    }

    const branch = await GithubBranch.create({
      workspaceId: req.workspaceId,
      taskId: taskId || null,
      repo,
      branchName,
      status,
    });

    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create branch record" });
  }
};

// @desc    Update branch record
// @route   PUT /api/github-branches/:id
// @access  Private
export const updateGithubBranch = async (req, res) => {
  try {
    const branch = await GithubBranch.findOneAndUpdate(
      { _id: req.params.id, workspaceId: req.workspaceId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!branch) {
      return res.status(404).json({ message: "Branch record not found or unauthorized" });
    }

    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update branch record" });
  }
};

// @desc    Delete branch record
// @route   DELETE /api/github-branches/:id
// @access  Private
export const deleteGithubBranch = async (req, res) => {
  try {
    const branch = await GithubBranch.findOneAndDelete({ _id: req.params.id, workspaceId: req.workspaceId });

    if (!branch) {
      return res.status(404).json({ message: "Branch record not found or unauthorized" });
    }

    res.json({ message: "Branch record removed successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete branch record" });
  }
};

