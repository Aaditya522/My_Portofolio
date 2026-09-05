import React, { useState, useEffect, useRef } from "react";
import { FileText, Github, Linkedin, ArrowUpRight, GraduationCap, Briefcase, Code, Terminal } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import SectionFluidGlow from "./SectionFluidGlow";
import ThreeDCard from "./ThreeDCard";

export default function HeroSection() {
  const { profile } = usePortfolio();
  const heroRef = useRef(null);
  const roles = profile?.roles && profile.roles.length > 0 ? profile.roles : [
    "Software Engineering Intern",
    "4th Year B.Tech CSE Student",
    "MERN Stack & LLM Developer",
  ];

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset index if roles array changes
  useEffect(() => {
    setCurrentRoleIndex(0);
    setDisplayText("");
  }, [profile?.roles]);

  // Typewriter effect for roles
  useEffect(() => {
    const currentFullRole = roles[currentRoleIndex] || roles[0] || "";
    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && displayText === currentFullRole) {
      typingSpeed = 2200; // Pause at end of sentence
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      typingSpeed = 400;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && displayText !== currentFullRole) {
        setDisplayText(currentFullRole.slice(0, displayText.length + 1));
      } else if (isDeleting && displayText !== "") {
        setDisplayText(currentFullRole.slice(0, displayText.length - 1));
      } else if (!isDeleting && displayText === currentFullRole) {
        setIsDeleting(true);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRoleIndex, roles]);

  const getAvatarSrc = (url) => {
    if (!url) return "/profile-avatar.png";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
    if (!apiBase) {
      return url.startsWith("/") ? url : `/${url}`;
    }
    return url.startsWith("/") ? `${apiBase}${url}` : `${apiBase}/${url}`;
  };

  const [imgSrc, setImgSrc] = useState(() => getAvatarSrc(profile?.avatarUrl) || "/profile-avatar.png");
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const resolved = getAvatarSrc(profile?.avatarUrl);
    setImgSrc(resolved || "/profile-avatar.png");
    setImgFailed(false);
  }, [profile?.avatarUrl]);

  const handleImgError = () => {
    if (imgSrc !== "/profile-avatar.png") {
      // Primary fallback: bundled public avatar in frontend
      setImgSrc("/profile-avatar.png");
    } else {
      // Secondary fallback: initials avatar
      setImgFailed(true);
    }
  };

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen pt-36 pb-24 flex items-center justify-center overflow-hidden">
      {/* Scoped Fluid Glow Animation */}
      <SectionFluidGlow containerRef={heroRef} />

      {/* Atmospheric Ambient Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/15 to-cyan-500/20 rounded-full blur-[150px] opacity-90 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[130px]" />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-10 relative z-10 text-center max-w-6xl mx-auto">
        {/* Active Working Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-8 shadow-xl shadow-cyan-950/50 backdrop-blur-xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span>{profile?.tagline || "Software Engineering Intern & Full Stack Developer"}</span>
        </div>

        {/* Main 3D Hero Heading with Indigo, Cyan & Emerald Gradient */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8">
          {profile?.heading || "Crafting Software As A"} <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-md">
            {displayText}
          </span>
          <span className="animate-pulse text-cyan-400 font-normal ml-1">|</span>
        </h1>

        {/* Central 3D Interactive Profile & Bio Card */}
        <div className="max-w-4xl mx-auto mb-14">
          <ThreeDCard maxTilt={12} scaleOnHover={1.02} glareOpacity={0.2} className="w-full">
            <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row items-center gap-7 text-left overflow-hidden preserve-3d">
              {/* Glowing Aura overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

              {/* Profile Avatar Container (Pops translateZ 40px) */}
              <div className="relative shrink-0 group preserve-3d translate-z-40">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-cyan-500/80 shadow-xl shadow-cyan-950 bg-slate-950 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  {!imgFailed ? (
                    <img
                      src={imgSrc}
                      alt={profile?.fullName || "Profile Picture"}
                      className="w-full h-full object-cover"
                      onError={handleImgError}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-300 font-black text-3xl bg-gradient-to-tr from-cyan-950 to-slate-900">
                      {profile?.fullName ? profile.fullName.split(" ").map((n) => n[0]).join("") : "AB"}
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Details (Pops translateZ 20px) */}
              <div className="flex-1 text-center sm:text-left preserve-3d translate-z-20">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                  Hi, I'm <span className="text-cyan-400 underline decoration-cyan-500/40 decoration-2 underline-offset-4">{profile?.fullName || "Aaditya Bansal"}</span>
                </h3>
                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                  {profile?.bio || "4th Year B.Tech CSE Student passionate about building scalable web apps, MERN stack solutions, and AI-powered developer workflows."}
                </p>
              </div>
            </div>
          </ThreeDCard>
        </div>

        {/* Action Magnetic CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
          <a
            href={profile?.resumeUrl || "#"}
            target={profile?.resumeUrl?.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 w-60 py-4 rounded-2xl font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-fuchsia-500/40 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.04] active:scale-95"
          >
            <FileText className="w-4 h-4 text-fuchsia-400 group-hover:rotate-12 transition-transform" />
            <span>Download Resume</span>
          </a>

          <a
            href={profile?.githubUrl || "https://github.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-60 py-4 rounded-2xl font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-violet-500/40 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.04] active:scale-95"
          >
            <Github className="w-4 h-4 text-violet-400" />
            <span>GitHub Profile</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href={profile?.linkedinUrl || "https://linkedin.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-60 py-4 rounded-2xl font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.04] active:scale-95"
          >
            <Linkedin className="w-4 h-4 text-cyan-400" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Levitating 3D Feature Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-4xl mx-auto">
          <div className="animate-float-3d p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-xl backdrop-blur-xl text-left hover:border-cyan-500/40 transition duration-300">
            <div className="text-xl sm:text-2xl font-black text-cyan-400 flex items-center gap-2 whitespace-nowrap mb-1.5">
              <GraduationCap className="w-6 h-6 text-cyan-400 shrink-0" />
              <span className="whitespace-nowrap">4th Year</span>
            </div>
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between gap-1">
              <span className="truncate">B.Tech CSE</span>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 shadow-sm backdrop-blur-md whitespace-nowrap">
                CGPA 9.18
              </span>
            </div>
          </div>

          <div className="animate-float-reverse-3d p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-xl backdrop-blur-xl text-left hover:border-fuchsia-500/40 transition duration-300">
            <div className="text-2xl font-black text-fuchsia-400 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-fuchsia-400" />
              <span>SE Intern</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Software Engineering</div>
          </div>

          <div className="animate-float-3d p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-xl backdrop-blur-xl text-left hover:border-cyan-500/40 transition duration-300">
            <div className="text-2xl font-black text-cyan-400 flex items-center gap-2">
              <Code className="w-6 h-6 text-cyan-400" />
              <span>DSA & OOP</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">C++ & Java Solvers</div>
          </div>

          <div className="animate-float-reverse-3d p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-xl backdrop-blur-xl text-left hover:border-emerald-500/40 transition duration-300">
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              <Terminal className="w-6 h-6 text-emerald-400" />
              <span>MERN & PHP</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Full Stack & Backend</div>
          </div>
        </div>
      </div>
    </section>
  );
}
