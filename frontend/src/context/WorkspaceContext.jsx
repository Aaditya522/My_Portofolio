import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaceId, setWorkspaceId] = useState(
    () => localStorage.getItem("workspaceId") || ""
  );

  const [savedWorkspaces, setSavedWorkspaces] = useState(() => {
    try {
      const stored = localStorage.getItem("savedWorkspaces");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (workspaceId) {
      axios.defaults.headers.common["x-workspace-id"] = workspaceId;
      localStorage.setItem("workspaceId", workspaceId);

      // Save to history of saved workspaces
      setSavedWorkspaces((prev) => {
        const filtered = prev.filter((id) => id !== workspaceId);
        const updated = [workspaceId, ...filtered].slice(0, 10);
        localStorage.setItem("savedWorkspaces", JSON.stringify(updated));
        return updated;
      });
    } else {
      delete axios.defaults.headers.common["x-workspace-id"];
      localStorage.removeItem("workspaceId");
    }
  }, [workspaceId]);

  // Helper to generate a clean, random unique Workspace ID
  const generateNewWorkspaceId = () => {
    const randomHex = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 6);
    return `ws_${randomHex}`;
  };

  // Enter or create a custom workspace by ID
  const enterWorkspace = (id) => {
    const cleanId = id ? id.trim() : "";
    if (!cleanId) {
      return { success: false, error: "Please enter a valid Workspace ID" };
    }
    if (cleanId.length < 3) {
      return { success: false, error: "Workspace ID must be at least 3 characters long" };
    }
    setWorkspaceId(cleanId);
    return { success: true, workspaceId: cleanId };
  };

  // Remove a workspace ID from saved list
  const removeSavedWorkspace = (idToRemove) => {
    setSavedWorkspaces((prev) => {
      const updated = prev.filter((id) => id !== idToRemove);
      localStorage.setItem("savedWorkspaces", JSON.stringify(updated));
      return updated;
    });
  };

  // Switch or clear active workspace
  const leaveWorkspace = () => {
    setWorkspaceId("");
    localStorage.removeItem("workspaceId");
    delete axios.defaults.headers.common["x-workspace-id"];
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceId,
        hasWorkspace: !!workspaceId,
        savedWorkspaces,
        enterWorkspace,
        generateNewWorkspaceId,
        removeSavedWorkspace,
        leaveWorkspace,
        // Compatibility aliases for previous auth context consumers
        isAuthenticated: !!workspaceId,
        user: workspaceId ? { name: `Workspace: ${workspaceId}`, id: workspaceId } : null,
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

// Export useAuth alias so legacy components gracefully transition
export const useAuth = useWorkspace;
