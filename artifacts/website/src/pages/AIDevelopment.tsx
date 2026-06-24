import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";

const services = [
  {
    n: "01",
    name: "Custom AI Tools & Agents",
    tag: "AI that does real work inside your business.",
    desc: "Custom AI tools built for specific workflows — not generic chatbots bolted on after the fact. Document processing, data extraction, content generation, classification, decision support. We pick the right model (OpenAI, open-source, or fine-tuned) and deploy it where it actually saves time.",
    chips: ["Document Processing", "Data Extraction", "Content Generation", "Classification", "Decision Support"],
  },
  {
    n: "02",
    name: "Workflow Automation with AI",
    tag: "Hours of manual work, automated by AI.",
    desc: "AI-powered automation pipelines that replace repetitive human tasks. Email triage, lead scoring, invoice processing, report generation, customer support routing — we connect your tools and let AI handle the busywork while your team focuses on decisions.",
    chips: ["Email Automation", "Lead Scoring", "Invoice Processing", "Report Generation", "Support Routing"],
    popular: true,
  },
  {
    n: "03",
    name: "AI Chatbots & Virtual Assistants",
    tag: "Conversational AI that actually helps.",
    desc: "Custom chatbots trained on your business knowledge — product documentation, FAQs, support tickets, internal wikis. From simple FAQ bots to multi-step conversational agents that can qualify leads, book calls, and escalate to humans when needed. Like ARIA, but for your business.",
    chips: ["Custom Chatbots", "Lead Qualification", "Document Q&A", "Multi-Step Conversations", "Human Escalation"],
  },
  {
    n: "04",
    name: "LLM Integration & Fine-Tuning",
    tag: "Make large language models work for your specific use case.",
    desc: "Integrate GPT, Claude, Llama, Mistral, or open-source models into your product. Fine-tune on your data for better accuracy, build RAG pipelines for document grounding, and optimize prompt chains for consistent, reliable outputs at scale.",
    chips: ["GPT / Claude / Llama", "Fine-Tuning", "RAG Pipelines", "Prompt Engineering", "Model Evaluation"],
  },
  {
    n: "05",
    name: "AI Strategy & Consulting",
    tag: "Know where AI actually adds value.",
    desc: "Not every problem needs AI. We help you identify the workflows where AI compounds — and the ones where a simple script is the better answer. Feasibility studies, proof-of-concept builds, model selection, and a clear roadmap from experiment to production.",
    chips: ["Feasibility Studies", "PoC Development", "Model Selection", "Tech Roadmap", "Cost Analysis"],
  },
];

