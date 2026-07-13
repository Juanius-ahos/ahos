import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useAriaChat } from "../hooks/useAriaChat";
import { CHIPS, WIDGET_SYSTEM_PROMPT } from "../lib/aria";
import { trackEvent } from "../lib/analytics";

/** Floating chat launcher — the site-wide entry point into ARIA. The full
 *  /aria-ai page (with the live mockup preview) stays as the deep-dive
 *  experience; this widget is the low-friction one available everywhere. */
export function AriaWidget() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, setInput, busy, sendMessage } = useAriaChat({
    systemPrompt: WIDGET_SYSTEM_PROMPT,
    source: "aria_widget",
    maxTokens: 220,
  });

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, open]);

  // Nudge: after 3+ messages and 15s idle, blink a suggestion chip
  const [nudge, setNudge] = useState<string | null>(null);
  useEffect(() => {
    if (!open || messages.length < 3 || busy) { setNudge(null); return; }
    const t = setTimeout(() => { if (open) setNudge("Ready for a quote?"); }, 15000);
    return () => clearTimeout(t);
  }, [messages.length, open, busy]);

  // Don't duplicate the entry point on the full ARIA page or bury the contact planner.
  if (location === "/aria-ai" || location === "/contact") return null;

  const toggle = () => {
    setOpen((v) => {
      const next = !v;
      if (next && !opened) { setOpened(true); trackEvent("aria_widget_open"); }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      <style>{css}</style>

      <div className={`aw ${open ? "is-open" : ""}`}>
        <div className="aw-panel" role="dialog" aria-modal="true" aria-label="Chat with ARIA" aria-hidden={!open}>
          <header className="aw-top">
            <div className="aw-top-l">
              <span className="aw-dot" />
              <span className="aw-name">ARIA</span>
              <span className="aw-by">AHOS AI advisor</span>
            </div>
            <button className="aw-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>

          <div className="aw-msgs" ref={msgsRef}>
            {messages.length === 1 && (
              <div className="aw-chips">
                {CHIPS.map((chip) => (
                  <button key={chip} className="aw-chip" onClick={() => sendMessage(chip)}>{chip}</button>
                ))}
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={"aw-msg " + (msg.role === "user" ? "aw-msg-user" : "aw-msg-aria")}>
                <div className="aw-bub">{msg.content}</div>
              </div>
            ))}
            {busy && messages[messages.length - 1]?.content === "" && (
              <div className="aw-msg aw-msg-aria">
                <div className="aw-bub"><span className="aw-td" /><span className="aw-td" /><span className="aw-td" /></div>
              </div>
            )}
          </div>

          {nudge && (
            <div className="aw-nudge">
              <button className="aw-chip" onClick={() => { sendMessage(nudge); setNudge(null); }}>{nudge}</button>
            </div>
          )}

          <div className="aw-bar">
            <textarea
              ref={inpRef}
              className="aw-inp"
              placeholder="Ask ARIA anything..."
              rows={1}
              value={input}
              onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(90, e.target.scrollHeight) + "px"; }}
              onKeyDown={handleKeyDown}
              disabled={busy}
            />
            <button className="aw-send" disabled={busy || !input.trim()} onClick={() => sendMessage(input)} aria-label="Send">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        <button className="aw-launcher" onClick={toggle} aria-label={open ? "Close ARIA chat" : "Chat with ARIA, our AI project advisor"}>
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          )}
          {!opened && <span className="aw-ping" aria-hidden="true" />}
        </button>
      </div>
    </>
  );
}

