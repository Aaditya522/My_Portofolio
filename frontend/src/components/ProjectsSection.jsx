import React, { useState } from "react";
import { ExternalLink, Github, ArrowUpRight, FolderGit2, Trash2, Pencil, Code2, Plus, Sparkles, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import ScrollReveal from "./ScrollReveal";
import ThreeDCard from "./ThreeDCard";
import ParallaxItem from "./ParallaxItem";

export default function ProjectsSection() {
  const { profile, openAddProjectModal, openEditProjectModal, deleteProject, verifiedPin, openPinModal } = usePortfolio();
  const projects = profile?.projects || [];
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDelete = async (projectId, projectTitle) => {
    if (!verifiedPin) {
      openPinModal("add_project");
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${projectTitle}" from your portfolio?`)) {
      await deleteProject(projectId);
    }
  };

  return (
    <section id="projects" className="py-28 relative z-10 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 right-10 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <ParallaxItem speed={-0.04}>
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-cyan-950/40">
                <FolderGit2 className="w-4 h-4 text-cyan-400" />
                <span>Interactive Portfolio</span>
              </div>

              {/* Header Add Project Option Button */}
              <button
                type="button"
                onClick={openAddProjectModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold transition shadow-lg shadow-violet-600/25 active:scale-95 cursor-pointer"
                title="Add New Project (PIN Required)"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>

              {/* Header Collapse / Expand Toggle Button */}
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white backdrop-blur-md shadow-sm active:scale-95 cursor-pointer"
                title={isCollapsed ? "Expand Projects Section" : "Collapse Projects Section"}
              >
                {isCollapsed ? (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Expand</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Collapse</span>
                  </>
                )}
              </button>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Featured <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Projects & Engineering</span>
            </h2>
            <p className="text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
              Full-stack web applications featuring dynamic state management, custom database schemas, and responsive UI design.
            </p>
          </ScrollReveal>
        </ParallaxItem>

        {/* Projects Cards Grid */}
        {!isCollapsed && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ScrollReveal
                key={project.id || index}
                delay={((index % 3) + 1) * 120}
              >
                <ThreeDCard
                  className="w-full h-full"
                  index={index}
                  horizontalOnly={true}
                  maxHorizontalShift={16}
                  scaleOnHover={1.02}
                  glareOpacity={0.2}
                >
                  <div className="group relative w-full h-full bg-slate-900/85 border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-2xl backdrop-blur-xl overflow-hidden">
                    {/* Sheen glowing background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div>
                      {/* Top Category Badge & Action Buttons */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/10 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300 shadow-md">
                          <Code2 className="w-6 h-6" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
                            {project.category || "Full Stack"}
                          </span>
                          <button
                            type="button"
                            onClick={() => openEditProjectModal(project)}
                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/50 rounded-lg border border-transparent hover:border-cyan-500/30 transition cursor-pointer"
                            title="Edit Project Details"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(project.id, project.title)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/50 rounded-lg border border-transparent hover:border-red-500/30 transition cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors tracking-tight">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
                        {project.description}
                      </p>

                      {/* Features List */}
                      {project.features && project.features.length > 0 && (
                        <div className="mb-6 space-y-2">
                          {project.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
                              <span className="text-cyan-400 font-bold mt-0.5">•</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tech Stack & Links Footer */}
                    <div>
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-slate-800/80">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-800/90 text-cyan-300 border border-slate-700/80"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <a
                          href={project.demoUrl || "/login"}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 shadow-lg shadow-violet-600/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                        >
                          <span>Try Workspace</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                        <a
                          href={project.githubUrl || "https://github.com"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
                          title="View GitHub Code"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </ThreeDCard>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
