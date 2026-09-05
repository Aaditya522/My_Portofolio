import mongoose from "mongoose";

const githubCommitFileSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: [true, "Workspace ID is required"],
      index: true,
    },
    commitSha: {
      type: String,
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    changeType: {
      type: String,
      enum: ["added", "modified", "deleted", "renamed"],
      default: "modified",
    },
    additions: {
      type: Number,
      default: 0,
    },
    deletions: {
      type: Number,
      default: 0,
    },
    changes: {
      type: Number,
      default: 0,
    },
    patch: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

githubCommitFileSchema.index({ workspaceId: 1, commitSha: 1, filename: 1 });

const GithubCommitFile = mongoose.model(
  "GithubCommitFile",
  githubCommitFileSchema
);

export default GithubCommitFile;
