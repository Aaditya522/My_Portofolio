import React, { useState, useRef, useCallback, useEffect } from "react";

/**
 * ThreeDCard Component
 * Wraps content with:
 * 1. Ultra-smooth, physics-based scroll parallax with column staggering & velocity pitch
 * 2. Interactive 3D perspective mouse tilt & specular lighting (on desktop)
 * 3. Pure direct-DOM GPU transforms for 60–120 FPS performance without React re-renders
 * 4. Automatic hover-tilt disablement on mobile touch screens for zero sticking on tap
 */
export default function ThreeDCard({
  children,
  className = "",
  maxTilt = 15,
  scaleOnHover = 1.03,
  glareOpacity = 0.25,
  perspective = 1000,
  horizontalOnly = false,
  maxHorizontalShift = 18,
  onClick,
  enableParallax = true,
  parallaxSpeed,
  index = 0,
}) {
  const outerWrapperRef = useRef(null);
  const cardRef = useRef(null);
  const [isTouchOrMobile, setIsTouchOrMobile] = useState(false);

  // Parallax physics lerp refs (zero React re-renders on scroll)
  const targetY = useRef(0);
  const currentY = useRef(0);
  const targetPitch = useRef(0);
  const currentPitch = useRef(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef(null);
  const isIntersecting = useRef(false);

  // Staggered speeds across adjacent columns for multi-plane depth
  const defaultSpeeds = [0.05, -0.035, 0.065, -0.04];
  const effectiveSpeed =
    typeof parallaxSpeed === "number"
      ? parallaxSpeed
      : defaultSpeeds[index % defaultSpeeds.length];

  // Detect mobile or touch devices
  useEffect(() => {
    const checkMobile = () => {
      const isMobile =
        window.innerWidth <= 768 ||
        window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsTouchOrMobile(isMobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll Parallax Engine (Lerp physics & direct DOM transform)
  useEffect(() => {
    if (!enableParallax) return;

    const el = outerWrapperRef.current;
    if (!el) return;

    // IntersectionObserver to only compute parallax when card is near/in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting.current = entry.isIntersecting;
      },
      { rootMargin: "150px 0px 150px 0px" }
    );
    observer.observe(el);

    const updateParallaxTarget = () => {
      if (!isIntersecting.current || !outerWrapperRef.current) return;

      const rect = outerWrapperRef.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const cardCenter = rect.top + rect.height / 2;
      const diffY = cardCenter - viewportCenter;

      // Calculate speed (dampened on mobile for ultra-smooth momentum)
      const appliedSpeed = isTouchOrMobile ? effectiveSpeed * 0.35 : effectiveSpeed;
      targetY.current = diffY * appliedSpeed;

      // Scroll velocity pitch calculation (desktop only)
      if (!isTouchOrMobile) {
        const now = performance.now();
        const dt = Math.max(now - lastTime.current, 8);
        const scrollDelta = window.scrollY - lastScrollY.current;
        const velocity = scrollDelta / dt;
        lastScrollY.current = window.scrollY;
        lastTime.current = now;

        targetPitch.current = Math.min(Math.max(velocity * 1.8, -2.5), 2.5);
      }
    };

    // Smooth 60-120fps lerp loop
    const animateLoop = () => {
      if (isIntersecting.current && outerWrapperRef.current) {
        // Physics lerp formula: current += (target - current) * factor
        const lerpFactor = isTouchOrMobile ? 0.12 : 0.08;
        currentY.current += (targetY.current - currentY.current) * lerpFactor;
        currentPitch.current += (targetPitch.current - currentPitch.current) * 0.1;

        const roundedY = parseFloat(currentY.current.toFixed(1));
        const roundedPitch = parseFloat(currentPitch.current.toFixed(2));

        if (isTouchOrMobile) {
          outerWrapperRef.current.style.transform = `translate3d(0, ${roundedY}px, 0)`;
        } else {
          outerWrapperRef.current.style.transform = `translate3d(0, ${roundedY}px, 0) rotateX(${roundedPitch}deg)`;
        }
      }

      rafId.current = requestAnimationFrame(animateLoop);
    };

    window.addEventListener("scroll", updateParallaxTarget, { passive: true });
    updateParallaxTarget();
    rafId.current = requestAnimationFrame(animateLoop);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateParallaxTarget);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enableParallax, effectiveSpeed, isTouchOrMobile]);

  // Mouse tilt state (desktop hover only)
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    translateX: 0,
    translateY: 0,
    scale: 1,
  });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (isTouchOrMobile || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const px = mouseX / width;
      const py = mouseY / height;

      if (horizontalOnly) {
        const translateX = (px - 0.5) * 2 * maxHorizontalShift;
        setTransform({
          rotateX: 0,
          rotateY: 0,
          translateX: parseFloat(translateX.toFixed(2)),
          translateY: 0,
          scale: scaleOnHover,
        });
      } else {
        const rotateX = (py - 0.5) * -2 * maxTilt;
        const rotateY = (px - 0.5) * 2 * maxTilt;
        setTransform({
          rotateX: parseFloat(rotateX.toFixed(2)),
          rotateY: parseFloat(rotateY.toFixed(2)),
          translateX: 0,
          translateY: 0,
          scale: scaleOnHover,
        });
      }

      setGlare({
        x: parseFloat((px * 100).toFixed(1)),
        y: parseFloat((py * 100).toFixed(1)),
        opacity: glareOpacity,
      });
    },
    [isTouchOrMobile, maxTilt, scaleOnHover, glareOpacity, horizontalOnly, maxHorizontalShift]
  );

  const handleMouseEnter = () => {
    if (!isTouchOrMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isTouchOrMobile) {
      setIsHovered(false);
      setTransform({ rotateX: 0, rotateY: 0, translateX: 0, translateY: 0, scale: 1 });
      setGlare((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={outerWrapperRef}
      className={`relative will-change-transform ${className}`}
      style={{
        transformStyle: isTouchOrMobile ? "flat" : "preserve-3d",
      }}
    >
      {/* If mobile screen, render flat card without hover tilt */}
      {isTouchOrMobile ? (
        <div onClick={onClick} className="relative block w-full h-full">
          {children}
        </div>
      ) : (
        /* Desktop rich 3D perspective & specular glare */
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onClick}
          style={{ perspective: `${perspective}px` }}
          className="relative inline-block w-full h-full transition-perspective duration-300"
        >
          <div
            className="relative w-full h-full preserve-3d transition-transform ease-out"
            style={{
              transform: `translate3d(${transform.translateX}px, ${transform.translateY}px, 0px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(${transform.scale}, ${transform.scale}, ${transform.scale})`,
              transitionDuration: isHovered ? "100ms" : "500ms",
            }}
          >
            {children}

            {/* Specular Light Sheen Overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-inherit overflow-hidden transition-opacity duration-300 z-50"
              style={{
                opacity: glare.opacity,
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)`,
                borderRadius: "inherit",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