const css = `
.aw { position: fixed; right: 20px; bottom: 24px; z-index: 950; display: flex; flex-direction: column; align-items: flex-end; gap: 14px; }

.aw-launcher { position: relative; width: 56px; height: 56px; border-radius: 50%; background: var(--orange); border: none; color: #0a0a0b; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 28px rgba(255,106,26,0.35); transition: transform 0.2s, box-shadow 0.2s; flex-shrink: 0; }
.aw-launcher:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(255,106,26,0.45); }
.aw-ping { position: absolute; top: -3px; right: -3px; width: 14px; height: 14px; border-radius: 50%; background: #46d27e; border: 2px solid var(--bg); animation: aw-pulse 2.2s infinite; }
@keyframes aw-pulse { 0%{box-shadow:0 0 0 0 rgba(70,210,126,0.55);} 70%{box-shadow:0 0 0 8px rgba(70,210,126,0);} 100%{box-shadow:0 0 0 0 rgba(70,210,126,0);} }

.aw-panel { width: min(360px, calc(100vw - 40px)); height: 480px; max-height: calc(100vh - 140px); display: flex; flex-direction: column; border-radius: 18px; border: 1px solid var(--border); background: var(--bg-2); box-shadow: 0 24px 64px rgba(0,0,0,0.5); overflow: hidden; opacity: 0; transform: translateY(16px) scale(0.97); pointer-events: none; transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1); transform-origin: bottom right; }
.aw.is-open .aw-panel { opacity: 1; transform: none; pointer-events: auto; }

.aw-top { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid var(--border-soft); background: var(--bg-3); }
.aw-top-l { display: flex; align-items: baseline; gap: 8px; }
.aw-dot { width: 6px; height: 6px; border-radius: 50%; background: #46d27e; align-self: center; }
.aw-name { font-weight: 700; font-size: 14px; color: var(--text); }
.aw-by { font-size: 10.5px; color: var(--text-faint); font-weight: 500; letter-spacing: 0.03em; text-transform: uppercase; }
.aw-close { width: 26px; height: 26px; border-radius: 50%; border: none; background: none; color: var(--text-dim); font-size: 18px; line-height: 1; cursor: pointer; transition: color 0.2s, background 0.2s; }
.aw-close:hover { color: var(--text); background: var(--bg); }

.aw-msgs { flex: 1; min-height: 0; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 8px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
.aw-msgs::-webkit-scrollbar { width: 4px; }
.aw-msgs::-webkit-scrollbar-thumb { background: var(--border); border-radius: 9px; }

.aw-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }
.aw-chip { padding: 6px 14px; border-radius: 999px; background: var(--bg-3); border: 1px solid var(--border); color: var(--text-dim); font-size: 12px; font-family: var(--font-sans); cursor: pointer; transition: all 0.18s; }
.aw-chip:hover { background: var(--orange-soft); border-color: var(--border-hover); color: var(--orange-light); }
.aw-nudge { flex-shrink: 0; display: flex; justify-content: center; padding: 4px 10px 0; }
.aw-nudge .aw-chip { animation: aw-fade-in 0.35s ease both; background: rgba(70,210,126,0.08); border-color: rgba(70,210,126,0.25); color: var(--text-muted); }
.aw-nudge .aw-chip:hover { background: rgba(70,210,126,0.15); border-color: rgba(70,210,126,0.4); color: var(--text); }
@keyframes aw-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

.aw-msg { display: flex; }
.aw-msg-user { justify-content: flex-end; }
.aw-bub { max-width: 85%; padding: 8px 13px; font-size: 13px; line-height: 1.6; word-break: break-word; border-radius: 14px; background: var(--bg-3); border: 1px solid var(--border-soft); color: var(--text-muted); }
.aw-msg-user .aw-bub { color: var(--text); background: rgba(255,106,26,0.06); border-color: rgba(255,106,26,0.12); }
.aw-td { display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: var(--orange); opacity: 0.4; animation: aw-td-a 1.5s ease-in-out infinite; margin-right: 3px; }
.aw-td:nth-child(2) { animation-delay: 0.17s; }
.aw-td:nth-child(3) { animation-delay: 0.34s; margin-right: 0; }
@keyframes aw-td-a { 0%,60%,100%{transform:translateY(0);opacity:0.3;} 30%{transform:translateY(-3px);opacity:1;} }

.aw-bar { flex-shrink: 0; display: flex; align-items: flex-end; gap: 6px; padding: 10px; border-top: 1px solid var(--border-soft); background: var(--bg-3); }
.aw-inp { flex: 1; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-size: 13px; font-family: var(--font-sans); padding: 8px 12px; resize: none; outline: none; line-height: 1.5; min-height: 36px; max-height: 90px; overflow-y: auto; transition: border-color 0.2s; }
.aw-inp::placeholder { color: var(--text-faint); }
.aw-inp:focus { border-color: var(--border-hover); }
.aw-send { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; background: var(--orange); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #0a0a0b; transition: transform 0.15s, opacity 0.15s; }
.aw-send:not([disabled]):hover { transform: translateY(-1px); }
.aw-send[disabled] { opacity: 0.15; cursor: default; pointer-events: none; }

@media (max-width: 560px) {
  .aw { right: 12px; bottom: 90px; }
  .aw-panel { width: calc(100vw - 24px); height: min(500px, calc(100vh - 200px)); }
  .aw-launcher { width: 50px; height: 50px; }
}
@media (prefers-reduced-motion: reduce) {
  .aw-panel { transition: opacity 0.2s ease; transform: none; }
  .aw-ping { animation: none; }
}
`;
