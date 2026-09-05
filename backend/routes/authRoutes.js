import express from "express";
import { verifyToken } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/verify", protect, verifyToken);

export default router;

