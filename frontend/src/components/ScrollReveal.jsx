import React, { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.12,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold]);

  const delayClass = delay ? `delay-${delay}` : "";

  return (
    <div
      ref={ref}
      className={`reveal-hidden ${isVisible ? "reveal-visible" : ""} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
