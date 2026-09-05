import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaceId, setWorkspaceId] = useState(
    () => localStorage.getItem("workspaceId") || ""
  );

  // By design, a workspace starts locked on page load / browser refresh.
  // The user must enter and verify their workspace password to unlock it.
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [workspaceToken, setWorkspaceToken] = useState(null);

  const [savedWorkspaces, setSavedWorkspaces] = useState(() => {
    try {
      const stored = localStorage.getItem("savedWorkspaces");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync token with axios default headers
  useEffect(() => {
    if (isUnlocked && workspaceToken && workspaceId) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${workspaceToken}`;
      axios.defaults.headers.common["x-workspace-token"] = workspaceToken;
      axios.defaults.headers.common["x-workspace-id"] = workspaceId;
      localStorage.setItem("workspaceId", workspaceId);

      // Save to recent workspaces history
      setSavedWorkspaces((prev) => {
        const filtered = prev.filter((id) => id !== workspaceId);
        const updated = [workspaceId, ...filtered].slice(0, 10);
        localStorage.setItem("savedWorkspaces", JSON.stringify(updated));
        return updated;
      });
    } else {
      delete axios.defaults.headers.common["Authorization"];
      delete axios.defaults.headers.common["x-workspace-token"];
      delete axios.defaults.headers.common["x-workspace-id"];
    }
  }, [isUnlocked, workspaceToken, workspaceId]);

  // Helper to generate a clean, random unique Workspace ID
  const generateNewWorkspaceId = () => {
    const randomHex =
      Math.random().toString(36).substring(2, 9) +
      Math.random().toString(36).substring(2, 6);
    return `ws_${randomHex}`;
  };

  // Create a new password-protected workspace
  const createWorkspace = async (targetId, password, confirmPassword) => {
    const cleanId = targetId ? targetId.trim().toLowerCase() : "";
    if (!cleanId) {
      return { success: false, error: "Please enter a valid Workspace ID" };
    }
    if (cleanId.length < 3) {
      return { success: false, error: "Workspace ID must be at least 3 characters long" };
    }
    if (!password) {
      return { success: false, error: "Password is required" };
    }
    if (password.length < 4) {
      return { success: false, error: "Password must be at least 4 characters long" };
    }
    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match. Please verify both password fields." };
    }

    try {
      const res = await axios.post("/api/workspaces/create", {
        workspaceId: cleanId,
        password,
        confirmPassword,
      });

      if (res.data && res.data.token) {
        setWorkspaceId(res.data.workspaceId);
        setWorkspaceToken(res.data.token);
        setIsUnlocked(true);
        return { success: true, workspaceId: res.data.workspaceId };
      }
      return { success: false, error: "Failed to obtain workspace authorization" };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to create workspace";
      return { success: false, error: errorMsg };
    }
  };

  // Unlock an existing workspace with password
  const unlockWorkspace = async (targetId, password) => {
    const cleanId = targetId ? targetId.trim().toLowerCase() : "";
    if (!cleanId) {
      return { success: false, error: "Please enter a valid Workspace ID" };
    }
    if (!password) {
      return { success: false, error: "Please enter the workspace password" };
    }

    try {
      const res = await axios.post("/api/workspaces/unlock", {
        workspaceId: cleanId,
        password,
      });

      if (res.data && res.data.token) {
        setWorkspaceId(res.data.workspaceId);
        setWorkspaceToken(res.data.token);
        setIsUnlocked(true);
        return { success: true, workspaceId: res.data.workspaceId };
      }
      return { success: false, error: "Failed to unlock workspace" };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Incorrect password or workspace error";
      return { success: false, error: errorMsg };
    }
  };

  // Set selected workspace without unlocking (used when preparing to unlock)
  const selectWorkspace = (id) => {
    const cleanId = id ? id.trim().toLowerCase() : "";
    setWorkspaceId(cleanId);
    setIsUnlocked(false);
    setWorkspaceToken(null);
  };

  // Lock the active workspace (forces password entry)
  const lockWorkspace = () => {
    setIsUnlocked(false);
    setWorkspaceToken(null);
  };

  // Switch or clear active workspace entirely
  const leaveWorkspace = () => {
    setIsUnlocked(false);
    setWorkspaceToken(null);
    setWorkspaceId("");
    localStorage.removeItem("workspaceId");
  };

  // Remove a workspace ID from saved history list
  const removeSavedWorkspace = (idToRemove) => {
    setSavedWorkspaces((prev) => {
      const updated = prev.filter((id) => id !== idToRemove);
      localStorage.setItem("savedWorkspaces", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceId,
        isUnlocked,
        hasWorkspace: !!workspaceId,
        savedWorkspaces,
        createWorkspace,
        unlockWorkspace,
        selectWorkspace,
        lockWorkspace,
        leaveWorkspace,
        generateNewWorkspaceId,
        removeSavedWorkspace,
        // Compatibility aliases for legacy components
        isAuthenticated: !!workspaceId && isUnlocked,
        user:
          workspaceId && isUnlocked
            ? { name: `Workspace: ${workspaceId}`, id: workspaceId }
            : null,
        logout: leaveWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};

// Export useAuth alias so existing components transition smoothly
export const useAuth = useWorkspace;
