import mongoose from "mongoose";

const githubBranchSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: [true, "Workspace ID is required"],
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    repo: {
      type: String,
      required: [true, "Repository name is required"],
      trim: true,
    },
    branchName: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const GithubBranch = mongoose.model("GithubBranch", githubBranchSchema);
export default GithubBranch;
