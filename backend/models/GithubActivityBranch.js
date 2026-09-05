import mongoose from "mongoose";

const githubActivityBranchSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: [true, "Workspace ID is required"],
      index: true,
    },
    repo: {
      type: String,
      required: true,
      trim: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "MERGED", "CLOSED"],
      default: "ACTIVE",
    },
    targetBranch: {
      type: String,
      default: null,
    },
    prNumber: {
      type: Number,
      default: null,
    },
    prTitle: {
      type: String,
      default: null,
    },
    prUrl: {
      type: String,
      default: null,
    },
    prStatus: {
      type: String,
      default: null,
    },
    mergedBy: {
      type: String,
      default: null,
    },
    mergedAt: {
      type: Date,
      default: null,
    },
    commitCount: {
      type: Number,
      default: 0,
    },
    totalAdditions: {
      type: Number,
      default: 0,
    },
    totalDeletions: {
      type: Number,
      default: 0,
    },
    totalFilesChanged: {
      type: Number,
      default: 0,
    },
    latestCommitDate: {
      type: Date,
      default: null,
    },
    headCommitSha: {
      type: String,
      default: null,
    },
    firstCommitDate: {
      type: Date,
      default: null,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

githubActivityBranchSchema.index({ workspaceId: 1, repo: 1, branchName: 1 }, { unique: true });

const GithubActivityBranch = mongoose.model(
  "GithubActivityBranch",
  githubActivityBranchSchema
);

export default GithubActivityBranch;
