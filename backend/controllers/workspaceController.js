import jwt from "jsonwebtoken";
import Workspace from "../models/Workspace.js";

// Helper to generate JWT workspace token
const generateWorkspaceToken = (workspaceId) => {
  return jwt.sign(
    { workspaceId },
    process.env.JWT_SECRET || "supersecretkey_portfolio_123",
    { expiresIn: "7d" }
  );
};

// @desc    Create a new password-protected workspace
// @route   POST /api/workspaces/create
// @access  Public
export const createWorkspace = async (req, res) => {
  try {
    const { workspaceId, password, confirmPassword } = req.body;

    if (!workspaceId || typeof workspaceId !== "string" || !workspaceId.trim()) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const cleanWorkspaceId = workspaceId.trim().toLowerCase();

    if (cleanWorkspaceId.length < 3) {
      return res.status(400).json({
        message: "Workspace ID must be at least 3 characters long",
      });
    }

    if (!/^[a-z0-9_-]+$/.test(cleanWorkspaceId)) {
      return res.status(400).json({
        message: "Workspace ID can only contain lowercase letters, numbers, hyphens, and underscores",
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 4) {
      return res.status(400).json({
        message: "Password must be at least 4 characters long",
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({ message: "Confirm password is required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match. Please verify both password fields.",
      });
    }

    // Check if workspace already exists
    const existing = await Workspace.findOne({ workspaceId: cleanWorkspaceId });
    if (existing) {
      return res.status(400).json({
        message: "Workspace ID already exists. Please pick a unique ID or unlock the existing one.",
      });
    }

    // Create and save new workspace (password is hashed in pre-save hook)
    const newWorkspace = await Workspace.create({
      workspaceId: cleanWorkspaceId,
      password,
    });

    const token = generateWorkspaceToken(newWorkspace.workspaceId);

    return res.status(201).json({
      success: true,
      message: "Workspace created and protected successfully",
      workspaceId: newWorkspace.workspaceId,
      token,
    });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return res.status(500).json({
      message: error.message || "Failed to create workspace",
    });
  }
};

// @desc    Unlock/Authenticate access to an existing workspace
// @route   POST /api/workspaces/unlock
// @access  Public
export const unlockWorkspace = async (req, res) => {
  try {
    const { workspaceId, password } = req.body;

    if (!workspaceId || typeof workspaceId !== "string" || !workspaceId.trim()) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is required to unlock workspace" });
    }

    const cleanWorkspaceId = workspaceId.trim().toLowerCase();

    const workspace = await Workspace.findOne({ workspaceId: cleanWorkspaceId });
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found. Please check your Workspace ID or create a new one.",
      });
    }

    const isMatch = await workspace.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect workspace password. Access denied.",
      });
    }

    const token = generateWorkspaceToken(workspace.workspaceId);

    return res.json({
      success: true,
      message: "Workspace unlocked successfully",
      workspaceId: workspace.workspaceId,
      token,
    });
  } catch (error) {
    console.error("Error unlocking workspace:", error);
    return res.status(500).json({
      message: error.message || "Failed to unlock workspace",
    });
  }
};

// @desc    Check workspace status (exists and protected)
// @route   GET /api/workspaces/status/:workspaceId
// @access  Public
export const getWorkspaceStatus = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const cleanWorkspaceId = workspaceId.trim().toLowerCase();
    const workspace = await Workspace.findOne({ workspaceId: cleanWorkspaceId });

    return res.json({
      workspaceId: cleanWorkspaceId,
      exists: !!workspace,
      isProtected: !!workspace,
    });
  } catch (error) {
    console.error("Error checking workspace status:", error);
    return res.status(500).json({
      message: error.message || "Failed to check workspace status",
    });
  }
};

// @desc    Verify active workspace session/token
// @route   GET /api/workspaces/verify
// @access  Private (Requires valid JWT workspace token)
export const verifyWorkspaceSession = async (req, res) => {
  try {
    return res.json({
      valid: true,
      workspaceId: req.workspaceId,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Session verification failed",
    });
  }
};
