import { useEffect, useRef, useState, useCallback } from "react";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";

const API_KEY = import.meta.env.VITE_OPENROUTER_KEY || "";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "meta-llama/llama-3.2-3b-instruct:free";

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
  const [apiReady, setApiReady] = useState(true);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<Message[]>([{ role: "assistant", content: WELCOME }]);

  useEffect(() => {
    if (!API_KEY) setApiReady(false);
  }, []);

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
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
          "HTTP-Referer": "https://www.ahos.xyz",
          "X-Title": "AHOS ARIA",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...updated.slice(-14)],
          max_tokens: 700,
          temperature: 0.72,
        }),
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
      const ariaMsg: Message = { role: "assistant", content: "Sorry, I hit a snag — " + errMsg + ". Please try again in a moment." };
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

      <div className="ar-page">
        <header className="ar-top">
          <div className="ar-top-l">
            <span className="ar-top-ico">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="url(#arG)" strokeWidth="2.5" />
              </svg>
            </span>
            <span className="ar-top-name">ARIA</span>
            <span className="ar-top-by">by AHOS</span>
          </div>
          <div className="ar-top-c">
            <span className="ar-live-dot" />
            <span>{apiReady ? "Online" : "No API key"}</span>
          </div>
          <button className="ar-top-new" onClick={newChat} title="New conversation">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            New chat
          </button>
        </header>

        <div className="ar-msgs" ref={msgsRef}>
          {messages.length === 1 && !busy && (
            <div className="ar-welcome">
              <div className="ar-welcome-ico">
                <svg width="40" height="40" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="url(#arG)" strokeWidth="2.5" />
                </svg>
              </div>
              <h1 className="ar-welcome-h1">Hi, I'm ARIA.</h1>
              <p className="ar-welcome-p">Your AI project advisor. Tell me what you're building — a website, app, AI tool, or Web3 project — and I'll help you scope it out.</p>
              <div className="ar-chips">
                {CHIPS.map((chip) => (
                  <button key={chip} className="ar-chip" onClick={() => handleChip(chip)}>{chip}</button>
                ))}
              </div>
            </div>
          )}
          {messages.slice(1).map((msg, i) => (
            <div key={i} className={"ar-msg " + (msg.role === "user" ? "ar-msg-user" : "ar-msg-aria")} style={{ animationDelay: "0s" }}>
              {msg.role === "assistant" && (
                <div className="ar-av">
                  <svg width="10" height="10" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="url(#arG)" strokeWidth="2.5" /></svg>
                </div>
              )}
              <div className="ar-bub">{msg.content}</div>
            </div>
          ))}
          {busy && (
            <div className="ar-msg ar-msg-aria">
              <div className="ar-av">
                <svg width="10" height="10" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="url(#arG)" strokeWidth="2.5" /></svg>
              </div>
              <div className="ar-bub"><span className="ar-dot" /><span className="ar-dot" /><span className="ar-dot" /></div>
            </div>
          )}
        </div>

        <div className="ar-bar">
          <textarea
            ref={inpRef}
            className="ar-inp"
            placeholder="Message ARIA..."
            rows={1}
            value={input}
            onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(120, e.target.scrollHeight) + "px"; }}
            onKeyDown={handleKeyDown}
            disabled={busy}
          />
          <button className="ar-send" disabled={busy || !input.trim()} onClick={() => sendMessage(input)} aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient id="arG" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff9d4e" /><stop offset="1" stopColor="#e05000" />
          </linearGradient>
        </defs>
      </svg>

      <Footer />
    </>
  );
}

