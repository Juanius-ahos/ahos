import { useEffect, useRef, useState } from "react";
import { PageHeader, Placeholder } from "../components/ui";
import { useAriaChat } from "../hooks/useAriaChat";
import { CHIPS, SYSTEM_PROMPT } from "../lib/aria";

export default function AriaAI() {
  const [preview, setPreview] = useState<string | null>(null);
  const msgs = useRef<HTMLDivElement>(null);
  const { messages, input, setInput, busy, sendMessage, newChat } = useAriaChat({ systemPrompt: SYSTEM_PROMPT, source: "aria_chat_page", onPreview: setPreview });

  useEffect(() => { if (msgs.current) msgs.current.scrollTop = msgs.current.scrollHeight; }, [messages, busy]);

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "ARIA" }]}
        title="ARIA, our AI project advisor."
        lead="We designed and built ARIA to do what we do on a first call: understand what you want to make, and point you at the right next step. Try it."
      />
      <section className="sec" aria-label="Chat with ARIA">
        <div className="wrap">
          <div className="aria">
            <div className="aria-chat">
              <div className="aria-top">
                <b>ARIA</b>
                <button type="button" onClick={() => { newChat(); setPreview(null); }}>New chat</button>
              </div>
              <div className="aria-msgs" ref={msgs} aria-live="polite">
                {messages.map((m, i) => (
                  <div key={i} className={`aria-msg ${m.role === "user" ? "u" : "a"}`}>{m.content}</div>
                ))}
                {busy && <div className="aria-msg a" aria-label="ARIA is typing"><span className="typing"><i /><i /><i /></span></div>}
              </div>
              {messages.length === 1 && !busy && (
                <div className="aria-chips">{CHIPS.map((c) => <button key={c} type="button" onClick={() => sendMessage(c)}>{c}</button>)}</div>
              )}
              <form className="aria-bar" onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
                <label htmlFor="aria-in" className="sr">Message ARIA</label>
                <textarea id="aria-in" rows={1} value={input} placeholder="What are you building?" disabled={busy}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }} />
                <button type="submit" className="btn" disabled={busy || !input.trim()}>Send</button>
              </form>
            </div>
            <div className="aria-prev">
              <div className="aria-top"><b>Preview</b></div>
              {preview ? <iframe title="ARIA preview" srcDoc={preview} sandbox="allow-same-origin" /> : <Placeholder label="ARIA sketches a preview here when it has enough to go on" />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
