import express from "express";
import {
  getGithubActivityBranches,
  getGithubBranchCommits,
  getCommitFiles,
  syncGithubActivity,
  getGithubSyncStatus,
} from "../controllers/githubActivityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply workspace auth middleware to all activity endpoints
router.use(protect);

router.get("/branches", getGithubActivityBranches);
router.get("/branches/:branchName/commits", getGithubBranchCommits);
router.get("/commits/:sha/files", getCommitFiles);
router.post("/sync", syncGithubActivity);
router.get("/sync-status", getGithubSyncStatus);

export default router;
