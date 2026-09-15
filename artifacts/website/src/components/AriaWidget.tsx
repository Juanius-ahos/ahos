import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useAriaChat } from "../hooks/useAriaChat";
import { CHIPS, WIDGET_SYSTEM_PROMPT } from "../lib/aria";

/**
 * Floating "Ask ARIA" support widget, mounted site-wide. A compact chat panel
 * powered by the same hook as the full /aria-ai page, using the widget system
 * prompt (no live preview, shorter replies). Hidden on /aria-ai itself, where
 * the full experience already lives.
 */
export function AriaWidget() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, setInput, busy, sendMessage, newChat } = useAriaChat({
    systemPrompt: WIDGET_SYSTEM_PROMPT,
    source: "aria_widget",
    maxTokens: 500,
  });

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (open && inpRef.current) inpRef.current.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The dedicated page is the full experience; no floating widget there.
  if (location === "/aria-ai") return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      <style>{css}</style>

      <div className={"aw " + (open ? "is-open" : "")}>
        {/* Panel */}
        <div className="aw-panel" role="dialog" aria-label="Chat with ARIA" aria-hidden={!open}>
          <header className="aw-head">
            <span className="aw-head-ico" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.4L20 10l-6.1 1.6L12 18l-1.9-6.4L4 10l6.1-1.6z" /></svg>
            </span>
            <div className="aw-head-id">
              <strong>ARIA</strong>
              <span className="aw-head-status"><i className="aw-dot-live" />AHOS assistant</span>
            </div>
            <button className="aw-head-btn" onClick={newChat} title="New conversation" aria-label="New conversation">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </button>
            <button className="aw-head-btn" onClick={() => setOpen(false)} title="Close" aria-label="Close chat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </header>

          <div className="aw-msgs" ref={msgsRef}>
            {messages.map((m, i) => (
              <div key={i} className={"aw-msg " + (m.role === "user" ? "aw-msg-user" : "aw-msg-aria")}>
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="aw-msg aw-msg-aria aw-typing"><span /><span /><span /></div>
            )}
            {messages.length === 1 && !busy && (
              <div className="aw-chips">
                {CHIPS.map((c) => (
                  <button key={c} className="aw-chip" onClick={() => sendMessage(c)}>{c}</button>
                ))}
              </div>
            )}
          </div>

          <div className="aw-bar">
            <textarea
              ref={inpRef}
              className="aw-inp"
              rows={1}
              placeholder="Ask ARIA anything about AHOS..."
              value={input}
              onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(96, e.target.scrollHeight) + "px"; }}
              onKeyDown={onKeyDown}
              disabled={busy}
            />
            <button className="aw-send" disabled={busy || !input.trim()} onClick={() => sendMessage(input)} aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        {/* Launcher */}
        <button className="aw-launch" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close ARIA chat" : "Chat with ARIA"} aria-expanded={open}>
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.4L20 10l-6.1 1.6L12 18l-1.9-6.4L4 10l6.1-1.6z" /></svg>
              <span className="aw-launch-txt">Ask ARIA</span>
            </>
          )}
        </button>
      </div>

      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient id="awG" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff9d4e" /><stop offset="1" stopColor="#e05000" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}

