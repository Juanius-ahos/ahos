import { Link } from "wouter";

export function HeroMain() {
  return (
    <header className="hm">
      <span className="hm-side hm-side-l" aria-hidden="true"><i className="hm-side-dot" />ONLINE</span>
      <span className="hm-side hm-side-r" aria-hidden="true">BEIRUT · LEBANON</span>

      <div className="hm-inner">
        <h1 className="hm-h1">
          Your digital partner.<br />
          <em>Evolved.</em>
        </h1>
        <p className="hm-sub">
          A five-phase method that transforms how your business runs on technology.
          An AI-first studio — and your end-to-end tech partner.
        </p>
      </div>

      <div className="hm-scroll" aria-hidden="true">SCROLL</div>

      <style>{css}</style>
    </header>
  );
}

const css = `
.hm {
  position: relative; z-index: 1;
  min-height: 88vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center;
  padding: clamp(78px, 12vh, 128px) var(--gutter) clamp(52px, 8vh, 92px);
  overflow: hidden;
}
.hm-inner { position: relative; z-index: 2; width: min(1000px, 100%); display: flex; flex-direction: column; align-items: center; }

.hm-h1 { font-family: var(--font-display); font-size: clamp(42px, 8vw, 120px); font-weight: 700; line-height: 0.88; letter-spacing: -0.045em; color: var(--text); margin: 0; text-shadow: 0 2px 40px rgba(10,10,11,0.65); }
.hm-h1 em { font-style: normal; color: var(--orange); }

.hm-sub { margin: clamp(24px, 3vw, 40px) 0 0; max-width: 640px; font-size: clamp(16px, 1.8vw, 20px); line-height: 1.6; color: var(--text-muted); }

/* Vertical side labels */
.hm-side { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; writing-mode: vertical-rl; text-orientation: mixed; display: inline-flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-faint); }
.hm-side-l { left: clamp(14px, 2.5vw, 40px); }
.hm-side-r { right: clamp(14px, 2.5vw, 40px); }
.hm-side-dot { width: 6px; height: 6px; border-radius: 50%; background: #46d27e; box-shadow: 0 0 0 0 rgba(70,210,126,0.5); animation: hm-pulse 2.2s infinite; }
@keyframes hm-pulse { 0%{box-shadow:0 0 0 0 rgba(70,210,126,0.5);} 70%{box-shadow:0 0 0 7px rgba(70,210,126,0);} 100%{box-shadow:0 0 0 0 rgba(70,210,126,0);} }

/* Scroll cue */
.hm-scroll { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); z-index: 2; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase; color: var(--text-faint); }
.hm-scroll::after { content: ""; display: block; width: 1px; height: 34px; margin: 10px auto 0; background: linear-gradient(var(--orange), transparent); animation: hm-cue 2.4s ease-in-out infinite; }
@keyframes hm-cue { 0%,100%{ transform: scaleY(0.4); opacity: 0.4; transform-origin: top; } 50%{ transform: scaleY(1); opacity: 1; transform-origin: top; } }

@media (max-width: 768px) {
  .hm-side { display: none; }
  .hm { min-height: 82vh; }
  .hm-h1 { font-size: clamp(42px, 12vw, 64px); }
}
@media (max-width: 480px) {
  .hm-scroll { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hm-scroll::after, .hm-side-dot { animation: none; }
}
`;
