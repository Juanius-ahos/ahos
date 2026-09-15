import { Link } from "wouter";

export function HeroMain() {
  return (
    <header className="hm">
      <div className="hm-inner">
        <h1 className="hm-h1">
          Your digital partner.<br />
          <em>Evolved.</em>
        </h1>
        <p className="hm-sub">
          A five-phase method that transforms how your business runs on technology.
          An AI-first agency — and your end-to-end tech partner.
        </p>
      </div>

      <div className="hm-scroll" aria-hidden="true">SCROLL</div>

      <style>{css}</style>
    </header>
  );
}

const css = `
.hm {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(100px, 16vh, 200px) var(--gutter) clamp(60px, 10vh, 120px);
  overflow: hidden;
}
.hm-inner {
  position: relative;
  z-index: 2;
  width: min(1000px, 100%);
  margin: 0 auto;
  text-align: center;
}

.hm-h1 {
  font-family: var(--font-display);
  font-size: clamp(46px, 12vw, 190px);
  font-weight: 600;
  line-height: 0.9;
  letter-spacing: -0.05em;
  color: var(--text);
  margin: 0;
}
.hm-h1 em {
  color: var(--orange);
  font-style: italic;
  font-weight: 400;
  font-size: 0.55em;
  font-family: var(--font-sans);
}

.hm-sub {
  margin: clamp(24px, 4vw, 48px) auto 0;
  max-width: 560px;
  font-size: clamp(15px, 1.5vw, 18px);
  line-height: 1.7;
  color: var(--text-muted);
}

/* Scroll cue */
.hm-scroll {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-faint);
  z-index: 2;
}
.hm-scroll::after {
  content: "";
  display: block;
  width: 1px;
  height: 36px;
  margin: 10px auto 0;
  background: linear-gradient(var(--orange), transparent);
  animation: hm-cue 2.4s ease-in-out infinite;
}
@keyframes hm-cue {
  0%,100%{ transform: scaleY(0.4); opacity: 0.4; transform-origin: top; }
  50%{ transform: scaleY(1); opacity: 1; transform-origin: top; }
}

@media (max-width: 768px) {
  .hm { min-height: 92vh; padding-bottom: 40px; }
  .hm-h1 { font-size: clamp(38px, 13vw, 60px); }
}
@media (max-width: 480px) {
  .hm-scroll { display: none; }
  .hm-h1 { font-size: clamp(32px, 15vw, 42px); }
  .hm-h1 em { font-size: 0.5em; }
}
@media (prefers-reduced-motion: reduce) {
  .hm-scroll::after { animation: none; }
}
`;
