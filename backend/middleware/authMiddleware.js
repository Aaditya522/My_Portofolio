
export const protect = async (req, res, next) => {
  const workspaceId =
    req.headers["x-workspace-id"] ||
    req.headers["workspace-id"] ||
    req.query?.workspaceId ||
    req.body?.workspaceId;

  if (workspaceId && typeof workspaceId === "string" && workspaceId.trim() !== "") {
    req.workspaceId = workspaceId.trim();
    return next();
  }

  return res
    .status(401)
    .json({ message: "Workspace ID is required to access workspace resources" });
};

