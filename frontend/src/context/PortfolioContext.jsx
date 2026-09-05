import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const PortfolioContext = createContext();

const defaultProfileState = {
  fullName: "Aaditya Bansal",
  tagline: "Software Engineering Intern & Full Stack Developer",
  heading: "Crafting Software As A",
  bio: "4th Year B.Tech CSE Student passionate about building scalable web apps, MERN stack solutions, and AI-powered developer workflows.",
  roles: [
    "Software Engineering Intern",
    "4th Year B.Tech CSE Student",
    "MERN Stack & LLM Developer",
  ],
  resumeUrl: "#",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  email: "aadityabansal522@gmail.com",
  avatarUrl: "",
  skills: [],
  projects: [],
};

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState(defaultProfileState);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'edit_portfolio' | 'add_project'
  const [verifiedPin, setVerifiedPin] = useState(sessionStorage.getItem("portfolio_verified_pin") || "");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/portfolio-profile");
      if (res.data) {
        setProfile({
          ...res.data,
          projects: res.data.projects || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch portfolio profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const verifyPin = async (pinToTest) => {
    try {
      const res = await axios.post(
        "/api/portfolio-profile/verify-pin",
        {},
        {
          headers: {
            "x-portfolio-pin": pinToTest,
          },
        }
      );

      if (res.data?.success) {
        setVerifiedPin(pinToTest);
        sessionStorage.setItem("portfolio_verified_pin", pinToTest);
        setIsPinModalOpen(false);

        // Execute pending action after PIN validation
        if (pendingAction === "add_project") {
          setIsAddProjectModalOpen(true);
        } else if (pendingAction === "edit_portfolio") {
          setIsEditModalOpen(true);
        }
        setPendingAction(null);
        return { success: true };
      }
      return { success: false, message: "Invalid PIN" };
    } catch (error) {
      const message = error.response?.data?.message || "Unauthorized: Invalid confidential PIN";
      return { success: false, message };
    }
  };

  const requestPinProtectedAction = (actionType) => {
    // If PIN is already stored in sessionStorage / verified, test or open directly
    if (verifiedPin) {
      if (actionType === "add_project") {
        setIsAddProjectModalOpen(true);
      } else if (actionType === "edit_portfolio") {
        setIsEditModalOpen(true);
      }
    } else {
      setPendingAction(actionType);
      setIsPinModalOpen(true);
    }
  };

  const openEditModal = () => {
    requestPinProtectedAction("edit_portfolio");
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const [editingProject, setEditingProject] = useState(null);

  const openAddProjectModal = () => {
    setEditingProject(null);
    requestPinProtectedAction("add_project");
  };

  const openEditProjectModal = (project) => {
    setEditingProject(project);
    requestPinProtectedAction("add_project");
  };

  const closeAddProjectModal = () => {
    setIsAddProjectModalOpen(false);
    setEditingProject(null);
  };

  const openPinModal = (targetAction = "edit_portfolio") => {
    setPendingAction(targetAction);
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPendingAction(null);
  };

  const [notification, setNotification] = useState(null); // { message: string, type: 'success' | 'error' }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const updateProfile = async (updatedData, customPin) => {
    try {
      const pinToUse = customPin || updatedData.pin || verifiedPin || "ty]:LO1c";
      sessionStorage.setItem("portfolio_verified_pin", pinToUse);
      setVerifiedPin(pinToUse);

      const res = await axios.put("/api/portfolio-profile", updatedData, {
        headers: {
          "x-portfolio-pin": pinToUse,
        },
      });
      setProfile(res.data);
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save portfolio changes";
      showNotification(message, "error");
      return { success: false, error: message };
    }
  };

  const addProject = async (projectData) => {
    try {
      const newProject = {
        id: `proj_${Date.now()}`,
        title: projectData.title || "Untitled Project",
        category: projectData.category || "Full Stack Application",
        description: projectData.description || "",
        features: Array.isArray(projectData.features)
          ? projectData.features
          : (projectData.features || "").split("\n").filter((f) => f.trim()),
        techStack: Array.isArray(projectData.techStack)
          ? projectData.techStack
          : (projectData.techStack || "").split(",").map((t) => t.trim()).filter(Boolean),
        githubUrl: projectData.githubUrl || "https://github.com",
        demoUrl: projectData.demoUrl || "/login",
      };

      const updatedProjects = [...(profile.projects || []), newProject];
      const updatedProfileData = {
        ...profile,
        projects: updatedProjects,
      };

      const result = await updateProfile(updatedProfileData);
      if (result.success) {
        showNotification(`Project "${newProject.title}" added successfully to portfolio!`, "success");
      }
      return result;
    } catch (error) {
      const msg = error.message || "Failed to add project";
      showNotification(msg, "error");
      return { success: false, error: msg };
    }
  };

  const editProject = async (projectId, projectData) => {
    try {
      const updatedProjects = (profile.projects || []).map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            title: projectData.title || p.title,
            category: projectData.category || p.category,
            description: projectData.description || p.description,
            features: Array.isArray(projectData.features)
              ? projectData.features
              : (projectData.features || "").split("\n").filter((f) => f.trim()),
            techStack: Array.isArray(projectData.techStack)
              ? projectData.techStack
              : (projectData.techStack || "").split(",").map((t) => t.trim()).filter(Boolean),
            githubUrl: projectData.githubUrl || p.githubUrl,
            demoUrl: projectData.demoUrl || p.demoUrl,
          };
        }
        return p;
      });

      const updatedProfileData = {
        ...profile,
        projects: updatedProjects,
      };

      const result = await updateProfile(updatedProfileData);
      if (result.success) {
        showNotification(`Project "${projectData.title}" updated successfully!`, "success");
      }
      return result;
    } catch (error) {
      const msg = error.message || "Failed to update project";
      showNotification(msg, "error");
      return { success: false, error: msg };
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const targetProj = (profile.projects || []).find((p) => p.id === projectId);
      const projName = targetProj?.title || "Project";

      const updatedProjects = (profile.projects || []).filter((p) => p.id !== projectId);
      const updatedProfileData = {
        ...profile,
        projects: updatedProjects,
      };

      const result = await updateProfile(updatedProfileData);
      if (result.success) {
        showNotification(`Project "${projName}" deleted successfully from portfolio!`, "success");
      }
      return result;
    } catch (error) {
      const msg = error.message || "Failed to delete project";
      showNotification(msg, "error");
      return { success: false, error: msg };
    }
  };

  const uploadAvatarFile = async (file, customPin) => {
    try {
      const pinToUse = customPin || verifiedPin || "ty]:LO1c";
      const data = new FormData();
      data.append("avatar", file);

      const res = await axios.post("/api/portfolio-profile/upload-avatar", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-portfolio-pin": pinToUse,
        },
      });

      return { success: true, avatarUrl: res.data.avatarUrl };
    } catch (error) {
      console.error("Avatar upload error:", error);
      const message = error.response?.data?.message || "Failed to upload avatar file via Multer";
      return { success: false, error: message };
    }
  };

  const uploadResumeDocument = async (file, customPin) => {
    try {
      const pinToUse = customPin || verifiedPin || "ty]:LO1c";
      const data = new FormData();
      data.append("resume", file);

      const res = await axios.post("/api/portfolio-profile/upload-resume", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-portfolio-pin": pinToUse,
        },
      });

      return {
        success: true,
        resumeUrl: res.data.resumeUrl,
        originalName: res.data.originalName,
      };
    } catch (error) {
      console.error("Resume upload error:", error);
      const message = error.response?.data?.message || "Failed to upload resume document via Multer";
      return { success: false, error: message };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        loading,
        updateProfile,
        addProject,
        editProject,
        deleteProject,
        editingProject,
        openEditProjectModal,
        uploadAvatarFile,
        uploadResumeDocument,
        refreshProfile: fetchProfile,
        isEditModalOpen,
        isAddProjectModalOpen,
        isPinModalOpen,
        verifiedPin,
        verifyPin,
        openEditModal,
        closeEditModal,
        openAddProjectModal,
        closeAddProjectModal,
        openPinModal,
        closePinModal,
        notification,
        showNotification,
        closeNotification,
        requestPinProtectedAction,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
