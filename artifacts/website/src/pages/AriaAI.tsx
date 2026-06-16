import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { Reveal } from "../components/motion";

const GROQ_KEY = "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";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = [
  "You are Aria, senior project advisor at AHOS — a boutique digital studio building websites, mobile apps, SaaS, Web3/DeFi, and AI tools.",
  "",
  "# YOUR MISSION",
  "Be genuinely useful. Help visitors understand what is possible, give honest advice, and have a real conversation before ever asking for contact details.",
  "",
  "# CONVERSATION PHASES",
  "",
  "PHASE 1 — UNDERSTAND (first 3-5 messages)",
  "Ask smart, focused questions to fully understand what they want to build.",
  "Give real, substantive answers. Be direct. Give ranges. Ask one follow-up question per reply.",
  "",
  "PHASE 2 — QUALIFY (after you understand their project)",
  "Naturally explore: urgency, budget range, whether they have existing assets (designs, backend, brand).",
  "",
  "PHASE 3 — LEAD CAPTURE (only when earned)",
  "Only ask for contact info when ALL of these are true:",
  "1. At least 3 substantive exchanges have happened and you understand their project",
  "2. The visitor has shown real interest in working with AHOS (asks about process, timeline, or next steps)",
  "3. It feels natural to say \"let me have the team reach out\"",
  "",
  "When ready, say something like: \"I have a good picture of what you need. To have the AHOS team reach out with a tailored proposal, what is your name — and do you prefer email or WhatsApp/phone?\"",
  "",
  "Collect: name, EITHER email OR phone (with country code — e.g. +1, +44, +961), business location (city/country), project_type, industry, goal, budget, timeline.",
  "Name + one contact method is enough to fire the lead. Do not hold out for both email and phone.",
  "",
  "# LEAD SIGNAL",
  "IMPORTANT: Only emit the ##LEAD## signal AFTER the visitor has replied with their name AND at least one contact (email OR phone). Do NOT emit it when asking. Do NOT emit it with both email and phone empty.",
  "Step 1: Ask for name + preferred contact (email or WhatsApp/phone). Wait for their reply.",
  "Step 2a: If they give an email address or an actual phone number — great, proceed to Step 3.",
  "Step 2b: If they say \"WhatsApp\" or \"phone\" but do NOT give an actual number, you MUST ask for it: \"Great! What is your WhatsApp number? Please include your country code (e.g. +961 70 123 456).\" Then wait for the number before proceeding.",
  "Step 2c: If they give a name but no contact at all, ask: \"And what is the best way to reach you — email or WhatsApp?\"",
  "NEVER fire the signal unless you have a real email address or a real phone number. \"WhatsApp\", \"phone\", \"email\" as words alone are NOT a contact method.",
  "Step 3: Only THEN confirm and append the signal — fill in only the fields you actually received, leave others as empty string:",
  "##LEAD##{\"name\":\"Their Name\",\"email\":\"\",\"phone\":\"+961 70 000 000\",\"location\":\"Beirut, Lebanon\",\"project_type\":\"\",\"industry\":\"\",\"goal\":\"\",\"budget\":\"\",\"timeline\":\"\"}##END##",
  "Then say: \"Perfect — the AHOS team will be in touch within 24 hours.\"",
  "",
  "# AHOS INFO",
  "Services: websites, mobile apps, SaaS platforms, Web3/DeFi, AI tools, e-commerce, brand design.",
  "Timeline: landing 1-2w, sites 2-4w, apps 4-10w, SaaS 6-16w, Web3/AI 6-20w.",
  "Process: fixed-price quotes, milestone payments, 100% code ownership, 30-day post-launch support.",
  "Contact: info@ahos.xyz | Telegram: @ahos_studio",
  "",
  "# RULES",
  "- Never ask for contact info before Phase 3",
  "- One question per reply",
  "- Short replies: 2-4 sentences max",
  "- No markdown, no bullet lists, no ** or ##",
  "- Never mention AI model names",
  "- If someone says hi or asks something vague, respond warmly and ask what they are working on",
  "- Never quote specific prices or price ranges. Pricing depends on scope and the AHOS team will provide a tailored quote. You can ask about budget range to help scope the project, but never give numbers yourself.",
  "- NEVER judge, dismiss, or comment negatively on any budget the visitor mentions. Do not say it is \"tight\", \"limited\", \"low\", or \"challenging\". Every budget is valid. The AHOS team will find the best solution for what they have. If the budget is modest, acknowledge it positively and move forward.",
].join("\n");

