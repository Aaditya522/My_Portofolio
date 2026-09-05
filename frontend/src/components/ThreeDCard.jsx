import React, { useState, useRef, useCallback } from "react";

/**
 * ThreeDCard Component
 * Wraps content in a Perspective card with interactive mouse tracking.
 * Supports full 3D tilt or horizontal-only smooth translation mode without bending/vertical shift.
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
}) {
  const cardRef = useRef(null);
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
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Calculate mouse offset relative to card center (-0.5 to 0.5)
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const px = mouseX / width;
      const py = mouseY / height;

      if (horizontalOnly) {
        // Horizontal-only glide: strictly NO bending (rotateX=0, rotateY=0) and NO vertical shift (translateY=0)
        const translateX = (px - 0.5) * 2 * maxHorizontalShift;
        setTransform({
          rotateX: 0,
          rotateY: 0,
          translateX: parseFloat(translateX.toFixed(2)),
          translateY: 0,
          scale: scaleOnHover,
        });
      } else {
        // Full 3D tilt
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
    [maxTilt, scaleOnHover, glareOpacity, horizontalOnly, maxHorizontalShift]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0, translateX: 0, translateY: 0, scale: 1 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: `${perspective}px` }}
      className={`relative inline-block transition-perspective duration-300 ${className}`}
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
  );
}
