import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

const ASSURE = ["Fixed price, in writing", "You own the code", "Live in days, not months"];

// Scripted showcase, no live API. ARIA's real backend is being upgraded, so the
// tile plays a canned example on a loop instead of hitting a flaky service.
const DEMOS: [string, string][] = [
  ["A booking app for my salon", "A salon booking app usually runs about six weeks: online scheduling, reminders, and payments. Want a rough plan and a quote?"],
  ["An online store", "Nice. A clean store on Shopify or fully custom, live in a few weeks with fast checkout and real analytics built in."],
  ["An AI tool for my team", "Love it. Tell me the busywork you want gone and we'll map what's worth automating first."],
];

/**
 * Bento-grid hero. The ARIA tile is a self-playing showcase while the real AI
 * backend is being upgraded, with a clear CTA to the (reliable) contact flow.
 */
export function HeroAria() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [user, aria] = DEMOS[idx];
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) { setTyped(aria.length); return; }
    setTyped(0);
    let i = 0;
    const type = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= aria.length) {
        clearInterval(type);
        // Hold the finished reply, then advance to the next example.
        setTimeout(() => setIdx((n) => (n + 1) % DEMOS.length), 2600);
      }
    }, 26);
    return () => clearInterval(type);
  }, [idx, aria, reduced]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [typed]);

  return (
    <header className="hb" data-accent="255,106,26">
      <style>{css}</style>
      <div className="hb-grid">

        {/* Headline */}
        <div className="hb-tile hb-headline">
          <div className="hb-eyebrow"><span className="hb-dot" />Digital product studio · Beirut → Worldwide</div>
          <h1 className="hb-h1">Websites, apps &amp; software that <em>pay for themselves.</em></h1>
          <div className="hb-headline-foot">
            <Link href="/contact" className="hb-btn">Start a project <span aria-hidden="true">↗</span></Link>
            <span className="hb-rating"><span className="hb-stars" aria-hidden="true">★★★★★</span> 5.0 on Trustpilot · 50+ shipped</span>
          </div>
        </div>

        {/* Stat */}
        <div className="hb-tile hb-stat">
          <span className="hb-stat-label">Since 2023</span>
          <div>
            <div className="hb-stat-num">50+</div>
            <div className="hb-stat-sub">products designed, built, and shipped for founders worldwide</div>
          </div>
        </div>

        {/* ARIA showcase (backend upgrading) */}
        <div className="hb-tile hb-aria">
          <div className="hb-aria-head">
            <span className="hb-aria-avatar" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.4L20 10l-6.1 1.6L12 18l-1.9-6.4L4 10l6.1-1.6z" /></svg>
            </span>
            <div className="hb-aria-id">
              <strong>ARIA</strong>
              <span>AI project advisor</span>
            </div>
            <span className="hb-aria-badge">Upgrading</span>
          </div>

          <div className="hb-aria-demo" ref={scrollRef} aria-hidden="true">
            <div className="hb-msg hb-msg-user">{user}</div>
            <div className="hb-msg hb-msg-assistant">
              {aria.slice(0, typed)}
              {typed < aria.length && <span className="hb-caret" />}
            </div>
          </div>

          <div className="hb-aria-note">
            <p>ARIA is getting an upgrade. In the meantime, tell us your project directly and a real person replies within 24 hours.</p>
            <Link href="/contact" className="hb-aria-cta">Tell us your project <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        {/* Side stack */}
        <div className="hb-side">
          <div className="hb-tile hb-proof">
            <span className="hb-stars" aria-hidden="true">★★★★★</span>
            <p className="hb-proof-tx">"Highly professional, neat work, amazing prices, and they reply fast."</p>
            <span className="hb-proof-by">Yorgo, SpeeAligner</span>
          </div>
          <div className="hb-tile hb-assure">
            <span className="hb-mono">Every build</span>
            <ul className="hb-assure-list">
              {ASSURE.map((a) => (
                <li key={a}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </header>
  );
}

const css = `
.hb { padding: clamp(84px, 10vh, 116px) var(--gutter) 40px; }
.hb-grid { width: min(var(--max-width), 100%); margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr; gap: 14px; align-items: stretch; }
.hb-tile { border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--bg-2); box-sizing: border-box; }

/* Headline */
.hb-headline { grid-column: 1; grid-row: 1; padding: clamp(30px, 3.4vw, 50px); display: flex; flex-direction: column; justify-content: space-between; gap: 30px; min-height: 300px; }
.hb-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); }
.hb-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--orange); flex-shrink: 0; }
.hb-h1 { font-family: var(--font-display); font-size: clamp(34px, 4.4vw, 66px); font-weight: 700; line-height: 0.98; letter-spacing: -0.04em; margin: 0; }
.hb-h1 em { font-style: normal; color: var(--orange); }
.hb-headline-foot { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.hb-btn { display: inline-flex; align-items: center; gap: 9px; padding: 14px 26px; border-radius: 999px; background: var(--orange); color: #0a0a0b; font-size: 14px; font-weight: 700; box-shadow: 0 8px 26px rgba(255,106,26,0.26); transition: transform 0.25s, box-shadow 0.3s, background 0.25s; }
.hb-btn:hover { transform: translateY(-2px); background: var(--orange-light); box-shadow: 0 12px 34px rgba(255,106,26,0.36); }
.hb-rating { font-size: 12.5px; font-weight: 500; color: var(--text-dim); }
.hb-stars { color: var(--orange); letter-spacing: 1.5px; }

/* Stat */
.hb-stat { grid-column: 2; grid-row: 1; background: var(--orange); color: #0a0a0b; padding: clamp(26px, 2.8vw, 40px); display: flex; flex-direction: column; justify-content: space-between; gap: 24px; border-color: transparent; }
.hb-stat-label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.72; }
.hb-stat-num { font-family: var(--font-display); font-size: clamp(64px, 7vw, 104px); font-weight: 700; line-height: 0.82; letter-spacing: -0.05em; }
.hb-stat-sub { font-size: 15px; font-weight: 600; line-height: 1.35; margin-top: 12px; max-width: 22ch; }

/* ARIA */
.hb-aria { grid-column: 1; grid-row: 2; display: flex; flex-direction: column; background: linear-gradient(168deg, var(--bg-3), var(--bg-card)); box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.05); overflow: hidden; min-height: 300px; }
.hb-aria-head { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-soft); }
.hb-aria-avatar { width: 36px; height: 36px; border-radius: 11px; display: grid; place-items: center; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); flex-shrink: 0; }
.hb-aria-id { display: flex; flex-direction: column; line-height: 1.3; }
.hb-aria-id strong { font-size: 14px; font-weight: 700; }
.hb-aria-id span { font-size: 11.5px; color: var(--text-faint); }
.hb-aria-badge { margin-left: auto; font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--orange); background: var(--orange-soft); border: 1px solid var(--border-hover); padding: 4px 10px; border-radius: 999px; }
.hb-aria-demo { flex: 1; max-height: 210px; overflow: hidden; padding: 18px; display: flex; flex-direction: column; gap: 11px; }
.hb-msg { max-width: 88%; padding: 11px 15px; border-radius: 14px; font-size: 14px; line-height: 1.55; }
.hb-msg-assistant { align-self: flex-start; background: var(--bg-card); color: var(--text); border-bottom-left-radius: 4px; min-height: 1.2em; }
.hb-msg-user { align-self: flex-end; background: var(--orange); color: #0a0a0b; font-weight: 500; border-bottom-right-radius: 4px; }
.hb-caret { display: inline-block; width: 2px; height: 1em; background: var(--orange); margin-left: 2px; vertical-align: text-bottom; animation: hb-blink 1s step-end infinite; }
@keyframes hb-blink { 50% { opacity: 0; } }
.hb-aria-note { border-top: 1px solid var(--border-soft); padding: 16px 20px; margin-top: auto; display: flex; flex-direction: column; gap: 12px; }
.hb-aria-note p { font-size: 13px; line-height: 1.55; color: var(--text-muted); margin: 0; }
.hb-aria-cta { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 999px; background: var(--orange); color: #0a0a0b; font-size: 13.5px; font-weight: 700; box-shadow: 0 8px 26px rgba(255,106,26,0.26); transition: transform 0.25s, box-shadow 0.3s, background 0.25s; }
.hb-aria-cta:hover { transform: translateY(-2px); background: var(--orange-light); box-shadow: 0 12px 34px rgba(255,106,26,0.36); }

/* Side */
.hb-side { grid-column: 2; grid-row: 2; display: flex; flex-direction: column; gap: 14px; }
.hb-proof, .hb-assure { flex: 1; padding: clamp(22px, 2.2vw, 30px); display: flex; flex-direction: column; justify-content: space-between; gap: 14px; }
.hb-proof-tx { font-family: var(--font-display); font-size: clamp(16px, 1.5vw, 20px); font-weight: 500; line-height: 1.4; letter-spacing: -0.01em; color: var(--text); margin: 0; }
.hb-proof-by { font-size: 12.5px; color: var(--text-dim); }
.hb-mono { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-faint); }
.hb-assure-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.hb-assure-list li { display: flex; align-items: center; gap: 11px; font-size: 14px; font-weight: 500; color: var(--text); }
.hb-assure-list svg { color: var(--orange); flex-shrink: 0; }

@media (max-width: 900px) {
  .hb { padding: clamp(78px, 12vh, 100px) var(--gutter) 30px; }
  .hb-grid { grid-template-columns: 1fr; gap: 12px; }
  .hb-headline, .hb-stat, .hb-aria, .hb-side { grid-column: 1; grid-row: auto; }
  .hb-headline { min-height: auto; padding: 28px; gap: 22px; }
  .hb-h1 { font-size: clamp(31px, 8.4vw, 50px); }
  .hb-stat { flex-direction: row; align-items: center; justify-content: space-between; gap: 18px; padding: 24px 26px; }
  .hb-stat-num { font-size: 66px; }
  .hb-stat-sub { margin-top: 0; max-width: 15ch; font-size: 13px; }
  .hb-aria { min-height: auto; }
  .hb-aria-demo { max-height: 40vh; }
}
@media (max-width: 460px) {
  .hb-headline { padding: 22px; }
  .hb-headline-foot { gap: 14px; }
  .hb-stat-num { font-size: 56px; }
}
`;
