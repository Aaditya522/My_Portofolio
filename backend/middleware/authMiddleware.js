import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header for Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers["x-workspace-token"]) {
      token = req.headers["x-workspace-token"];
    }

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Workspace is locked and requires password authentication.",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey_portfolio_123"
    );

    if (!decoded || !decoded.workspaceId) {
      return res.status(401).json({
        message: "Invalid workspace token payload.",
      });
    }

    // Attach verified workspaceId to request object
    req.workspaceId = decoded.workspaceId.trim().toLowerCase();
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Workspace session has expired. Please unlock the workspace again.",
      });
    }
    return res.status(401).json({
      message: "Workspace authentication failed. Invalid token.",
    });
  }
};
