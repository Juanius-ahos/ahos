import { useEffect, useRef } from "react";

export function OverlayParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 40 : 90;

    const colors = [
      { r: 255, g: 106, b: 26 },
      { r: 255, g: 106, b: 26 },
      { r: 255, g: 140, b: 74 },
      { r: 160, g: 160, b: 170 },
      { r: 120, g: 120, b: 130 },
      { r: 200, g: 200, b: 210 },
      { r: 90, g: 90, b: 100 },
    ];

    interface Particle {
      baseY: number;
      x: number;
      y: number;
      size: number;
      color: { r: number; g: number; b: number };
      alpha: number;
      parallax: number;
      phase: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() < 0.15
        ? 1.5 + Math.random() * 2.5
        : 0.4 + Math.random() * 1.2;
      const baseY = Math.random() * h;
      particles.push({
        baseY,
        x: Math.random() * w,
        y: baseY,
        size,
        color,
        alpha: 0.08 + Math.random() * 0.25,
        parallax: 0.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let lastScroll = window.scrollY;
    let scrollDelta = 0;
    let raf = 0;

    const onScroll = () => {
      const cur = window.scrollY;
      scrollDelta = cur - lastScroll;
      lastScroll = cur;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const absDelta = Math.abs(scrollDelta);
      const intensity = Math.min(absDelta * 0.02, 1);

      for (const p of particles) {
        // move with scroll
        p.y = p.baseY - lastScroll * p.parallax;

        // drift sideways proportional to scroll speed
        p.x += scrollDelta * 0.08 * (p.parallax + 0.3) * Math.sin(p.phase);

        // wrap
        if (p.y < -20) p.baseY += h + 40;
        if (p.y > h + 20) p.baseY -= h + 40;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        // alpha tied to scroll activity — dim when still, bright when scrolling
        const targetAlpha = p.alpha * (0.15 + intensity * 0.85);
        const drawAlpha = targetAlpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${drawAlpha})`;
        ctx.fill();
      }

      // decay scroll delta when not scrolling
      scrollDelta *= 0.92;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
