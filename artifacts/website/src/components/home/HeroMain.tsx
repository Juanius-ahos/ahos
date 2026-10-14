import { Link } from "wouter";
import { Magnetic } from "../motion";

/**
 * Hero: the dotted sphere (HeroCanvas) as the focal point, wrapped in a drifting
 * orange aurora, with a staggered blur-and-rise entrance. The entrance is pure
 * CSS (animation-fill-mode both) so it is reliable and always resolves to the
 * visible state, even if scripting/hydration hiccups. Original AHOS art
 * direction, AHOS's own voice.
 */
export function HeroMain() {
  return (
    <header className="hm">
      {/* Painterly orange aurora behind the sphere */}
      <div className="hm-aurora hm-aurora-a" aria-hidden="true" />
      <div className="hm-aurora hm-aurora-b" aria-hidden="true" />

      <span className="hm-side" aria-hidden="true"><i className="hm-side-dot" />ONLINE · BEIRUT</span>

      <div className="hm-inner">
        <div className="hm-eyebrow hm-rise" style={{ animationDelay: "0.1s" }}><span className="hm-eyebrow-dot" />An independent product studio in Beirut, building for founders worldwide</div>
        <h1 className="hm-h1 hm-rise" style={{ animationDelay: "0.22s" }}>
          Websites, apps &amp; software<br />
          that <em>pay for themselves.</em>
        </h1>
        <p className="hm-sub hm-rise" style={{ animationDelay: "0.38s" }}>
          One team, from the first sketch to launch. A price fixed in writing, code that is 100% yours, and a real person who answers within a day, not a ticket queue.
        </p>
        <div className="hm-actions hm-rise" style={{ animationDelay: "0.52s" }}>
          <Magnetic strength={0.4}><Link href="/contact" className="hm-btn">Start a project <span aria-hidden="true">↗</span></Link></Magnetic>
          <span className="hm-rating"><span className="hm-stars" aria-hidden="true">★★★★★</span> 5.0 on Trustpilot · 50+ shipped</span>
        </div>
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

/* Reliable CSS entrance: starts hidden (fill: both), always resolves visible. */
@keyframes hm-rise { from { opacity: 0; transform: translateY(28px); filter: blur(12px); } to { opacity: 1; transform: none; filter: none; } }
.hm-rise { animation: hm-rise 0.9s cubic-bezier(0.22,1,0.36,1) both; }

/* Drifting aurora blobs, painterly orange glow around the sphere */
.hm-aurora { position: absolute; z-index: 0; border-radius: 50%; pointer-events: none; filter: blur(90px); opacity: 0.5; will-change: transform; }
.hm-aurora-a { width: 46vw; height: 46vw; left: -6vw; top: -4vw; background: radial-gradient(circle, rgba(255,106,26,0.28), transparent 66%); animation: hm-drift-a 18s ease-in-out infinite; }
.hm-aurora-b { width: 40vw; height: 40vw; right: -6vw; bottom: -6vw; background: radial-gradient(circle, rgba(255,150,60,0.20), transparent 66%); animation: hm-drift-b 22s ease-in-out infinite; }
@keyframes hm-drift-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(6vw, 4vw) scale(1.15); } }
@keyframes hm-drift-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-5vw, -3vw) scale(1.12); } }

.hm-inner { position: relative; z-index: 2; width: min(1000px, 100%); display: flex; flex-direction: column; align-items: center; }

.hm-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-sans); font-size: clamp(12px, 1.3vw, 15px); letter-spacing: 0.01em; color: var(--text-dim); margin-bottom: clamp(22px, 3vw, 34px); max-width: 44ch; }
.hm-eyebrow-dot { width: 7px; height: 7px; flex-shrink: 0; border-radius: 50%; background: #46d27e; box-shadow: 0 0 0 0 rgba(70,210,126,0.5); animation: hm-pulse 2.2s infinite; }

.hm-h1 { font-family: var(--font-display); font-size: clamp(36px, 6.2vw, 92px); font-weight: 700; line-height: 0.92; letter-spacing: -0.045em; color: var(--text); margin: 0; text-shadow: 0 2px 40px rgba(10,10,11,0.65); }
.hm-h1 em { font-style: normal; color: var(--orange); }

.hm-sub { margin: clamp(20px, 2.4vw, 30px) 0 0; max-width: 600px; font-size: clamp(15px, 1.6vw, 18px); line-height: 1.6; color: var(--text-muted); }

.hm-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 22px; margin-top: clamp(24px, 3vw, 34px); }
.hm-btn { display: inline-flex; align-items: center; gap: 10px; padding: 15px 30px; border-radius: 999px; background: var(--orange); color: #0a0a0b; font-size: 15px; font-weight: 700; box-shadow: 0 10px 34px rgba(255,106,26,0.32); transition: transform 0.25s, box-shadow 0.3s, background 0.25s; }
.hm-btn span { display: inline-block; transition: transform 0.3s; }
.hm-btn:hover { transform: translateY(-2px); background: var(--orange-light); box-shadow: 0 16px 44px rgba(255,106,26,0.42); }
.hm-btn:hover span { transform: translate(3px,-3px); }
.hm-rating { font-size: 13px; font-weight: 500; color: var(--text-dim); }
.hm-stars { color: var(--orange); letter-spacing: 1.5px; }

/* Vertical side label (left; right side is reserved for the scroll indicator) */
.hm-side { position: absolute; top: 50%; left: clamp(14px, 2.5vw, 40px); transform: translateY(-50%); z-index: 2; writing-mode: vertical-rl; text-orientation: mixed; display: inline-flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-faint); }
.hm-side-dot { width: 6px; height: 6px; border-radius: 50%; background: #46d27e; box-shadow: 0 0 0 0 rgba(70,210,126,0.5); animation: hm-pulse 2.2s infinite; }
@keyframes hm-pulse { 0%{box-shadow:0 0 0 0 rgba(70,210,126,0.5);} 70%{box-shadow:0 0 0 7px rgba(70,210,126,0);} 100%{box-shadow:0 0 0 0 rgba(70,210,126,0);} }

/* Scroll cue */
.hm-scroll { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); z-index: 2; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase; color: var(--text-faint); }
.hm-scroll::after { content: ""; display: block; width: 1px; height: 34px; margin: 10px auto 0; background: linear-gradient(var(--orange), transparent); animation: hm-cue 2.4s ease-in-out infinite; }
@keyframes hm-cue { 0%,100%{ transform: scaleY(0.4); opacity: 0.4; transform-origin: top; } 50%{ transform: scaleY(1); opacity: 1; transform-origin: top; } }

@media (max-width: 768px) {
  .hm-side { display: none; }
  .hm { min-height: 82vh; }
  .hm-h1 { font-size: clamp(38px, 12vw, 60px); }
  .hm-aurora { filter: blur(60px); opacity: 0.4; }
}
@media (max-width: 480px) {
  .hm-scroll { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hm-rise { animation: none; }
  .hm-scroll::after, .hm-side-dot, .hm-eyebrow-dot, .hm-aurora { animation: none; }
}
`;
