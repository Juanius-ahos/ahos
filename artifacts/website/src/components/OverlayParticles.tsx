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
    const count = isMobile ? 45 : 100;

    interface Particle {
      baseY: number;
      x: number;
      y: number;
      size: number;
      color: string;
      baseAlpha: number;
      parallax: number;
      phase: number;
      rot: number;
      rotSpeed: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let color: string, alpha: number, size: number;

      if (roll < 0.3) {
        // orange — main accent
        color = "#ff6a1a";
        alpha = 0.25 + Math.random() * 0.4;
        size = 2 + Math.random() * 3;
      } else if (roll < 0.5) {
        // dim orange
        color = "#ff8c4a";
        alpha = 0.12 + Math.random() * 0.2;
        size = 1.5 + Math.random() * 2;
      } else if (roll < 0.7) {
        // light gray
        color = "#e0dfe6";
        alpha = 0.08 + Math.random() * 0.15;
        size = 1 + Math.random() * 1.5;
      } else if (roll < 0.88) {
        // mid gray
        color = "#706f78";
        alpha = 0.06 + Math.random() * 0.12;
        size = 1 + Math.random() * 1.2;
      } else {
        // faint white
        color = "#ffffff";
        alpha = 0.04 + Math.random() * 0.08;
        size = 0.8 + Math.random() * 1;
      }

      const baseY = Math.random() * (h + 200);
      particles.push({
        baseY,
        x: Math.random() * w,
        y: baseY,
        size,
        color,
        baseAlpha: alpha,
        parallax: 0.12 + Math.random() * 0.85,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.003,
      });
    }

    let lastScroll = window.scrollY;
    let scrollDelta = 0;
    let raf = 0;
    let particleAlphaMult = 1;

    const onScroll = () => {
      const cur = window.scrollY;
      scrollDelta = cur - lastScroll;
      lastScroll = cur;

      // Reduce particle intensity near light section
      const lightEl = document.querySelector('.section-light');
      if (lightEl) {
        const rect = lightEl.getBoundingClientRect();
        const proximity = 1 - Math.min(Math.abs(rect.top) / window.innerHeight, 1);
        particleAlphaMult = 1 - proximity * 0.6;
      } else {
        particleAlphaMult = 1;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const intensity = Math.min(Math.abs(scrollDelta) * 0.015, 1);

      // ── Corner glow — opposite to globe, cinematic depth ──
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPct = scrollMax > 0 ? lastScroll / scrollMax : 0;
      const isLight = document.documentElement.dataset.theme === "light";

      // Globe goes right (x:8) → left (x:-7). Glow starts bottom-left, drifts right.
      const glowX = w * (0.08 + scrollPct * 0.25);
      const glowY = h * 0.88;
      const glowRadius = Math.min(w, h) * 0.55;

      let glowAlpha = isLight ? 0.03 : 0.09;
      // Dim near light section
      const lightEl = document.querySelector('.section-light');
      if (lightEl) {
        const rect = lightEl.getBoundingClientRect();
        const dist = Math.abs(rect.top) / window.innerHeight;
        if (dist < 1.2) glowAlpha *= Math.max(0.15, dist / 1.2);
      }
      // Subtle brighten on fast scroll
      glowAlpha += intensity * 0.03;
      glowAlpha = Math.min(glowAlpha, isLight ? 0.05 : 0.12);

      // Soft corner gradient — anchored bottom-left, fading toward center
      const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
      glow.addColorStop(0, `rgba(255, 106, 26, ${glowAlpha})`);
      glow.addColorStop(0.35, `rgba(255, 106, 26, ${glowAlpha * 0.4})`);
      glow.addColorStop(0.7, `rgba(255, 106, 26, ${glowAlpha * 0.08})`);
      glow.addColorStop(1, "rgba(255, 106, 26, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // ── Overlay particles ──
      for (const p of particles) {
        p.y = p.baseY - lastScroll * p.parallax;
        p.x += scrollDelta * 0.05 * (p.parallax + 0.15) * Math.sin(p.phase);
        p.rot += p.rotSpeed + scrollDelta * 0.001;

        if (p.y < -20) p.baseY += h + 40;
        if (p.y > h + 20) p.baseY -= h + 40;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        const alpha = p.baseAlpha * (0.45 + intensity * 0.55) * particleAlphaMult;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      scrollDelta *= 0.9;
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
