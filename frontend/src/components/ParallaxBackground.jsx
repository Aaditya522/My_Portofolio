import React, { useEffect, useRef, useState } from "react";
import { Code2, Terminal, Braces, Sparkles, Cpu, Shield, Layers, GitBranch, Database } from "lucide-react";

/**
 * ParallaxBackground Component
 * Renders multiple depth layers of floating geometric shapes, glowing ambient orbs,
 * and developer badges that drift at varying speeds as the user scrolls,
 * creating a rich cinematic 3D parallax depth effect.
 */
export default function ParallaxBackground() {
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth <= 768 ||
        window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let mouseTicking = false;
    const handleMouseMove = (e) => {
      if (!mouseTicking) {
        window.requestAnimationFrame(() => {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          setMouseOffset({
            x: (e.clientX - centerX) / centerX,
            y: (e.clientY - centerY) / centerY,
          });
          mouseTicking = false;
        });
        mouseTicking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // Floating parallax badges and elements configuration
  const floatingElements = [
    // Top Hero Region
    {
      id: "hero-badge-1",
      top: "14%",
      left: "8%",
      speed: -0.22,
      mouseFactor: 24,
      icon: Code2,
      label: "<FullStack />",
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/40 shadow-cyan-500/10",
    },
    {
      id: "hero-badge-2",
      top: "22%",
      right: "7%",
      speed: 0.18,
      mouseFactor: -28,
      icon: Sparkles,
      label: "AI Workflows",
      color: "text-amber-400 border-amber-500/30 bg-amber-950/40 shadow-amber-500/10",
    },
    {
      id: "hero-badge-3",
      top: "32%",
      left: "4%",
      speed: -0.15,
      mouseFactor: 18,
      icon: Braces,
      label: "{ MERN }",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40 shadow-emerald-500/10",
    },

    // Mid TechStack & Skills Region
    {
      id: "mid-badge-1",
      top: "42%",
      right: "5%",
      speed: -0.25,
      mouseFactor: -20,
      icon: Terminal,
      label: "REST & GraphQL",
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-950/40 shadow-indigo-500/10",
    },
    {
      id: "mid-badge-2",
      top: "52%",
      left: "6%",
      speed: 0.22,
      mouseFactor: 25,
      icon: Database,
      label: "MongoDB & SQL",
      color: "text-teal-400 border-teal-500/30 bg-teal-950/40 shadow-teal-500/10",
    },
    {
      id: "mid-badge-3",
      top: "58%",
      right: "8%",
      speed: -0.18,
      mouseFactor: -18,
      icon: Cpu,
      label: "C++ & System Arch",
      color: "text-purple-400 border-purple-500/30 bg-purple-950/40 shadow-purple-500/10",
    },

    // Projects & Lower Region
    {
      id: "proj-badge-1",
      top: "68%",
      left: "7%",
      speed: -0.24,
      mouseFactor: 22,
      icon: GitBranch,
      label: "Git CI/CD",
      color: "text-pink-400 border-pink-500/30 bg-pink-950/40 shadow-pink-500/10",
    },
    {
      id: "proj-badge-2",
      top: "76%",
      right: "6%",
      speed: 0.2,
      mouseFactor: -24,
      icon: Shield,
      label: "Cybersecurity",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40 shadow-emerald-500/10",
    },
    {
      id: "proj-badge-3",
      top: "85%",
      left: "5%",
      speed: -0.16,
      mouseFactor: 16,
      icon: Layers,
      label: "Microservices",
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/40 shadow-cyan-500/10",
    },
  ];

  // Ambient deep parallax glow orbs
  const parallaxOrbs = [
    {
      id: "orb-1",
      top: "10%",
      left: "20%",
      width: "650px",
      height: "650px",
      speed: -0.12,
      mouseFactor: 15,
      gradient: "from-violet-600/15 via-indigo-600/10 to-transparent",
    },
    {
      id: "orb-2",
      top: "38%",
      right: "15%",
      width: "700px",
      height: "700px",
      speed: 0.16,
      mouseFactor: -20,
      gradient: "from-cyan-500/15 via-teal-500/10 to-transparent",
    },
    {
      id: "orb-3",
      top: "65%",
      left: "15%",
      width: "600px",
      height: "600px",
      speed: -0.14,
      mouseFactor: 18,
      gradient: "from-fuchsia-600/15 via-purple-600/10 to-transparent",
    },
    {
      id: "orb-4",
      top: "85%",
      right: "20%",
      width: "550px",
      height: "550px",
      speed: 0.12,
      mouseFactor: -15,
      gradient: "from-emerald-500/15 via-teal-600/10 to-transparent",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Ambient Parallax Gradient Orbs */}
      {parallaxOrbs.map((orb) => {
        const translateY = isMobile ? 0 : scrollY * orb.speed;
        const translateX = isMobile ? 0 : mouseOffset.x * orb.mouseFactor;
        const mouseShiftY = isMobile ? 0 : mouseOffset.y * orb.mouseFactor;

        return (
          <div
            key={orb.id}
            className={`absolute rounded-full blur-[140px] bg-gradient-to-tr ${orb.gradient} transition-transform duration-100 ease-out`}
            style={{
              top: orb.top,
              left: orb.left,
              right: orb.right,
              width: orb.width,
              height: orb.height,
              transform: `translate3d(${translateX}px, ${translateY + mouseShiftY}px, 0)`,
              willChange: "transform",
            }}
          />
        );
      })}

      {/* 2. Floating Developer Glyph & Category Badges (Desktop / Tablet only) */}
      {!isMobile &&
        floatingElements.map((elem) => {
          const Icon = elem.icon;
          const translateY = scrollY * elem.speed;
          const translateX = mouseOffset.x * elem.mouseFactor;
          const mouseShiftY = mouseOffset.y * (elem.mouseFactor * 0.7);

          return (
            <div
              key={elem.id}
              className={`absolute hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md shadow-lg text-xs font-mono font-bold tracking-wide transition-transform duration-75 ease-out ${elem.color}`}
              style={{
                top: elem.top,
                left: elem.left,
                right: elem.right,
                transform: `translate3d(${translateX}px, ${translateY + mouseShiftY}px, 0)`,
                willChange: "transform",
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{elem.label}</span>
            </div>
          );
        })}
    </div>
  );
}