const css = `
.aw { position: fixed; right: clamp(16px, 3vw, 28px); bottom: clamp(16px, 3vw, 28px); z-index: 1200; display: flex; flex-direction: column; align-items: flex-end; gap: 14px; }

/* Launcher */
.aw-launch {
  display: inline-flex; align-items: center; gap: 9px; height: 52px; padding: 0 20px;
  border-radius: 999px; border: none; cursor: pointer;
  background: var(--orange); color: #0a0a0b; font-family: var(--font-sans); font-size: 14px; font-weight: 700;
  box-shadow: 0 10px 30px rgba(255,106,26,0.4); transition: transform 0.25s ease, box-shadow 0.3s ease, background 0.2s;
}
.aw-launch:hover { transform: translateY(-2px); background: var(--orange-light); box-shadow: 0 14px 38px rgba(255,106,26,0.5); }
.aw-launch:active { transform: scale(0.96); }
.aw.is-open .aw-launch { width: 52px; padding: 0; justify-content: center; }
.aw.is-open .aw-launch-txt { display: none; }

/* Panel */
.aw-panel {
  width: min(380px, calc(100vw - 32px)); height: min(560px, calc(100vh - 140px));
  display: flex; flex-direction: column; overflow: hidden;
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.55);
  transform-origin: bottom right; transform: translateY(16px) scale(0.94); opacity: 0; pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease;
}
.aw.is-open .aw-panel { transform: none; opacity: 1; pointer-events: auto; }

.aw-head { flex-shrink: 0; display: flex; align-items: center; gap: 10px; padding: 12px 12px 12px 16px; border-bottom: 1px solid var(--border-soft); background: var(--bg-3); }
.aw-head-ico { width: 30px; height: 30px; flex-shrink: 0; border-radius: 9px; display: grid; place-items: center; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); }
.aw-head-id { display: flex; flex-direction: column; line-height: 1.25; margin-right: auto; }
.aw-head-id strong { font-size: 13.5px; font-weight: 700; color: var(--text); }
.aw-head-status { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-faint); }
.aw-dot-live { width: 6px; height: 6px; border-radius: 50%; background: #46d27e; box-shadow: 0 0 0 0 rgba(70,210,126,0.5); animation: aw-pulse 2.2s infinite; }
@keyframes aw-pulse { 0%{box-shadow:0 0 0 0 rgba(70,210,126,0.5);} 70%{box-shadow:0 0 0 7px rgba(70,210,126,0);} 100%{box-shadow:0 0 0 0 rgba(70,210,126,0);} }
.aw-head-btn { width: 30px; height: 30px; flex-shrink: 0; display: grid; place-items: center; border: none; background: none; color: var(--text-faint); cursor: pointer; border-radius: 8px; transition: color 0.2s, background 0.2s; }
.aw-head-btn:hover { color: var(--orange); background: var(--orange-soft); }

.aw-msgs { flex: 1; min-height: 0; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; }
.aw-msg { max-width: 88%; padding: 10px 14px; font-size: 13.5px; line-height: 1.6; border-radius: 15px; word-break: break-word; }
.aw-msg-aria { align-self: flex-start; background: var(--bg-card); border: 1px solid var(--border-soft); color: var(--text-muted); border-bottom-left-radius: 4px; }
.aw-msg-user { align-self: flex-end; background: var(--orange); color: #0a0a0b; font-weight: 500; border-bottom-right-radius: 4px; }
.aw-typing { display: inline-flex; gap: 4px; }
.aw-typing span { width: 5px; height: 5px; border-radius: 50%; background: var(--orange); opacity: 0.4; animation: aw-dot 1.4s ease-in-out infinite; }
.aw-typing span:nth-child(2) { animation-delay: 0.18s; }
.aw-typing span:nth-child(3) { animation-delay: 0.36s; }
@keyframes aw-dot { 0%,60%,100%{transform:translateY(0);opacity:0.3;} 30%{transform:translateY(-4px);opacity:1;} }

.aw-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 4px; }
.aw-chip { padding: 7px 13px; border-radius: 999px; background: var(--bg-3); border: 1px solid var(--border); color: var(--text-dim); font-size: 12px; font-family: var(--font-sans); cursor: pointer; transition: all 0.18s; }
.aw-chip:hover { background: var(--orange-soft); border-color: var(--border-hover); color: var(--orange-light); }

.aw-bar { flex-shrink: 0; display: flex; align-items: flex-end; gap: 8px; padding: 10px 12px 12px; border-top: 1px solid var(--border-soft); background: var(--bg-3); }
.aw-inp { flex: 1; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; color: var(--text); font-size: 13.5px; font-family: var(--font-sans); padding: 9px 12px; resize: none; outline: none; line-height: 1.5; min-height: 38px; max-height: 96px; transition: border-color 0.2s; }
.aw-inp::placeholder { color: var(--text-faint); }
.aw-inp:focus { border-color: var(--border-hover); }
.aw-send { width: 38px; height: 38px; flex-shrink: 0; border-radius: 11px; background: var(--orange); border: none; cursor: pointer; display: grid; place-items: center; color: #0a0a0b; transition: transform 0.15s, opacity 0.15s; }
.aw-send:not([disabled]):hover { transform: translateY(-1px); }
.aw-send[disabled] { opacity: 0.15; cursor: default; pointer-events: none; }

@media (max-width: 460px) {
  .aw { right: 12px; bottom: 12px; }
  .aw-panel { width: calc(100vw - 24px); height: min(70vh, calc(100vh - 120px)); }
}
@media (prefers-reduced-motion: reduce) {
  .aw-panel { transition: opacity 0.2s ease; transform: none; }
  .aw.is-open .aw-panel { transform: none; }
}
`;
