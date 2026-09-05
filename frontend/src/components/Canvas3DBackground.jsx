import React, { useEffect, useRef } from "react";

export default function Canvas3DBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse position in normalized 3D space
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 3D Particles with Electric Violet, Cyan, and Fuchsia palette
    const particleCount = Math.min(Math.floor(width / 18), 75);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 1000 + 100, // Depth
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#06b6d4" : "#d946ef",
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.5,
      });
    }

    // Floating 3D Geometric Wireframe Polyhedra
    const shapes = [
      { x: width * 0.15, y: height * 0.25, z: 400, size: 45, rotX: 0, rotY: 0, speedX: 0.005, speedY: 0.008, color: "#8b5cf6" },
      { x: width * 0.85, y: height * 0.35, z: 500, size: 60, rotX: 0, rotY: 0, speedX: -0.006, speedY: 0.004, color: "#06b6d4" },
      { x: width * 0.75, y: height * 0.85, z: 350, size: 50, rotX: 0, rotY: 0, speedX: 0.007, speedY: -0.005, color: "#d946ef" },
      { x: width * 0.12, y: height * 0.75, z: 450, size: 40, rotX: 0, rotY: 0, speedX: -0.004, speedY: -0.006, color: "#3b82f6" },
    ];

    const fov = 400; // Field of view

    const render = () => {
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep Midnight Obsidian 3D ambient background gradient
      const bgGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        50,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, "#0e0c24");
      bgGrad.addColorStop(0.5, "#05050a");
      bgGrad.addColorStop(1, "#020204");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render 3D Particles & Connections
      const projectedParticles = [];

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.z < 50) p.z = 1000;
        if (p.z > 1100) p.z = 50;

        const scale = fov / p.z;
        const projX = (p.x + (mouse.x - width / 2) * 0.1) * scale + width / 2;
        const projY = (p.y + (mouse.y - height / 2) * 0.1) * scale + height / 2;
        const projR = Math.max(0.5, p.radius * scale);

        projectedParticles.push({ x: projX, y: projY, r: projR, color: p.color, z: p.z, scale });

        ctx.beginPath();
        ctx.arc(projX, projY, projR, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, scale * 1.2);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10 * scale;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw connection web between close 3D particles
      for (let i = 0; i < projectedParticles.length; i++) {
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p1 = projectedParticles[i];
          const p2 = projectedParticles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 110) * 0.25 * Math.min(p1.scale, p2.scale);
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Render Floating 3D Geometric Polyhedra (Wireframe Cubes)
      for (let s of shapes) {
        s.rotX += s.speedX;
        s.rotY += s.speedY;

        const scale = fov / s.z;
        const centerX = (s.x - width / 2 + (mouse.x - width / 2) * 0.15) * scale + width / 2;
        const centerY = (s.y - height / 2 + (mouse.y - height / 2) * 0.15) * scale + height / 2;
        const sz = s.size * scale;

        const rawVertices = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
        ];

        const rotatedVertices = rawVertices.map(([vx, vy, vz]) => {
          let x1 = vx * Math.cos(s.rotY) + vz * Math.sin(s.rotY);
          let z1 = -vx * Math.sin(s.rotY) + vz * Math.cos(s.rotY);
          let y2 = vy * Math.cos(s.rotX) - z1 * Math.sin(s.rotX);

          return [
            centerX + x1 * sz,
            centerY + y2 * sz,
          ];
        });

        const edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];

        ctx.globalAlpha = 0.35 * scale;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 15;

        for (let [e1, e2] of edges) {
          ctx.beginPath();
          ctx.moveTo(rotatedVertices[e1][0], rotatedVertices[e1][1]);
          ctx.lineTo(rotatedVertices[e2][0], rotatedVertices[e2][1]);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
    />
  );
}
