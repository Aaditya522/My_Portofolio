import GithubActivityBranch from "../models/GithubActivityBranch.js";
import GithubCommit from "../models/GithubCommit.js";
import GithubCommitFile from "../models/GithubCommitFile.js";
import GithubActivitySync from "../models/GithubActivitySync.js";
import { syncGithubActivityForWorkspace } from "../services/githubSyncService.js";

// @desc    Get all GitHub activity branches for workspace
// @route   GET /api/github-activity/branches
// @access  Private
export const getGithubActivityBranches = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = { workspaceId: req.workspaceId };

    if (status && status !== "ALL") {
      filter.status = status.toUpperCase();
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { branchName: regex },
        { repo: regex },
        { prTitle: regex },
        { targetBranch: regex },
      ];
    }

    const branches = await GithubActivityBranch.find(filter).sort({
      latestCommitDate: -1,
      updatedAt: -1,
      createdAt: -1,
    });

    res.json(branches);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch GitHub branches" });
  }
};

// @desc    Get commits for a specific branch
// @route   GET /api/github-activity/branches/:branchName/commits
// @access  Private
export const getGithubBranchCommits = async (req, res) => {
  try {
    const { branchName } = req.params;
    const decodedBranchName = decodeURIComponent(branchName);

    const commits = await GithubCommit.find({
      workspaceId: req.workspaceId,
      branches: decodedBranchName,
    }).sort({ commitDate: -1 });

    res.json(commits);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch branch commits" });
  }
};

// @desc    Get changed files and diffs for a specific commit SHA
// @route   GET /api/github-activity/commits/:sha/files
// @access  Private
export const getCommitFiles = async (req, res) => {
  try {
    const { sha } = req.params;

    const files = await GithubCommitFile.find({
      workspaceId: req.workspaceId,
      commitSha: sha,
    });

    res.json(files);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch commit file diffs" });
  }
};

// @desc    Trigger sync of GitHub activity
// @route   POST /api/github-activity/sync
// @access  Private
export const syncGithubActivity = async (req, res) => {
  try {
    const result = await syncGithubActivityForWorkspace(
      req.workspaceId,
      req.body || {}
    );
    res.json({
      message: "GitHub activity synced successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to sync GitHub activity",
    });
  }
};

// @desc    Get sync status and last sync timestamp
// @route   GET /api/github-activity/sync-status
// @access  Private
export const getGithubSyncStatus = async (req, res) => {
  try {
    let syncInfo = await GithubActivitySync.findOne({
      workspaceId: req.workspaceId,
    });

    if (!syncInfo) {
      syncInfo = {
        workspaceId: req.workspaceId,
        lastSyncStatus: "NEVER",
        lastSyncTime: null,
        branchCount: 0,
        commitCount: 0,
        configuredUsername: process.env.GITHUB_USERNAME || "Aaditya522",
        configuredPrefix: process.env.GITHUB_BRANCH_PREFIX || "aaditya",
        configuredRepo: `${process.env.GITHUB_OWNER || "bhawanbaweja"}/${process.env.GITHUB_REPOSITORY || "kits-staging-new"}`,
      };
    }

    res.json(syncInfo);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch sync status" });
  }
};
