import express from "express";
import {
  createWorkspace,
  unlockWorkspace,
  getWorkspaceStatus,
  verifyWorkspaceSession,
} from "../controllers/workspaceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes for workspace lifecycle
router.post("/create", createWorkspace);
router.post("/unlock", unlockWorkspace);
router.get("/status/:workspaceId", getWorkspaceStatus);

// Protected route to verify active token session
router.get("/verify", protect, verifyWorkspaceSession);

export default router;
