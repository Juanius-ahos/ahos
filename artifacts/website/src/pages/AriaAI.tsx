import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";

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

function Avatar() {
  return (
    <div className="ar-av">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <defs>
          <linearGradient id="avRing" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff9d4e" />
            <stop offset="1" stopColor="#e05000" />
          </linearGradient>
        </defs>
        <circle cx="10" cy="10" r="6.5" stroke="url(#avRing)" strokeWidth="2" />
        <circle cx="10" cy="10" r="6.5" stroke="url(#avRing)" strokeWidth="2" opacity="0.25" />
      </svg>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="ar-typing">
      <div className="ar-typing-dot" />
      <div className="ar-typing-dot" />
      <div className="ar-typing-dot" />
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
      <path d="M11 4v14M4 11h14" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

function fireLead(d: Record<string, string>, history: Message[]) {
  const tr = history.slice(-14).map((h) => `${h.role === "user" ? "Visitor" : "Aria"}: ${h.content}`).join("\n\n");
  const payload = {
    _captcha: "false",
    _subject: `New AHOS Lead - ${d.name || "Unknown"}`,
    ...d,
    Transcript: tr,
  };
  try { localStorage.setItem("ahos_lead_" + Date.now(), JSON.stringify(payload)); } catch {}
  fetch("https://formsubmit.co/ajax/info@ahos.xyz", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export default function AriaAI() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [stage, setStage] = useState<"welcome" | "chat">("welcome");
  const msgsRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<Message[]>([{ role: "assistant", content: WELCOME }]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    });
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
        if (hasName && (validEmail || validPhone)) {
          fireLead(d, historyRef.current);
          setLeadSent(true);
        }
      } catch {}
    }
    return clean;
  }, [leadSent]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setStage("chat");
    setBusy(true);

    const userMsg: Message = { role: "user", content: trimmed };
    const updated = [...historyRef.current, userMsg];
    historyRef.current = updated;
    setMessages(updated);
    setInput("");

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + GROQ_KEY,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
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
      const ariaMsg: Message = { role: "assistant", content: "Sorry, I hit a snag. Can you try again? (" + errMsg + ")" };
      historyRef.current = [...historyRef.current, ariaMsg];
      setMessages(historyRef.current);
    }

    setBusy(false);
    scrollToBottom();
  }, [busy, handleLead, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleChip = (chip: string) => {
    sendMessage(chip);
  };

  const newChat = () => {
    historyRef.current = [{ role: "assistant", content: WELCOME }];
    setMessages(historyRef.current);
    setLeadSent(false);
    setBusy(false);
    setStage("welcome");
    setInput("");
    if (inpRef.current) inpRef.current.style.height = "auto";
  };

  return (
    <>
      <SEOHead
        title="ARIA — Your AI Project Advisor"
        description="Chat with ARIA, the AHOS AI project advisor. Describe what you want to build and get instant, honest guidance — scope, timeline, and next steps."
        path="/aria-ai"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "ARIA AI", url: "/aria-ai" }]} />

      <div className="ar-page">
        <header className="ed ar-header">
          <div className="ar-header-inner">
            <div className="ar-brand">
              <div className="ar-logo-ring">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <defs>
                    <linearGradient id="arLogo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ff9d4e" />
                      <stop offset="1" stopColor="#e05000" />
                    </linearGradient>
                    <filter id="arLogoGlow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  <circle cx="20" cy="20" r="14" stroke="url(#arLogo)" strokeWidth="3" filter="url(#arLogoGlow)" />
                  <circle cx="20" cy="20" r="14" stroke="url(#arLogo)" strokeWidth="3" opacity="0.25" />
                </svg>
                <span className="ar-live-dot" />
              </div>
              <div className="ar-brand-text">
                <h1 className="ar-name">ARIA <span className="ar-by">by AHOS</span></h1>
                <span className="ar-status">
                  <span className="ar-status-dot" />
                  Online — AI Project Advisor
                </span>
              </div>
            </div>
            <button className="ar-new-btn" onClick={newChat} title="New conversation">
              <PlusIcon />
            </button>
          </div>
        </header>

        <div className="ar-chat">
          <div className="ar-msgs" ref={msgsRef}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={"ar-row ar-" + msg.role}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {msg.role === "assistant" && <Avatar />}
                <div className="ar-bub">{msg.content}</div>
              </motion.div>
            ))}
            {busy && (
              <div className="ar-row ar-assistant">
                <Avatar />
                <div className="ar-bub"><TypingDots /></div>
              </div>
            )}
          </div>

          {stage === "welcome" && messages.length === 1 && (
            <motion.div
              className="ar-chips"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              {CHIPS.map((chip) => (
                <button key={chip} className="ar-chip" onClick={() => handleChip(chip)}>
                  {chip}
                </button>
              ))}
            </motion.div>
          )}

          <div className="ar-bar">
            <textarea
              ref={inpRef}
              className="ar-inp"
              placeholder="Message ARIA..."
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(120, e.target.scrollHeight) + "px";
              }}
              onKeyDown={handleKeyDown}
              disabled={busy}
            />
            <button
              className="ar-send"
              disabled={busy || !input.trim()}
              onClick={() => sendMessage(input)}
            >
              <ArrowIcon />
            </button>
          </div>

          <div className="ar-foot">
            AHOS Studio &middot; ahos.xyz
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
