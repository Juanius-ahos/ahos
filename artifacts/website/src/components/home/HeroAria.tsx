import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useAriaChat } from "../../hooks/useAriaChat";
import { SYSTEM_PROMPT } from "../../lib/aria";
import { trackEvent } from "../../lib/analytics";

const CHIPS = [
  "A booking app for my salon",
  "An online store",
  "A SaaS dashboard",
  "An AI tool for my team",
];

/**
 * Interactive hero. The headline sells the outcome; the ARIA console turns the
 * first impression into a live product demo — the visitor describes what they
 * want, ARIA scopes it, sketches a live mockup, and captures the lead. Replaces
 * the old decorative 3D globe.
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

  // Skip the canned welcome bubble; show only real exchanges once started.
  const convo = messages.slice(1);

  return (
    <header className="hx" data-accent="255,106,26">
      <style>{css}</style>

      <div className="hx-inner">
        {/* ── Left: pitch ── */}
        <div className="hx-lead">
          <div className="hx-eyebrow">
            <span className="hx-dot" />
            Digital product studio · Beirut → Worldwide
          </div>

          <h1 className="hx-title">
            We build websites, apps &amp; software that <em>pay for themselves.</em>
          </h1>

          <p className="hx-sub">
            AHOS is a boutique studio that designs, builds, and ships — websites, custom
            software, AI, and Web3 — for founders who need it done right. One team, idea to
            launch, full code ownership.
          </p>

          <div className="hx-trust">
            <span className="hx-stars" aria-label="5 out of 5 stars">★★★★★</span>
            <span className="hx-trust-tx">5.0 · Verified client reviews · US · Gulf · Europe</span>
          </div>

          <div className="hx-cta-row">
            <Link href="/contact" className="hx-btn">Book a 30-min call <span aria-hidden="true">↗</span></Link>
            <Link href="/work/ido-taxi" className="hx-link">See recent work →</Link>
          </div>
        </div>

        {/* ── Right: ARIA console ── */}
        <div className={`hx-console ${started ? "is-active" : ""}`}>
          <div className="hx-console-head">
            <span className="hx-aria-avatar" aria-hidden="true">✦</span>
            <div className="hx-console-id">
              <strong>ARIA</strong>
              <span>AI project advisor · replies instantly</span>
            </div>
            <span className="hx-live">● live</span>
          </div>

          {!started ? (
            <div className="hx-console-intro">
              <p className="hx-console-pitch">
                Not sure where to start? Tell me what you want to build and I'll map the
                scope, a rough timeline, and the smartest next step — in seconds.
              </p>
              <div className="hx-chips">
                {CHIPS.map((c) => (
                  <button key={c} className="hx-chip" onClick={() => send(c)}>{c}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="hx-console-convo" ref={scrollRef}>
              {convo.map((m, i) => (
                <div key={i} className={`hx-msg hx-msg-${m.role}`}>
                  {m.content || (busy && i === convo.length - 1 ? <span className="hx-typing"><i /><i /><i /></span> : "")}
                </div>
              ))}
              {previewHtml && (
                <div className="hx-preview">
                  <div className="hx-preview-bar"><span /><span /><span /><em>live preview</em></div>
                  <iframe title="Live preview of your project" sandbox="" srcDoc={previewHtml} />
                </div>
              )}
            </div>
          )}

          <form
            className="hx-inputbar"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <input
              className="hx-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={started ? "Reply to ARIA…" : "e.g. a booking app for my salon…"}
              aria-label="Describe your project"
            />
            <button className="hx-send" disabled={busy || !input.trim()} aria-label="Send to ARIA">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
          <p className="hx-console-foot">No spam. A real human follows up within 24h.</p>
        </div>
      </div>

      <span className="hx-scroll" aria-hidden="true">Scroll</span>
    </header>
  );
}

const css = `
.hx { position: relative; min-height: 100vh; display: flex; align-items: center; padding: clamp(96px, 12vh, 140px) var(--gutter) 80px; overflow: hidden; }
.hx-inner { width: min(var(--max-width), 100%); margin: 0 auto; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: clamp(40px, 6vw, 96px); align-items: center; }

/* Lead */
.hx-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 28px; }
.hx-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--orange); box-shadow: 0 0 0 4px var(--orange-soft); animation: hx-pulse 2.4s ease-in-out infinite; }
@keyframes hx-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
.hx-title { font-family: var(--font-display); font-size: clamp(40px, 5.6vw, 82px); font-weight: 700; line-height: 0.98; letter-spacing: -0.04em; margin-bottom: 26px; }
.hx-title em { font-style: normal; color: var(--orange); }
.hx-sub { font-size: clamp(15px, 1.35vw, 18px); line-height: 1.65; color: var(--text-muted); max-width: 48ch; margin-bottom: 26px; }
.hx-trust { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; }
.hx-stars { color: var(--orange); font-size: 15px; letter-spacing: 2px; }
.hx-trust-tx { font-size: 12.5px; color: var(--text-dim); font-weight: 500; }
.hx-cta-row { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.hx-btn { display: inline-flex; align-items: center; gap: 9px; padding: 14px 26px; border-radius: 999px; background: var(--orange); color: #0a0a0b; font-size: 14px; font-weight: 700; box-shadow: 0 8px 30px rgba(255,106,26,0.28); transition: transform 0.25s, box-shadow 0.3s, background 0.25s; }
.hx-btn:hover { transform: translateY(-2px); background: var(--orange-light); box-shadow: 0 12px 38px rgba(255,106,26,0.4); }
.hx-link { font-size: 14px; font-weight: 600; color: var(--text-dim); transition: color 0.2s; }
.hx-link:hover { color: var(--orange); }

/* Console */
.hx-console { position: relative; display: flex; flex-direction: column; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden; min-height: 360px; }
.hx-console::before { content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px; background: linear-gradient(150deg, var(--orange-soft), transparent 40%); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
.hx-console-head { display: flex; align-items: center; gap: 12px; padding: 16px 18px; border-bottom: 1px solid var(--border-soft); }
.hx-aria-avatar { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: var(--orange-soft); color: var(--orange); font-size: 16px; flex-shrink: 0; }
.hx-console-id { display: flex; flex-direction: column; line-height: 1.3; }
.hx-console-id strong { font-size: 14px; font-weight: 700; letter-spacing: 0.02em; }
.hx-console-id span { font-size: 11.5px; color: var(--text-faint); }
.hx-live { margin-left: auto; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #4ade80; }

.hx-console-intro { padding: 22px 20px; }
.hx-console-pitch { font-size: 14.5px; line-height: 1.6; color: var(--text-muted); margin-bottom: 18px; }
.hx-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.hx-chip { padding: 9px 14px; border-radius: 999px; background: var(--bg-2); border: 1px solid var(--border); color: var(--text-dim); font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.hx-chip:hover { border-color: var(--border-hover); color: var(--orange); background: var(--orange-soft); }

.hx-console-convo { flex: 1; max-height: 340px; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
.hx-msg { max-width: 88%; padding: 11px 15px; border-radius: 14px; font-size: 14px; line-height: 1.55; white-space: pre-wrap; }
.hx-msg-assistant { align-self: flex-start; background: var(--bg-2); color: var(--text); border-bottom-left-radius: 4px; }
.hx-msg-user { align-self: flex-end; background: var(--orange); color: #0a0a0b; font-weight: 500; border-bottom-right-radius: 4px; }
.hx-typing { display: inline-flex; gap: 4px; }
.hx-typing i { width: 6px; height: 6px; border-radius: 50%; background: var(--text-faint); animation: hx-bounce 1.2s infinite ease-in-out; }
.hx-typing i:nth-child(2) { animation-delay: 0.15s; }
.hx-typing i:nth-child(3) { animation-delay: 0.3s; }
@keyframes hx-bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-4px); opacity: 1; } }

.hx-preview { margin-top: 6px; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: #fff; }
.hx-preview-bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: var(--bg-3); border-bottom: 1px solid var(--border-soft); }
.hx-preview-bar span { width: 9px; height: 9px; border-radius: 50%; background: var(--text-faint); }
.hx-preview-bar em { margin-left: auto; font-style: normal; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-faint); }
.hx-preview iframe { width: 100%; height: 300px; border: 0; display: block; background: #fff; }

.hx-inputbar { display: flex; align-items: center; gap: 8px; padding: 12px; border-top: 1px solid var(--border-soft); margin-top: auto; }
.hx-input { flex: 1; background: var(--bg-2); border: 1px solid var(--border); border-radius: 999px; padding: 12px 18px; font-size: 14px; color: var(--text); font-family: var(--font-sans); transition: border-color 0.2s; }
.hx-input::placeholder { color: var(--text-faint); }
.hx-input:focus { outline: none; border-color: var(--border-hover); }
.hx-send { width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; background: var(--orange); color: #0a0a0b; display: grid; place-items: center; cursor: pointer; transition: transform 0.2s, opacity 0.2s; }
.hx-send:hover:not(:disabled) { transform: scale(1.06); }
.hx-send:disabled { opacity: 0.4; cursor: not-allowed; }
.hx-console-foot { padding: 0 18px 14px; font-size: 11px; color: var(--text-faint); text-align: center; }

.hx-scroll { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-faint); }

@media (max-width: 940px) {
  .hx { min-height: auto; padding-top: clamp(90px, 14vh, 130px); }
  .hx-inner { grid-template-columns: 1fr; gap: 40px; }
  .hx-console { min-height: 320px; }
  .hx-scroll { display: none; }
}
`;
