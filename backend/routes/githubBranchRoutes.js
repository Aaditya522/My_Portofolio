import express from "express";
import {
  getGithubBranches,
  getGithubBranchById,
  createGithubBranch,
  updateGithubBranch,
  deleteGithubBranch,
} from "../controllers/githubBranchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Protect all github branch routes

router.route("/").get(getGithubBranches).post(createGithubBranch);
router.route("/:id").get(getGithubBranchById).put(updateGithubBranch).delete(deleteGithubBranch);

export default router;
