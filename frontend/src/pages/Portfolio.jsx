import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import TechStackMarquee from "../components/TechStackMarquee";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import EditPortfolioModal from "../components/EditPortfolioModal";
import AddProjectModal from "../components/AddProjectModal";
import PinVerificationModal from "../components/PinVerificationModal";
import ToastNotification from "../components/ToastNotification";
import CustomCursor from "../components/CustomCursor";
import Canvas3DBackground from "../components/Canvas3DBackground";
import ParallaxBackground from "../components/ParallaxBackground";

export default function Portfolio() {
  return (
    <div className="bg-[#05050a] text-slate-100 min-h-screen selection:bg-violet-600 selection:text-white relative overflow-x-hidden">
      {/* Interactive WebGL / Canvas 3D Background */}
      <Canvas3DBackground />

      {/* Multi-Layer Cinematic Parallax Background */}
      <ParallaxBackground />

      <ToastNotification />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        {/* Languages & Frameworks Showcase Section (between About & Skills) */}
        <TechStackMarquee />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Interactive Modals */}
      <EditPortfolioModal />
      <AddProjectModal />
      <PinVerificationModal />
    </div>
  );
}
