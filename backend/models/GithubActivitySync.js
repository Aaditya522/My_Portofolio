import mongoose from "mongoose";

const githubActivitySyncSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lastSyncStatus: {
      type: String,
      enum: ["SUCCESS", "ERROR", "IN_PROGRESS"],
      default: "SUCCESS",
    },
    lastSyncTime: {
      type: Date,
      default: Date.now,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    branchCount: {
      type: Number,
      default: 0,
    },
    commitCount: {
      type: Number,
      default: 0,
    },
    configuredUsername: {
      type: String,
      default: null,
    },
    configuredPrefix: {
      type: String,
      default: null,
    },
    configuredRepo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const GithubActivitySync = mongoose.model(
  "GithubActivitySync",
  githubActivitySyncSchema
);

export default GithubActivitySync;
