import express from "express";
import {
  createContactMessage,
  getContactMessages,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route to submit contact message
router.post("/", createContactMessage);

// Protected routes to view and delete messages
router.get("/", protect, getContactMessages);
router.delete("/:id", protect, deleteContactMessage);

export default router;