export default function AIDevelopment() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEOHead
        title="AI Development Agency — Custom AI Tools & Automation"
        description="AHOS builds custom AI tools, chatbots, workflow automation, and LLM-powered systems. From strategy to deployment — AI that actually does real work for your business."
        path="/ai-development"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "AI Development", url: "/ai-development" }]} />

      <style>{css}</style>

      <motion.header
        className="ed ed-page-hero ai-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="ai-hero-grid">
          <div>
            <div className="ed-label">
              <span className="ed-label-n">04</span><span className="ed-label-line" /><span className="ed-label-text">AI & Automation</span>
            </div>
            <h1 className="ed-h1">AI that actually<br /><em>does the work.</em></h1>
            <p className="ed-lead">Not another chatbot wrapper. Custom AI tools, automations, and intelligent systems built to save your team hours every week — from strategy through deployment.</p>
            <div className="ed-cta-row" style={{ marginTop: 32 }}>
              <Link href="/contact" className="ed-btn ed-btn-lg">Build your AI tool<span>↗</span></Link>
              <Link href="/aria-ai" className="ed-link-arrow">Try ARIA, our AI advisor →</Link>
            </div>
          </div>
          <div className="ai-terminal" aria-hidden="true">
            <div className="ai-term-head">
              <span className="ai-term-dot" style={{ background: "#ff5f56" }} />
              <span className="ai-term-dot" style={{ background: "#ffbd2e" }} />
              <span className="ai-term-dot" style={{ background: "#27c93f" }} />
            </div>
            <div className="ai-term-body">
              <span className="ai-term-comment"># Process 1,200 invoices</span><br />
              <span className="ai-term-prompt">ai </span>analyze invoices/ --extract totals<br />
              <span className="ai-term-out">\u2713 1,198 invoices processed</span><br />
              <span className="ai-term-out">\u2713 $342,510.23 total extracted</span><br />
              <span className="ai-term-out">\u2713 12 anomalies flagged</span><br />
              <span className="ai-term-prompt">ai </span>export report --format csv<br />
              <span className="ai-term-out">\u2713 report-invoices-2026.csv saved</span><br />
              <span className="ai-term-prompt">ai </span><span className="ai-term-blink">_</span>
            </div>
          </div>
        </div>
      </motion.header>

      <section className="ai-rows-wrap">
        {services.map((s, i) => (
          <section key={s.n} className={`ed ed-sec ${i % 2 === 1 ? "ai-alt" : ""}`}>
            <div className="ai-row">
              <div className="ai-row-head">
                <span className="ai-n">{s.n}</span>
                <h2 className="ai-name">{s.name}{s.popular && <span className="ai-pop">Popular</span>}</h2>
              </div>
              <div className="ai-row-body">
                <p className="ai-tag">{s.tag}</p>
                <p className="ai-desc">{s.desc}</p>
                <div className="ai-chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
              </div>
            </div>
          </section>
        ))}
      </section>

      <motion.section
        className="ed ed-sec ai-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 className="ed-h2">Ready to put AI to work?</h2>
          <p className="ed-lead" style={{ margin: "18px auto 30px", maxWidth: 560 }}>Book a free 30-minute call. We'll identify the workflows where AI compounds and build a proof-of-concept — no commitment, just real results.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/contact" className="ed-btn ed-btn-lg">Book a call<span>↗</span></Link>
            <Link href="/aria-ai" className="ed-link-arrow">Meet ARIA, our AI advisor →</Link>
          </div>
        </div>
      </motion.section>

      <Footer />
    </>
  );
}

const css = `
.ai-hero-grid { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.ai-terminal { background: #0d0d10; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; font-family: var(--font-mono); font-size: 12px; line-height: 1.9; }
.ai-term-head { display: flex; gap: 8px; padding: 12px 16px; background: var(--bg-3); border-bottom: 1px solid var(--border); }
.ai-term-dot { width: 12px; height: 12px; border-radius: 50%; }
.ai-term-body { padding: 16px 20px; color: var(--text-dim); }
.ai-term-prompt { color: #27c93f; }
.ai-term-out { color: var(--text-muted); }
.ai-term-comment { color: var(--text-faint); font-style: italic; }
.ai-term-blink { animation: ai-blink 1s step-end infinite; }
@keyframes ai-blink { 50% { opacity: 0; } }

.ai-rows-wrap { border-top: 1px solid var(--border-soft); }
.ai-row { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(24px, 5vw, 72px); padding: clamp(32px, 4vw, 52px) 4px; border-bottom: 1px solid var(--border-soft); transition: background 0.3s; }
.ai-row:hover { background: linear-gradient(90deg, var(--orange-soft), transparent 55%); }
.ai-alt { background: var(--bg-2); }
.ai-row-head { display: flex; align-items: baseline; gap: 18px; }
.ai-n { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--orange); }
.ai-name { font-family: var(--font-display); font-size: clamp(24px, 3.4vw, 42px); font-weight: 600; line-height: 1.02; letter-spacing: -0.03em; }
.ai-pop { display: inline-block; margin-left: 12px; padding: 4px 11px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; vertical-align: middle; white-space: nowrap; }
.ai-tag { font-size: 16px; font-weight: 500; color: var(--orange); margin-bottom: 12px; }
.ai-desc { font-size: 15px; line-height: 1.75; color: var(--text-muted); margin-bottom: 20px; max-width: 60ch; }
.ai-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ai-chips span { padding: 6px 13px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-muted); font-size: 12px; font-weight: 600; }

@media (max-width: 860px) {
  .ai-hero-grid { grid-template-columns: 1fr; }
  .ai-row { grid-template-columns: 1fr; gap: 16px; }
}
`;
