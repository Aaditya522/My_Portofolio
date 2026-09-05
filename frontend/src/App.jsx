import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useWorkspace } from "./context/WorkspaceContext";
import Portfolio from "./pages/Portfolio";
import WorkspaceAccess from "./pages/WorkspaceAccess";
import DashboardLayout from "./layouts/DashboardLayout";
import WorkWorkspace from "./pages/WorkWorkspace";
import WorkspaceUnlockModal from "./components/WorkspaceUnlockModal";

function FaviconManager() {
  const location = useLocation();

  useEffect(() => {
    const isWorkspace =
      location.pathname.startsWith("/workspace") ||
      location.pathname.startsWith("/dashboard");

    const targetIcon = isWorkspace ? "/ws-favicon.svg" : "/mp-favicon.svg";

    const iconLinks = document.querySelectorAll("link[rel*='icon']");
    if (iconLinks.length > 0) {
      iconLinks.forEach((link) => {
        link.href = targetIcon;
      });
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = targetIcon;
      document.head.appendChild(link);
    }
  }, [location]);

  return null;
}

function ProtectedRoute({ children }) {
  const { hasWorkspace, isUnlocked } = useWorkspace();

  if (!hasWorkspace) {
    return <Navigate to="/workspace" replace />;
  }

  if (!isUnlocked) {
    return <WorkspaceUnlockModal />;
  }

  return children;
}

export default function App() {
  return (
    <>
      <FaviconManager />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Portfolio />} />

        {/* Workspace Access Entry Page */}
        <Route path="/workspace" element={<WorkspaceAccess />} />
        <Route path="/login" element={<Navigate to="/workspace" replace />} />
        <Route path="/register" element={<Navigate to="/workspace" replace />} />

        {/* Protected Workspaces */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/work" replace />} />
          <Route path="work" element={<WorkWorkspace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

