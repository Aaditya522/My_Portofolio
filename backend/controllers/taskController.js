import Task from "../models/Task.js";

// @desc    Get all tasks for workspace
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ workspaceId: req.workspaceId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch tasks" });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, workspaceId: req.workspaceId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch task" });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, status, priority, dueDate, branchName, sqlAttachments } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      workspaceId: req.workspaceId,
      title,
      status,
      priority,
      dueDate,
      branchName: branchName ? branchName.trim() : "",
      sqlAttachments: Array.isArray(sqlAttachments) ? sqlAttachments : [],
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create task" });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { title, status, priority, dueDate, branchName, sqlAttachments } = req.body;

    const task = await Task.findOne({ _id: req.params.id, workspaceId: req.workspaceId });

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    if (title !== undefined) task.title = title;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (branchName !== undefined) task.branchName = branchName;
    if (sqlAttachments !== undefined) {
      task.sqlAttachments = Array.isArray(sqlAttachments) ? sqlAttachments : [];
      task.markModified("sqlAttachments");
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update task" });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, workspaceId: req.workspaceId });

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.json({ message: "Task removed successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete task" });
  }
};