const css = `
.ar-page { display: flex; flex-direction: column; height: calc(100vh - 64px); background: var(--bg); }
.ar-top { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 10px clamp(16px, 4vw, 28px); border-bottom: 1px solid var(--border-soft); background: var(--bg-2); }
.ar-top-l { display: flex; align-items: center; gap: 8px; }
.ar-top-ico { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: var(--orange-soft); border-radius: 50%; }
.ar-top-name { font-weight: 700; font-size: 15px; letter-spacing: -0.02em; color: var(--text); }
.ar-top-by { font-size: 11px; color: var(--text-faint); font-weight: 500; letter-spacing: 0.03em; text-transform: uppercase; }
.ar-top-c { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-dim); }
.ar-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #46d27e; box-shadow: 0 0 0 0 rgba(70,210,126,0.5); animation: ar-pulse 2.2s infinite; }
@keyframes ar-pulse { 0%{box-shadow:0 0 0 0 rgba(70,210,126,0.5);} 70%{box-shadow:0 0 0 8px rgba(70,210,126,0);} 100%{box-shadow:0 0 0 0 rgba(70,210,126,0);} }
.ar-top-new { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-sans); font-size: 11px; font-weight: 600; color: var(--text-dim); background: none; border: 1px solid var(--border); border-radius: 7px; padding: 5px 11px; cursor: pointer; transition: color 0.2s, border-color 0.2s; }
.ar-top-new:hover { color: var(--orange); border-color: var(--border-hover); }

.ar-msgs { flex: 1; min-height: 0; overflow-y: auto; padding: clamp(16px, 3vw, 28px) clamp(16px, 4vw, 36px); display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
.ar-msgs::-webkit-scrollbar { width: 4px; }
.ar-msgs::-webkit-scrollbar-thumb { background: var(--border); border-radius: 9px; }

.ar-welcome { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 14px; padding: 40px 20px; }
.ar-welcome-ico { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; background: var(--orange-soft); border-radius: 50%; margin-bottom: 4px; }
.ar-welcome-h1 { font-family: var(--font-display); font-size: clamp(28px, 5vw, 42px); font-weight: 700; letter-spacing: -0.03em; color: var(--text); line-height: 1.15; }
.ar-welcome-p { font-size: clamp(14px, 1.5vw, 16px); color: var(--text-muted); max-width: 480px; line-height: 1.65; }

.ar-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 10px; }
.ar-chip { padding: 8px 20px; border-radius: 999px; background: var(--bg-3); border: 1px solid var(--border); color: var(--text-dim); font-size: 13px; font-family: var(--font-sans); cursor: pointer; transition: all 0.18s; }
.ar-chip:hover { background: var(--orange-soft); border-color: var(--border-hover); color: var(--orange-light); }

.ar-msg { display: flex; gap: 10px; align-items: flex-start; animation: ar-in 0.25s ease-out both; }
@keyframes ar-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.ar-msg-user { flex-direction: row-reverse; }
.ar-av { width: 24px; height: 24px; flex-shrink: 0; margin-top: 3px; display: flex; align-items: center; justify-content: center; background: var(--orange-soft); border-radius: 50%; }
.ar-bub { max-width: 72%; padding: 10px 16px; font-size: 14px; line-height: 1.7; word-break: break-word; border-radius: 18px; background: var(--bg-3); border: 1px solid var(--border-soft); color: var(--text-muted); }
.ar-msg-user .ar-bub { color: var(--text); background: rgba(255,106,26,0.06); border-color: rgba(255,106,26,0.12); }
.ar-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--orange); opacity: 0.4; animation: ar-dot 1.5s ease-in-out infinite; margin-right: 3px; }
.ar-dot:nth-child(2) { animation-delay: 0.17s; }
.ar-dot:nth-child(3) { animation-delay: 0.34s; margin-right: 0; }
@keyframes ar-dot { 0%,60%,100%{transform:translateY(0);opacity:0.3;} 30%{transform:translateY(-4px);opacity:1;} }

.ar-bar { flex-shrink: 0; display: flex; align-items: flex-end; gap: 8px; padding: 10px clamp(16px, 4vw, 28px) 14px; border-top: 1px solid var(--border-soft); background: var(--bg-2); }
.ar-inp { flex: 1; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-size: 14px; font-family: var(--font-sans); padding: 9px 14px; resize: none; outline: none; line-height: 1.5; min-height: 40px; max-height: 100px; overflow-y: auto; transition: border-color 0.2s; }
.ar-inp::placeholder { color: var(--text-faint); }
.ar-inp:focus { border-color: var(--border-hover); }
.ar-send { width: 40px; height: 40px; border-radius: var(--radius); flex-shrink: 0; background: var(--orange); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #0a0a0b; transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s; }
.ar-send:not([disabled]):hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,106,26,0.25); }
.ar-send:not([disabled]):active { transform: scale(0.95); }
.ar-send[disabled] { opacity: 0.12; cursor: default; pointer-events: none; }

@media (max-width: 600px) {
  .ar-page { height: calc(100vh - 64px); }
  .ar-msgs { padding: 14px; gap: 8px; }
  .ar-bub { max-width: 85%; font-size: 13px; padding: 8px 13px; border-radius: 14px; }
  .ar-chips { gap: 6px; }
  .ar-chip { padding: 6px 16px; font-size: 12px; }
}
`;