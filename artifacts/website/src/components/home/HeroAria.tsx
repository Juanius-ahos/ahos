import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useAriaChat } from "../../hooks/useAriaChat";
import { SYSTEM_PROMPT } from "../../lib/aria";
import { trackEvent } from "../../lib/analytics";

const CHIPS = ["A booking app", "An online store", "A SaaS dashboard", "An AI tool"];

const ASSURE = ["Fixed price, in writing", "You own the code", "Live in days, not months"];

/**
 * Bento-grid hero. A structured tile layout: headline, a bold stat, proof, and
 * reassurances at a glance, with the interactive ARIA advisor as the centre
 * tile so visitors can scope a project without leaving the fold.
 */
export function HeroAria() {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, busy, sendMessage } = useAriaChat({
    systemPrompt: SYSTEM_PROMPT,
    source: "hero_aria",
    maxTokens: 700,
    onPreview: (html) => setPreviewHtml(html),
  });

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    if (!started) { setStarted(true); trackEvent("aria_hero_start", { intent: t.slice(0, 60) }); }
    sendMessage(t);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const convo = messages.slice(1);

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

        {/* ARIA advisor */}
        <div className="hb-tile hb-aria">
          <div className="hb-aria-head">
            <span className="hb-aria-avatar" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.4L20 10l-6.1 1.6L12 18l-1.9-6.4L4 10l6.1-1.6z" /></svg>
            </span>
            <div className="hb-aria-id">
              <strong>ARIA</strong>
              <span>AI project advisor · scopes your build in seconds</span>
            </div>
            <span className="hb-aria-live">online</span>
          </div>

          {!started ? (
            <div className="hb-aria-intro">
              <p className="hb-aria-pitch">Tell me what you want to build and I'll map the scope, a rough timeline, and the smartest next step.</p>
              <div className="hb-chips">
                {CHIPS.map((c) => (
                  <button key={c} className="hb-chip" onClick={() => send(c)}>{c}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="hb-aria-convo" ref={scrollRef}>
              {convo.map((m, i) => (
                <div key={i} className={`hb-msg hb-msg-${m.role}`}>
                  {m.content || (busy && i === convo.length - 1 ? <span className="hb-typing"><i /><i /><i /></span> : "")}
                </div>
              ))}
              {previewHtml && (
                <div className="hb-preview">
                  <div className="hb-preview-bar"><span /><span /><span /><em>live preview</em></div>
                  <iframe title="Live preview of your project" sandbox="" srcDoc={previewHtml} />
                </div>
              )}
            </div>
          )}

          <form className="hb-inputbar" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input
              className="hb-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={started ? "Reply to ARIA…" : "e.g. a booking app for my salon…"}
              aria-label="Describe your project"
            />
            <button className="hb-send" disabled={busy || !input.trim()} aria-label="Send to ARIA">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
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
.hb-aria-live { margin-left: auto; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-faint); }
.hb-aria-intro { padding: 20px; }
.hb-aria-pitch { font-size: 14.5px; line-height: 1.6; color: var(--text-muted); margin: 0 0 16px; }
.hb-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.hb-chip { padding: 9px 14px; border-radius: 999px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-dim); font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.hb-chip:hover { border-color: var(--border-hover); color: var(--orange); background: var(--orange-soft); }
.hb-aria-convo { flex: 1; max-height: 300px; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 11px; }
.hb-msg { max-width: 88%; padding: 11px 15px; border-radius: 14px; font-size: 14px; line-height: 1.55; white-space: pre-wrap; }
.hb-msg-assistant { align-self: flex-start; background: var(--bg-card); color: var(--text); border-bottom-left-radius: 4px; }
.hb-msg-user { align-self: flex-end; background: var(--orange); color: #0a0a0b; font-weight: 500; border-bottom-right-radius: 4px; }
.hb-typing { display: inline-flex; gap: 4px; }
.hb-typing i { width: 6px; height: 6px; border-radius: 50%; background: var(--text-faint); animation: hb-bounce 1.2s infinite ease-in-out; }
.hb-typing i:nth-child(2) { animation-delay: 0.15s; }
.hb-typing i:nth-child(3) { animation-delay: 0.3s; }
@keyframes hb-bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-4px); opacity: 1; } }
.hb-preview { margin-top: 4px; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: #fff; }
.hb-preview-bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: var(--bg-3); border-bottom: 1px solid var(--border-soft); }
.hb-preview-bar span { width: 9px; height: 9px; border-radius: 50%; background: var(--text-faint); }
.hb-preview-bar em { margin-left: auto; font-style: normal; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-faint); }
.hb-preview iframe { width: 100%; height: 280px; border: 0; display: block; background: #fff; }
.hb-inputbar { display: flex; align-items: center; gap: 8px; padding: 12px; border-top: 1px solid var(--border-soft); margin-top: auto; }
.hb-input { flex: 1; background: var(--bg-card); border: 1px solid var(--border); border-radius: 999px; padding: 12px 18px; font-size: 14px; color: var(--text); font-family: var(--font-sans); transition: border-color 0.2s; }
.hb-input::placeholder { color: var(--text-faint); }
.hb-input:focus { outline: none; border-color: var(--border-hover); }
.hb-send { width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; background: var(--orange); color: #0a0a0b; display: grid; place-items: center; cursor: pointer; transition: transform 0.2s, opacity 0.2s; }
.hb-send:hover:not(:disabled) { transform: scale(1.06); }
.hb-send:disabled { opacity: 0.4; cursor: not-allowed; }

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
  .hb-grid { grid-template-columns: 1fr; }
  .hb-headline, .hb-stat, .hb-aria, .hb-side { grid-column: 1; grid-row: auto; }
  .hb-h1 { font-size: clamp(32px, 8.5vw, 52px); }
  .hb-stat { flex-direction: row; align-items: flex-end; justify-content: space-between; }
  .hb-stat-sub { margin-top: 0; }
}
`;
