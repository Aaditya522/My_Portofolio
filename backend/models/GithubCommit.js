import mongoose from "mongoose";

const githubCommitSchema = new mongoose.Schema(
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
    sha: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    shortSha: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      default: "Unknown",
    },
    authorLogin: {
      type: String,
      default: null,
      index: true,
    },
    authorEmail: {
      type: String,
      default: null,
    },
    authorAvatarUrl: {
      type: String,
      default: null,
    },
    commitDate: {
      type: Date,
      required: true,
      index: true,
    },
    additions: {
      type: Number,
      default: 0,
    },
    deletions: {
      type: Number,
      default: 0,
    },
    filesChangedCount: {
      type: Number,
      default: 0,
    },
    branches: [
      {
        type: String,
        index: true,
      },
    ],
    htmlUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

githubCommitSchema.index({ workspaceId: 1, repo: 1, sha: 1 }, { unique: true });

const GithubCommit = mongoose.model("GithubCommit", githubCommitSchema);

export default GithubCommit;
