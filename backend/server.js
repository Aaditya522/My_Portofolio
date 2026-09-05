import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import githubBranchRoutes from "./routes/githubBranchRoutes.js";
import githubActivityRoutes from "./routes/githubActivityRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import portfolioProfileRoutes from "./routes/portfolioProfileRoutes.js";

import path from "path";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static uploads directory for avatar files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Base Route
app.get("/", (req, res) => {
  res.json({ message: "MERN Portfolio Backend API Server", status: "OK" });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/github-branches", githubBranchRoutes);
app.use("/api/github-activity", githubActivityRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/portfolio-profile", portfolioProfileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});