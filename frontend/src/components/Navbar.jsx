import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Menu, X, Code2, ArrowRight, Pencil } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { usePortfolio } from "../context/PortfolioContext";

export default function Navbar() {
  const { hasWorkspace, workspaceId } = useWorkspace();
  const { openEditModal } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#hero" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 py-3.5 shadow-2xl shadow-cyan-950/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            My<span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent"> Portfolio</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={openEditModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 shadow-sm transition active:scale-95 cursor-pointer"
            title="Edit Portfolio Information in DB"
          >
            <Pencil className="w-4 h-4 text-cyan-400" />
            <span>Edit Portfolio</span>
          </button>

          <Link
            to={hasWorkspace ? "/dashboard" : "/workspace"}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-95"
          >
            <LayoutDashboard className="w-4 h-4 text-white" />
            <span>{hasWorkspace ? `Workspace (${workspaceId})` : "Enter / Create Workspace"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-4 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-300 hover:text-cyan-400 transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openEditModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 bg-slate-900 border border-slate-800 shadow-sm"
              >
                <Pencil className="w-4 h-4 text-cyan-400" />
                <span>Edit Portfolio</span>
              </button>

              <Link
                to={hasWorkspace ? "/dashboard" : "/workspace"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 shadow-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{hasWorkspace ? `Workspace (${workspaceId})` : "Enter / Create Workspace"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
