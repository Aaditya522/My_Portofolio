import React, { useState } from "react";
import {
  Code,
  Box,
  FileCode,
  Atom,
  Server,
  Layers,
  UserCheck,
  Database,
  Binary,
  Coffee,
  GitBranch,
  Scale,
  Shield,
  Terminal,
  Wrench,
  Lock,
  Sparkles,
  Globe,
  CheckCircle2,
  Cpu,
  Layers3,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import ScrollReveal from "./ScrollReveal";
import ThreeDCard from "./ThreeDCard";
import { getSkillProficiency } from "./EditPortfolioModal";

// Helper map to pick clean Lucide icon component dynamically
const getSkillIcon = (title) => {
  const lower = (title || "").toLowerCase();
  if (lower.includes("html")) return Code;
  if (lower.includes("css") || lower.includes("bootstrap") || lower.includes("tailwind")) return Box;
  if (lower.includes("javascript") || lower === "js") return FileCode;
  if (lower.includes("react")) return Atom;
  if (lower.includes("node")) return Server;
  if (lower.includes("express")) return Layers;
  if (lower.includes("php")) return Globe;
  if (lower.includes("auth") || lower.includes("jwt")) return UserCheck;
  if (lower.includes("mongo") || lower.includes("db") || lower.includes("sql")) return Database;
  if (lower.includes("c/c++") || lower.includes("cpp")) return Binary;
  if (lower.includes("java")) return Coffee;
  if (lower.includes("git")) return GitBranch;
  if (lower.includes("compliance") || lower.includes("info")) return Scale;
  if (lower.includes("network")) return Shield;
  if (lower.includes("kali") || lower.includes("linux")) return Terminal;
  if (lower.includes("tools") || lower.includes("burp")) return Wrench;
  if (lower.includes("crypto") || lower.includes("lock")) return Lock;
  return CheckCircle2;
};

// Category classification helper (Backend checked before generic 'js' to prevent Node.js/Express.js matching Frontend)
const getCategoryForSkill = (title) => {
  const lower = (title || "").toLowerCase();

  // Check Backend skills FIRST so "Node.js" and "Express.js" do not trigger "js" frontend match
  if (
    lower.includes("node") ||
    lower.includes("express") ||
    lower.includes("php") ||
    lower.includes("mongo") ||
    lower.includes("db") ||
    lower.includes("sql") ||
    lower.includes("auth") ||
    lower.includes("jwt")
  ) {
    return "Backend";
  }

  // Frontend skills
  if (
    lower.includes("html") ||
    lower.includes("css") ||
    lower.includes("react") ||
    lower.includes("bootstrap") ||
    lower.includes("tailwind") ||
    lower.includes("javascript") ||
    lower.includes("js")
  ) {
    return "Frontend";
  }

  // Core & Programming Languages
  if (
    lower.includes("c/c++") ||
    lower.includes("cpp") ||
    lower.includes("java") ||
    lower.includes("git")
  ) {
    return "Core & Languages";
  }

  return "Security & Tools";
};

export default function SkillsSection() {
  const { profile } = usePortfolio();
  const skills = profile?.skills && profile.skills.length > 0 ? profile.skills : [];
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categories = ["All", "Frontend", "Backend", "Core & Languages", "Security & Tools"];

  const filteredSkills = skills.filter((skill) => {
    if (activeCategory === "All") return true;
    return getCategoryForSkill(skill.title) === activeCategory;
  });

  return (
    <section id="skills" className="py-28 relative z-10 overflow-hidden">
      {/* Background glowing aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-950/80 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-lg shadow-violet-900/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <span>Interactive 3D Stack & Capabilities</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Technical <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">Proficiency & Skillset</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            Hover over skill cards to experience full 3D tilt perspective, depth layering, and live technical breakdown.
          </p>

          {/* 3D Filter Category Tabs & Collapse Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  if (isCollapsed) setIsCollapsed(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 backdrop-blur-md cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 scale-105 border border-violet-400/50"
                    : "bg-slate-900/70 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Single Compact Collapse / Expand Toggle Button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 text-slate-300 hover:text-white backdrop-blur-md shadow-sm active:scale-95 cursor-pointer ml-1 sm:ml-2"
              title={isCollapsed ? "Expand Skills Section" : "Collapse Skills Section"}
            >
              {isCollapsed ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-violet-400" />
                  <span>Expand</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-violet-400" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>
        </ScrollReveal>

        {/* Skills Cards 3D Grid */}
        {!isCollapsed && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill, index) => {
              const IconComponent = getSkillIcon(skill.title);
              const category = getCategoryForSkill(skill.title);
              const proficiencyValue = getSkillProficiency(skill, index);

              return (
                <ScrollReveal
                  key={skill._id || skill.id || index}
                  delay={((index % 4) + 1) * 80}
                >
                  <ThreeDCard
                    className="w-full h-full"
                    maxTilt={18}
                    scaleOnHover={1.04}
                    glareOpacity={0.3}
                  >
                    <div className="group relative w-full h-full rounded-2xl p-6 bg-slate-900/80 border border-slate-800/90 hover:border-violet-500/50 shadow-2xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden preserve-3d">
                      {/* Glowing neon hover border aura */}
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div>
                        {/* Top Skill Category & Badge (Pops 3D translateZ) */}
                        <div className="flex items-center justify-between mb-4 preserve-3d translate-z-20">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-violet-950/90 text-violet-300 border border-violet-500/30">
                            {category}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-violet-400">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </div>
                        </div>

                        {/* 3D Floating Icon Container (Pops high translateZ 40px) */}
                        <div className="flex items-center gap-4 mb-4 preserve-3d translate-z-40">
                          <div className="p-3.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-500/30 text-violet-300 group-hover:scale-110 group-hover:text-white group-hover:border-violet-400 transition-transform duration-300 shadow-md shadow-violet-950">
                            <IconComponent className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-lg font-extrabold text-white group-hover:text-violet-300 transition-colors tracking-tight">
                              {skill.title}
                            </h3>
                          </div>
                        </div>

                        {/* Description Text (Pops translateZ 20px) */}
                        <p className="text-xs text-slate-300 font-normal leading-relaxed text-justify mb-4 preserve-3d translate-z-20">
                          {skill.description}
                        </p>
                      </div>

                      {/* Skill Level Progress Indicator Bar */}
                      <div className="pt-3 border-t border-slate-800/80 preserve-3d translate-z-10">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                          <span>Proficiency</span>
                          <span className="text-violet-400 font-mono font-extrabold">{proficiencyValue}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 group-hover:from-violet-400 group-hover:to-cyan-300 transition-all duration-500"
                            style={{ width: `${proficiencyValue}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </ThreeDCard>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
