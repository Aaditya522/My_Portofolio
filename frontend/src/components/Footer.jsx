import React from "react";
import { Code2, Github, Linkedin, Sparkles } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export default function Footer() {
  const { profile } = usePortfolio();

  return (
    <footer className="bg-slate-950/90 border-t border-slate-800/80 py-10 relative z-10 backdrop-blur-xl">
      <div className="w-full px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-950/80 border border-violet-500/30 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-violet-400" />
          </div>
          <span className="font-bold text-slate-200 text-sm">
            {profile?.fullName || "Aaditya Bansal"} Portfolio &copy; {new Date().getFullYear()}
          </span>
        </div>

        <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <span>Interactive 3D UI • Built with React, Node & MongoDB</span>
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        </p>

        <div className="flex items-center gap-4">
          <a
            href={profile?.githubUrl || "https://github.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-violet-400 transition-colors p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={profile?.linkedinUrl || "https://linkedin.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-colors p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