const WELCOME = "Hey there! I'm ARIA, your AI project advisor from AHOS Studio. Tell me what you're looking to build — a website, an app, something with AI or Web3 — and I'll help you figure out the best path forward.";

const CHIPS = ["Website", "Mobile App", "SaaS Platform", "Web3 / DeFi", "AI Tool", "Something else"];

const LEAD_RE = /##LEAD##([\s\S]*?)##END##/;
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;

interface Message {
  role: "user" | "assistant";
  content: string;
}

function fireLead(d: Record<string, string>, history: Message[]) {
  const tr = history.slice(-14).map((h) => `${h.role === "user" ? "Visitor" : "Aria"}: ${h.content}`).join("\n\n");
  const payload = { _captcha: "false", _subject: `New AHOS Lead - ${d.name || "Unknown"}`, ...d, Transcript: tr };
  try { localStorage.setItem("ahos_lead_" + Date.now(), JSON.stringify(payload)); } catch {}
  fetch("https://formsubmit.co/ajax/daoujuan@gmail.com", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
}

export default function AriaAI() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<Message[]>([{ role: "assistant", content: WELCOME }]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight; });
  }, []);

  const handleLead = useCallback((raw: string): string => {
    const clean = raw.replace(LEAD_RE, "").trim();
    const m = raw.match(LEAD_RE);
    if (m && !leadSent) {
      try {
        const d = JSON.parse(m[1]);
        const hasName = (d.name || "").trim().length > 1;
        const validEmail = EMAIL_RE.test(d.email || "");
        const validPhone = /\d{5,}/.test((d.phone || "").replace(/[\s\-()]/g, ""));
        if (hasName && (validEmail || validPhone)) { fireLead(d, historyRef.current); setLeadSent(true); }
      } catch {}
    }
    return clean;
  }, [leadSent]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setBusy(true);

    const userMsg: Message = { role: "user", content: trimmed };
    const updated = [...historyRef.current, userMsg];
    historyRef.current = updated;
    setMessages(updated);
    setInput("");

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + GROQ_KEY },
        body: JSON.stringify({ model: GROQ_MODEL, messages: [{ role: "system", content: SYSTEM_PROMPT }, ...updated.slice(-14)], max_tokens: 700, temperature: 0.72 }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error((errData?.error?.message) || "HTTP " + res.status);
      }

      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content || "";
      const clean = handleLead(raw.trim());
      if (clean) {
        const ariaMsg: Message = { role: "assistant", content: clean };
        historyRef.current = [...historyRef.current, ariaMsg];
        setMessages(historyRef.current);
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Connection issue";
      const ariaMsg: Message = { role: "assistant", content: "Sorry, I hit a snag. Can you try again? (" + errMsg + ")" };
      historyRef.current = [...historyRef.current, ariaMsg];
      setMessages(historyRef.current);
    }

    setBusy(false);
    scrollToBottom();
  }, [busy, handleLead, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleChip = (chip: string) => sendMessage(chip);

  const newChat = () => {
    historyRef.current = [{ role: "assistant", content: WELCOME }];
    setMessages(historyRef.current);
    setLeadSent(false);
    setBusy(false);
    setInput("");
    if (inpRef.current) inpRef.current.style.height = "auto";
  };

  return (
    <>
      <SEOHead title="ARIA — Your AI Project Advisor" description="Chat with ARIA, the AHOS AI project advisor. Describe what you want to build and get instant, honest guidance — scope, timeline, and next steps." path="/aria-ai" />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "ARIA AI", url: "/aria-ai" }]} />

      <style>{css}</style>

      <header className="ed ed-page-hero ar-hero">
        <Reveal className="ed-label" y={12}>
          <span className="ed-label-n">05</span><span className="ed-label-line" /><span className="ed-label-text">AHOS AI</span>
        </Reveal>
        <Reveal delay={80}><h1 className="ed-h1">Meet <em>ARIA.</em></h1></Reveal>
        <Reveal delay={160}>
          <p className="ed-lead">Your AI project advisor. Describe what you want to build and get instant, honest advice — scope, timeline, and next steps. No form, no sales pitch.</p>
        </Reveal>
        <Reveal delay={220} className="ar-note">
          <span className="ar-live"><span className="ar-live-dot" /> Online now</span>
          <span>answers in seconds</span>
        </Reveal>
      </header>

      <section className="ar-chat-wrap">
        <div className="ar-chat">
          <div className="ar-hdr">
            <div className="ar-hdr-brand">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <defs><linearGradient id="arR" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse"><stop stopColor="#ff9d4e" /><stop offset="1" stopColor="#e05000" /></linearGradient></defs>
                <circle cx="10" cy="10" r="6.5" stroke="url(#arR)" strokeWidth="2" />
                <circle cx="10" cy="10" r="6.5" stroke="url(#arR)" strokeWidth="2" opacity="0.25" />
              </svg>
              <span>ARIA <em>by AHOS</em></span>
            </div>
            <button className="ar-new" onClick={newChat} title="New conversation">New</button>
          </div>

          <div className="ar-msgs" ref={msgsRef}>
            {messages.map((msg, i) => (
              <div key={i} className={"ar-row ar-" + msg.role + (i === messages.length - 1 && !busy ? " ar-last" : "")}>
                {msg.role === "assistant" && (
                  <div className="ar-av">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="6.5" stroke="url(#arR)" strokeWidth="2" />
                    </svg>
                  </div>
                )}
                <div className="ar-bub">{msg.content}</div>
              </div>
            ))}
            {busy && (
              <div className="ar-row ar-assistant">
                <div className="ar-av">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="6.5" stroke="url(#arR)" strokeWidth="2" />
                  </svg>
                </div>
                <div className="ar-bub">
                  <span className="ar-dot" /><span className="ar-dot" /><span className="ar-dot" />
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && !busy && (
            <div className="ar-chips">
              {CHIPS.map((chip) => (
                <button key={chip} className="ar-chip" onClick={() => handleChip(chip)}>{chip}</button>
              ))}
            </div>
          )}

          <div className="ar-bar">
            <textarea ref={inpRef} className="ar-inp" placeholder="Message ARIA..." rows={1} value={input}
              onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(120, e.target.scrollHeight) + "px"; }}
              onKeyDown={handleKeyDown} disabled={busy}
            />
            <button className="ar-send" disabled={busy || !input.trim()} onClick={() => sendMessage(input)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

const css = `
.ar-hero { text-align: center; display: flex; flex-direction: column; align-items: center; }
.ar-hero .ed-lead { margin: 0 auto; }
.ar-note { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; justify-content: center; margin-top: 28px; font-size: 13px; color: var(--text-dim); }
.ar-live { display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); }
.ar-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #46d27e; box-shadow: 0 0 0 0 rgba(70,210,126,0.5); animation: ar-pulse 2.2s infinite; }
@keyframes ar-pulse { 0%{box-shadow:0 0 0 0 rgba(70,210,126,0.5);} 70%{box-shadow:0 0 0 8px rgba(70,210,126,0);} 100%{box-shadow:0 0 0 0 rgba(70,210,126,0);} }

.ar-chat-wrap { padding: 0 var(--gutter) var(--section-pad); }
.ar-chat { max-width: 680px; margin: 0 auto; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--bg-card); overflow: hidden; display: flex; flex-direction: column; max-height: 600px; }
.ar-hdr { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-soft); background: var(--bg-2); }
.ar-hdr-brand { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--text); }
.ar-hdr-brand em { font-style: normal; color: var(--text-dim); font-weight: 400; font-size: 12px; }
.ar-new { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); background: none; border: 1px solid var(--border); border-radius: 8px; padding: 5px 12px; cursor: pointer; transition: color 0.2s, border-color 0.2s; }
.ar-new:hover { color: var(--orange); border-color: var(--border-hover); }

.ar-msgs { flex: 1; min-height: 0; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
.ar-msgs::-webkit-scrollbar { width: 4px; }
.ar-msgs::-webkit-scrollbar-thumb { background: var(--border); border-radius: 9px; }
.ar-row { display: flex; gap: 10px; align-items: flex-start; opacity: 0; animation: ar-in 0.3s ease forwards; }
@keyframes ar-in { to { opacity: 1; } }
.ar-row.ar-user { flex-direction: row-reverse; }
.ar-av { width: 24px; height: 24px; flex-shrink: 0; margin-top: 2px; display: flex; align-items: center; justify-content: center; background: var(--orange-soft); border-radius: 50%; }
.ar-bub { max-width: 80%; padding: 10px 15px; font-size: 14px; line-height: 1.6; word-break: break-word; border-radius: var(--radius-lg); background: var(--bg); border: 1px solid var(--border-soft); color: var(--text-muted); }
.ar-row.ar-user .ar-bub { color: var(--text); background: rgba(255,106,26,0.04); border-color: rgba(255,106,26,0.1); }
.ar-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--orange); opacity: 0.4; animation: ar-dot 1.5s ease-in-out infinite; margin-right: 3px; }
.ar-dot:nth-child(2) { animation-delay: 0.17s; }
.ar-dot:nth-child(3) { animation-delay: 0.34s; margin-right: 0; }
@keyframes ar-dot { 0%,60%,100%{transform:translateY(0);opacity:0.3;} 30%{transform:translateY(-4px);opacity:1;} }

.ar-chips { flex-shrink: 0; display: flex; flex-wrap: wrap; gap: 8px; padding: 0 16px 12px; }
.ar-chip { padding: 6px 16px; border-radius: 999px; background: var(--bg); border: 1px solid var(--border); color: var(--text-dim); font-size: 13px; font-family: var(--font-sans); cursor: pointer; transition: all 0.18s; }
.ar-chip:hover { background: var(--orange-soft); border-color: var(--border-hover); color: var(--orange-light); }

.ar-bar { flex-shrink: 0; display: flex; align-items: flex-end; gap: 8px; padding: 8px 16px 12px; border-top: 1px solid var(--border-soft); background: var(--bg-2); }
.ar-inp { flex: 1; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-size: 14px; font-family: var(--font-sans); padding: 9px 13px; resize: none; outline: none; line-height: 1.5; min-height: 40px; max-height: 100px; overflow-y: auto; transition: border-color 0.2s; }
.ar-inp::placeholder { color: var(--text-faint); }
.ar-inp:focus { border-color: var(--border-hover); }
.ar-send { width: 40px; height: 40px; border-radius: var(--radius); flex-shrink: 0; background: var(--orange); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #0a0a0b; transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s; }
.ar-send:not([disabled]):hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,106,26,0.25); }
.ar-send:not([disabled]):active { transform: scale(0.95); }
.ar-send[disabled] { opacity: 0.12; cursor: default; pointer-events: none; }

@media (max-width: 600px) {
  .ar-chat { max-height: 85vh; }
  .ar-msgs { padding: 12px; }
  .ar-bub { max-width: 88%; font-size: 13px; padding: 8px 12px; }
}
`;
