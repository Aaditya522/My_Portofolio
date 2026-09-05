import React from "react";
import {
  Code2,
  FileCode,
  Atom,
  Server,
  Layers,
  Database,
  Binary,
  Coffee,
  Globe,
  GitBranch,
  Terminal,
  Cpu,
  Box,
  Zap,
  Layout,
  ShieldCheck,
  Cloud,
  Flame,
  PenTool,
  Bot,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const techLanguages = [
  { name: "JavaScript", icon: FileCode, iconSize: "w-14 h-14 sm:w-16 sm:h-16", brandColor: "#F7DF1E", animClass: "animate-float-5d-1", floatDuration: 9.5, floatDelay: 0.2, offsetY: "translate-y-1" },
  { name: "TypeScript", icon: FileCode, iconSize: "w-10 h-10 sm:w-12 sm:h-12", brandColor: "#3178C6", animClass: "animate-float-5d-2", floatDuration: 11.0, floatDelay: 1.1, offsetY: "-translate-y-2" },
  { name: "C++", icon: Binary, iconSize: "w-16 h-16 sm:w-18 sm:h-18", brandColor: "#60A5FA", animClass: "animate-float-5d-3", floatDuration: 12.5, floatDelay: 0.5, offsetY: "translate-y-2" },
  { name: "Java", icon: Coffee, iconSize: "w-10 h-10 sm:w-11 sm:h-11", brandColor: "#ED8B00", animClass: "animate-float-5d-1", floatDuration: 9.0, floatDelay: 1.8, offsetY: "-translate-y-1" },
  { name: "PHP", icon: Globe, iconSize: "w-14 h-14 sm:w-15 sm:h-15", brandColor: "#777BB4", animClass: "animate-float-5d-2", floatDuration: 10.5, floatDelay: 0.9, offsetY: "translate-y-1" },
  { name: "Python", icon: Terminal, iconSize: "w-12 h-12 sm:w-13 sm:h-13", brandColor: "#3776AB", animClass: "animate-float-5d-3", floatDuration: 11.5, floatDelay: 2.1, offsetY: "-translate-y-2" },
  { name: "React.js", icon: Atom, iconSize: "w-18 h-18 sm:w-22 sm:h-22", brandColor: "#61DAFB", animClass: "animate-float-5d-1", floatDuration: 13.0, floatDelay: 0.3, offsetY: "-translate-y-2" },
  { name: "Next.js", icon: Layout, iconSize: "w-13 h-13 sm:w-14 sm:h-14", brandColor: "#FFFFFF", animClass: "animate-float-5d-2", floatDuration: 10.8, floatDelay: 1.3, offsetY: "translate-y-2" },
  { name: "Node.js", icon: Server, iconSize: "w-15 h-15 sm:w-17 sm:h-17", brandColor: "#339933", animClass: "animate-float-5d-3", floatDuration: 12.0, floatDelay: 1.4, offsetY: "translate-y-2" },
  { name: "Express.js", icon: Layers, iconSize: "w-10 h-10 sm:w-11 sm:h-11", brandColor: "#E0E0E0", animClass: "animate-float-5d-1", floatDuration: 9.2, floatDelay: 0.7, offsetY: "-translate-y-1" },
  { name: "MongoDB", icon: Database, iconSize: "w-13 h-13 sm:w-15 sm:h-15", brandColor: "#47A248", animClass: "animate-float-5d-2", floatDuration: 10.2, floatDelay: 2.3, offsetY: "translate-y-2" },
  { name: "LLM & AI APIs", icon: Bot, iconSize: "w-13 h-13 sm:w-15 sm:h-15", brandColor: "#A855F7", animClass: "animate-float-5d-1", floatDuration: 11.2, floatDelay: 1.7, offsetY: "translate-y-1" },
  { name: "HTML5", icon: Code2, iconSize: "w-14 h-14 sm:w-16 sm:h-16", brandColor: "#E34F26", animClass: "animate-float-5d-2", floatDuration: 10.5, floatDelay: 0.4, offsetY: "translate-y-2" },
  { name: "Tailwind", icon: Box, iconSize: "w-12 h-12 sm:w-13 sm:h-13", brandColor: "#06B6D4", animClass: "animate-float-5d-3", floatDuration: 9.9, floatDelay: 1.6, offsetY: "-translate-y-2" },
  { name: "Git & GitHub", icon: GitBranch, iconSize: "w-15 h-15 sm:w-17 sm:h-17", brandColor: "#F05032", animClass: "animate-float-5d-1", floatDuration: 12.2, floatDelay: 2.5, offsetY: "translate-y-1" },
  { name: "Cloud & AWS", icon: Cloud, iconSize: "w-11 h-11 sm:w-12 sm:h-12", brandColor: "#FF9900", animClass: "animate-float-5d-3", floatDuration: 9.6, floatDelay: 0.8, offsetY: "translate-y-2" },
  { name: "REST APIs", icon: Zap, iconSize: "w-10 h-10 sm:w-11 sm:h-11", brandColor: "#FF6C37", animClass: "animate-float-5d-2", floatDuration: 8.8, floatDelay: 0.8, offsetY: "-translate-y-2" },
  { name: "Linux & Bash", icon: Terminal, iconSize: "w-13 h-13 sm:w-15 sm:h-15", brandColor: "#FCC624", animClass: "animate-float-5d-3", floatDuration: 10.6, floatDelay: 1.9, offsetY: "translate-y-2" },
  { name: "Firebase", icon: Flame, iconSize: "w-12 h-12 sm:w-13 sm:h-13", brandColor: "#FFCA28", animClass: "animate-float-5d-1", floatDuration: 9.7, floatDelay: 1.0, offsetY: "-translate-y-1" },
  { name: "Security Auth", icon: ShieldCheck, iconSize: "w-12 h-12 sm:w-13 sm:h-13", brandColor: "#10B981", animClass: "animate-float-5d-2", floatDuration: 11.4, floatDelay: 2.4, offsetY: "translate-y-2" },
  { name: "Figma UI", icon: PenTool, iconSize: "w-10 h-10 sm:w-11 sm:h-11", brandColor: "#F24E1E", animClass: "animate-float-5d-3", floatDuration: 9.1, floatDelay: 1.5, offsetY: "-translate-y-2" },
];

export default function TechStackMarquee() {
  return (
    <section id="languages" className="py-20 relative z-10 overflow-hidden bg-transparent">
      <div className="w-full px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto mb-14 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-950/80 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-md backdrop-blur-md">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>Subtle Micro-Levitation Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">Languages & Frameworks</span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Containerless Direct SVG Icons with Subtle 5D Hyper-Dimensional Micro-Levitation */}
      <div className="w-full px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-7 sm:gap-11">
          {techLanguages.map((tech, idx) => {
            const IconComponent = tech.icon;

            return (
              <ScrollReveal key={tech.name} delay={((idx % 8) + 1) * 30}>
                {/* Direct 5D Hyper-Dimensional Floating Icon Element */}
                <div
                  className={`group relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${tech.offsetY} ${tech.animClass}`}
                  style={{
                    animationDuration: `${tech.floatDuration}s`,
                    animationDelay: `${tech.floatDelay}s`,
                  }}
                >
                  {/* Containerless SVG Icon rendered with 5D spectral hue & subtle micro-drift */}
                  <IconComponent
                    className={`${tech.iconSize} transition-transform duration-300 group-hover:scale-125 p-0 border-none bg-transparent`}
                    style={{
                      color: tech.brandColor,
                      stroke: tech.brandColor,
                    }}
                  />

                  {/* Clean Label */}
                  <span className="text-xs font-bold text-slate-300 mt-2.5 tracking-tight transition-colors group-hover:text-white truncate max-w-[110px] text-center">
                    {tech.name}
                  </span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
