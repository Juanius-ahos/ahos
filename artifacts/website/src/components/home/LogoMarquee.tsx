const LOGOS = [
  "SpeeAligner",
  "Jul's Auto",
  "Aleph",
  "Ido Taxi",
  "YourProvider",
  "defi.app",
  "ARIA AI",
];

const rm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pause = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; };
const resume = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = ""; };

export function LogoMarquee() {
  return (
    <section className="lm" aria-label="Clients">
      <style>{css}</style>
      <div className="lm-row">
        <div className="lm-track" onMouseEnter={pause} onMouseLeave={resume}>
          {[...LOGOS, ...LOGOS, ...LOGOS].map((name, i) => (
            <span key={i} className="lm-logo">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const css = `
.lm { border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); background: var(--bg-2); overflow: hidden; }
.lm-row { display: flex; overflow: hidden; }
.lm-track { display: flex; flex-shrink: 0; align-items: center; gap: clamp(48px, 6vw, 80px); animation: lm-scroll 30s linear infinite; will-change: transform; padding: 0 clamp(24px, 4vw, 48px); }
.lm-logo { flex-shrink: 0; font-family: var(--font-display); font-size: clamp(14px, 1.4vw, 18px); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-faint); white-space: nowrap; transition: color 0.3s; }
.lm-logo:hover { color: var(--text-dim); }
.lm-track:hover { animation-play-state: paused; }
@keyframes lm-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
@media (prefers-reduced-motion: reduce) { .lm-track { animation: none; } }
`;
