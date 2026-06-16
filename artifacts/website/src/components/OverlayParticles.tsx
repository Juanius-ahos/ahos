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
    const count = isMobile ? 50 : 110;

    const colors = [
      { r: 255, g: 106, b: 26 },
      { r: 255, g: 106, b: 26 },
      { r: 255, g: 140, b: 74 },
      { r: 255, g: 180, b: 120 },
      { r: 180, g: 180, b: 190 },
      { r: 220, g: 220, b: 230 },
      { r: 140, g: 140, b: 150 },
      { r: 100, g: 100, b: 110 },
    ];

    interface Particle {
      baseY: number;
      x: number;
      y: number;
      size: number;
      color: { r: number; g: number; b: number };
      baseAlpha: number;
      parallax: number;
      phase: number;
      speed: number;
      glow: boolean;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isLarge = Math.random() < 0.12;
      const isMedium = !isLarge && Math.random() < 0.25;
      const size = isLarge ? 2.5 + Math.random() * 3.5
        : isMedium ? 1.2 + Math.random() * 1.5
        : 0.5 + Math.random() * 0.9;
      const baseY = Math.random() * (h + 200);
      particles.push({
        baseY,
        x: Math.random() * w,
        y: baseY,
        size,
        color,
        baseAlpha: isLarge ? 0.5 + Math.random() * 0.35 : isMedium ? 0.3 + Math.random() * 0.3 : 0.15 + Math.random() * 0.25,
        parallax: 0.15 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        glow: isLarge && color.r > 200,
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
      const intensity = Math.min(absDelta * 0.015, 1);

      for (const p of particles) {
        p.y = p.baseY - lastScroll * p.parallax;

        p.x += scrollDelta * 0.06 * (p.parallax + 0.2) * Math.sin(p.phase);

        if (p.y < -30) p.baseY += h + 60;
        if (p.y > h + 30) p.baseY -= h + 60;
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;

        const alpha = p.baseAlpha * (0.5 + intensity * 0.5);

        if (p.glow) {
          ctx.save();
          ctx.globalAlpha = alpha * 0.25;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${p.color.r},${p.color.g},${p.color.b})`;
          ctx.fill();
          ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`;
        ctx.fill();
      }

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
        zIndex: 9999,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
