import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Enable only on non-touch desktop screens
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let points = [];
    const MAX_POINTS = 35; // Trail length

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let mouseX = -200;
    let mouseY = -200;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPosition({ x: mouseX, y: mouseY });
      if (!isVisible) setIsVisible(true);

      // Add new fluid trail point
      points.push({
        x: mouseX,
        y: mouseY,
        vx: 0,
        vy: 0,
        life: 1.0,
      });

      // Hover check for interactive elements
      const target = e.target;
      const isInteractive = target.closest(
        "a, button, input, textarea, select, [role='button'], .interactive-hover"
      );
      setIsHovered(!!isInteractive);
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);

    // Fluid motion trail rendering loop
    const renderTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Keep points bounded
      if (points.length > MAX_POINTS) {
        points.shift();
      }

      // Decay points and apply fluid physics
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        pt.life -= 0.025; // Fade rate
        pt.x += (Math.random() - 0.5) * 0.4;
        pt.y += (Math.random() - 0.5) * 0.4;
      }

      points = points.filter((p) => p.life > 0);

      // Draw fluid motion green ribbon trail
      if (points.length > 2) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        // Fluid Green Shade Gradient (Lime -> Emerald -> Teal)
        const headPt = points[points.length - 1];
        const tailPt = points[0];
        const gradient = ctx.createLinearGradient(tailPt.x, tailPt.y, headPt.x, headPt.y);

        gradient.addColorStop(0, "rgba(163, 230, 53, 0)"); // Lime 400 transparent
        gradient.addColorStop(0.3, "rgba(52, 211, 153, 0.4)"); // Emerald 400
        gradient.addColorStop(0.7, "rgba(16, 185, 129, 0.85)"); // Emerald 500
        gradient.addColorStop(1, "rgba(5, 150, 105, 0.95)"); // Emerald 600

        ctx.strokeStyle = gradient;
        ctx.lineWidth = isHovered ? 28 : 18;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Green Glow Shadow Effect
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = isHovered ? 35 : 22;

        ctx.stroke();

        // Draw fluid inner core highlight line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = isHovered ? 6 : 4;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(renderTrail);
    };

    renderTrail();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, isHovered]);

  if (!isVisible) return null;

  return (
    <>
      {/* HTML5 Canvas for Green Fluid Motion Ribbon Trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40 hidden md:block"
      />

      {/* Crisp Pointer Arrow Head */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-75 ease-out hidden md:block ${
          isHovered ? "scale-125" : isMouseDown ? "scale-90" : "scale-100"
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md -ml-1 -mt-1"
        >
          <defs>
            <linearGradient id="fluidGreenPointerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a3e635" /> {/* Lime 400 */}
              <stop offset="50%" stopColor="#10b981" /> {/* Emerald 500 */}
              <stop offset="100%" stopColor="#047857" /> {/* Emerald 700 */}
            </linearGradient>
          </defs>
          <path
            d="M3 3L10.5 21L13.8 13.8L21 10.5L3 3Z"
            fill="url(#fluidGreenPointerGrad)"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
