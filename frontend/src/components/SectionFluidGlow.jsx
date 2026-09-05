import React, { useEffect, useRef, useState } from "react";

export default function SectionFluidGlow({ containerRef }) {
  const glowRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Positions and velocities for lerp and liquid stretch physics
  const targetPos = useRef({ x: -300, y: -300 });
  const currentPos = useRef({ x: -300, y: -300 });
  const velocity = useRef({ x: 0, y: 0 });

  const [isVisible, setIsVisible] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check accessibility reduced motion setting
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // IntersectionObserver to pause calculations when section is out of viewport
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  // Mouse event listeners scoped strictly to section container
  useEffect(() => {
    const container = containerRef?.current;
    if (!container || prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef, isVisible, prefersReducedMotion]);

  // 60 FPS requestAnimationFrame loop with lerp easing & stretch physics
  useEffect(() => {
    if (!isInViewport || prefersReducedMotion) return;

    let startTime = performance.now();

    const updateAnimation = (time) => {
      const elapsed = (time - startTime) * 0.001; // elapsed time in seconds

      // Lerp positioning calculation (glow slowly catches up)
      const lerpFactor = 0.08;
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;

      currentPos.current.x += dx * lerpFactor;
      currentPos.current.y += dy * lerpFactor;

      // Velocity for liquid stretching effect
      velocity.current.x = dx * lerpFactor;
      velocity.current.y = dy * lerpFactor;

      const speed = Math.sqrt(
        velocity.current.x * velocity.current.x + velocity.current.y * velocity.current.y
      );

      // Subtle idle breathing movement when mouse stops
      const idleX = Math.sin(elapsed * 1.5) * 8;
      const idleY = Math.cos(elapsed * 1.2) * 8;

      const posX = currentPos.current.x + idleX;
      const posY = currentPos.current.y + idleY;

      // Directional stretch angle & scale calculation
      const angle = Math.atan2(velocity.current.y, velocity.current.x);
      const stretchScaleX = Math.min(1.4, 1 + speed * 0.025);
      const stretchScaleY = Math.max(0.7, 1 - speed * 0.015);

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${stretchScaleX}, ${stretchScaleY})`;
      }

      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    };

    animationFrameRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInViewport, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={glowRef}
      className={`pointer-events-none absolute top-0 left-0 rounded-full transition-opacity duration-700 ease-out z-0 hidden sm:block ${
        isVisible && isInViewport ? "opacity-45" : "opacity-0"
      }
      w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96
      bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500
      blur-[80px] sm:blur-[100px] md:blur-[130px]`}
      style={{
        willChange: "transform, opacity",
      }}
    />
  );
}
