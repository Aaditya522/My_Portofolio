import express from "express";
import {
  getPortfolioProfile,
  updatePortfolioProfile,
  uploadAvatarImage,
  uploadResumeFile,
} from "../controllers/portfolioProfileController.js";
import { verifyPortfolioPinMiddleware } from "../middleware/portfolioPinMiddleware.js";
import { uploadAvatar, uploadResume } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getPortfolioProfile);
router.post("/verify-pin", verifyPortfolioPinMiddleware, (req, res) => {
  res.json({ success: true, message: "PIN verified successfully" });
});
router.post(
  "/upload-avatar",
  verifyPortfolioPinMiddleware,
  uploadAvatar.single("avatar"),
  uploadAvatarImage
);
router.post(
  "/upload-resume",
  verifyPortfolioPinMiddleware,
  uploadResume.single("resume"),
  uploadResumeFile
);
router.put("/", verifyPortfolioPinMiddleware, updatePortfolioProfile);

export default router;
