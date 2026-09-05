// @desc    Verify current workspace ID session
// @route   GET /api/auth/verify
// @access  Private
export const verifyToken = async (req, res) => {
  try {
    if (!req.workspaceId) {
      return res.status(401).json({ message: "Workspace ID missing" });
    }
    res.json({
      workspaceId: req.workspaceId,
      active: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

