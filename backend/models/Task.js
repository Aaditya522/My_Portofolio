import mongoose from "mongoose";

const sqlAttachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    content: { type: String, default: "" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: [true, "Workspace ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
    },
    branchName: {
      type: String,
      trim: true,
      default: "",
    },
    sqlAttachments: [sqlAttachmentSchema],
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
