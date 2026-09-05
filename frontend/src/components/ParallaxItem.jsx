import React, { useEffect, useRef, useState } from "react";

/**
 * ParallaxItem Component
 * Wraps any element to give it a smooth, subtle scroll-driven parallax translation.
 * Automatically disabled on mobile phones and reduced-motion environments
 * to preserve 60-120fps performance.
 */
export default function ParallaxItem({
  children,
  speed = 0.08,
  className = "",
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const isMobile =
      window.innerWidth <= 768 ||
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobile) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            // Distance from viewport center
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            const diff = elementCenter - viewportCenter;
            setOffset(diff * speed);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(0, ${offset.toFixed(1)}px, 0)`,
        willChange: offset !== 0 ? "transform" : "auto",
      }}
    >
      {children}
    </div>
  );
}
