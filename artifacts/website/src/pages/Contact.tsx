import { useState } from "react";
import { Link } from "wouter";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { Reveal } from "../components/motion";
import { trackEvent } from "../lib/analytics";

const W3F_KEY = "840f1d96-d5b1-4659-8a5e-30eae7d9f5db";
const types = ["Website", "Web app / SaaS", "Mobile app", "Web3 / DeFi", "AI / Automation", "Branding", "Not sure yet"];
const budgets = ["< $3k", "$3k – $8k", "$8k – $20k", "$20k+", "Not sure yet"];

type Data = { name: string; email: string; phone: string; company: string; type: string; budget: string; message: string };
const empty: Data = { name: "", email: "", phone: "", company: "", type: "", budget: "", message: "" };

export default function Contact() {
  const [data, setData] = useState<Data>(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const pick = (k: keyof Data, v: string) => setData((d) => ({ ...d, [k]: v }));
  const field = (k: keyof Data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => pick(k, e.target.value);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: W3F_KEY,
          subject: `New project plan — ${data.name || "Unknown"}`,
          name: data.name, email: data.email, phone: data.phone, company: data.company,
          type: data.type, budget: data.budget, message: data.message,
        }),
      });
      const json = await res.json();
      const ok = json && json.success;
      setStatus(ok ? "ok" : "err");
      if (ok) trackEvent("generate_lead", { method: "contact_form", type: data.type, budget: data.budget });
    } catch {
      setStatus("err");
    }
  }

  const Chips = ({ k, list }: { k: keyof Data; list: string[] }) => (
    <div className="pl-opts">
      {list.map((o) => (
        <button type="button" key={o} className={`pl-opt ${data[k] === o ? "is-sel" : ""}`} onClick={() => pick(k, o === data[k] ? "" : o)}>
          {o}<span className="pl-opt-check" aria-hidden="true" />
        </button>
      ))}
    </div>
  );

  return (
    <>
      <SEOHead
        title="Start a Project — Tell Us Your Idea"
        description="Tell AHOS what you're building. Name, email, and a brief description — we'll come back with a clear plan within 24 hours."
        path="/contact"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }]} />

      <style>{css}</style>

      <header className="ed ed-page-hero ct-hero">
        <div>
          <Reveal className="ed-label" y={12}>
            <span className="ed-label-n">04</span><span className="ed-label-line" /><span className="ed-label-text">Start a project</span>
          </Reveal>
          <Reveal delay={80}><h1 className="ed-h1">Tell us<br />your <em>idea.</em></h1></Reveal>
          <Reveal delay={160}><p className="ed-lead">Name + email + a brief idea. We'll read it, think about it, and come back with a straight answer and a clear plan, usually within a day.</p></Reveal>
          <Reveal delay={240} className="ct-meta">
            <a href="mailto:info@ahos.xyz" className="ct-meta-item"><span className="ed-cap">Email</span>info@ahos.xyz</a>
            <a href="https://wa.me/96170165601" className="ct-meta-item" target="_blank" rel="noopener noreferrer"><span className="ed-cap">WhatsApp</span>+961 70 165 601</a>
            <div className="ct-meta-item"><span className="ed-cap">Reply time</span>Within 24 hours</div>
            <div className="ct-meta-item"><span className="ed-cap">Based</span>Beirut — worldwide</div>
            <Link href="/services" className="ct-meta-item"><span className="ed-cap">Services</span>See what we build →</Link>
          </Reveal>
        </div>

        <Reveal delay={120} className="pl-card">
          {status === "ok" ? (
            <div className="pl-done">
              <div className="pl-done-mark" aria-hidden="true">✓</div>
              <h2>Idea received.</h2>
              <p>Thanks{data.name ? `, ${data.name.split(" ")[0]}` : ""} — we've got your message. Expect a reply within 24 hours.</p>
            </div>
          ) : (
            <form className="pl-form" onSubmit={submit}>
              <div className="pl-row">
                <div className="pl-field">
                  <label htmlFor="pl-name">Your name *</label>
                  <input id="pl-name" required value={data.name} onChange={field("name")} placeholder="Jane Doe" autoComplete="name" />
                </div>
                <div className="pl-field">
                  <label htmlFor="pl-email">Email *</label>
                  <input id="pl-email" type="email" required value={data.email} onChange={field("email")} placeholder="jane@company.com" autoComplete="email" />
                </div>
              </div>
              <div className="pl-row">
                <div className="pl-field">
                  <label htmlFor="pl-phone">Phone / WhatsApp <span className="pl-opt-tag">for a faster reply</span></label>
                  <input id="pl-phone" type="tel" value={data.phone} onChange={field("phone")} placeholder="+961 70 165 601" autoComplete="tel" />
                </div>
                <div className="pl-field">
                  <label htmlFor="pl-company">Company <span className="pl-opt-tag">optional</span></label>
                  <input id="pl-company" value={data.company} onChange={field("company")} placeholder="Company name" autoComplete="organization" />
                </div>
              </div>

              <div className="pl-section-label">What are you building?</div>
              <Chips k="type" list={types} />

              <div className="pl-section-label">Rough budget? <span className="pl-opt-tag">optional</span></div>
              <Chips k="budget" list={budgets} />

              <div className="pl-field" style={{ marginTop: 4 }}>
                <label htmlFor="pl-msg">Anything else? <span className="pl-opt-tag">optional</span></label>
                <textarea id="pl-msg" rows={3} value={data.message} onChange={field("message")} placeholder="A line or two about your project, timeline, or what you have in mind." />
              </div>

              <button type="submit" className="ed-btn ed-btn-lg pl-submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : <>Send my idea<span>↗</span></>}
              </button>
              {status === "err" && <p className="pl-err">Something went wrong — email us at info@ahos.xyz.</p>}
            </form>
          )}
        </Reveal>
      </header>

      <Footer />
    </>
  );
}

const css = `
.ct-hero { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(40px, 6vw, 80px); align-items: start; }
.ct-meta { display: flex; flex-wrap: wrap; gap: 28px; margin-top: 38px; }
.ct-meta-item { display: flex; flex-direction: column; gap: 6px; font-size: 15px; color: var(--text); }
a.ct-meta-item { transition: color 0.2s; } a.ct-meta-item:hover { color: var(--orange); }

.pl-card { border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--bg-card); padding: clamp(22px, 2.6vw, 36px); backdrop-filter: blur(8px); }

.pl-form { display: flex; flex-direction: column; gap: 16px; }
.pl-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pl-field { display: flex; flex-direction: column; gap: 7px; }
.pl-field label { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-dim); }
.pl-opt-tag { text-transform: none; letter-spacing: 0; color: var(--text-faint); font-weight: 500; }
.pl-field input, .pl-field textarea { font-family: var(--font-sans); font-size: 15px; color: var(--text); background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; resize: vertical; }
.pl-field input::placeholder, .pl-field textarea::placeholder { color: var(--text-faint); }
.pl-field input:focus, .pl-field textarea:focus { border-color: var(--orange); box-shadow: 0 0 0 3px var(--orange-soft); }

.pl-section-label { font-family: var(--font-display); font-size: 16px; font-weight: 600; margin: 8px 0 4px; }

.pl-opts { display: flex; flex-wrap: wrap; gap: 8px; }
.pl-opt { position: relative; padding: 10px 16px; border-radius: 999px; background: var(--bg); border: 1px solid var(--border); color: var(--text-muted); font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.pl-opt:hover { border-color: var(--border-hover); color: var(--text); }
.pl-opt.is-sel { background: var(--orange-soft); border-color: var(--orange); color: var(--orange); padding-right: 30px; }
.pl-opt-check { position: absolute; right: 12px; top: 50%; width: 12px; height: 12px; opacity: 0; transform: translateY(-50%) scale(0.6); transition: all 0.2s; }
.pl-opt.is-sel .pl-opt-check { opacity: 1; transform: translateY(-50%) scale(1); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 6.5l2.2 2.2L9.5 3.8' stroke='%23ff6a1a' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: center; }

.pl-submit { align-self: flex-start; border: none; cursor: pointer; font-family: var(--font-sans); margin-top: 8px; }
.pl-submit:disabled { opacity: 0.6; cursor: default; }

.pl-done { text-align: center; padding: 30px 10px; }
.pl-done-mark { width: 56px; height: 56px; margin: 0 auto 18px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 24px; }
.pl-done h2 { font-family: var(--font-display); font-size: 28px; margin-bottom: 10px; }
.pl-done p { color: var(--text-muted); line-height: 1.7; }

.pl-err { color: #ff7a7a; font-size: 13.5px; }

@media (max-width: 860px) { .ct-hero { grid-template-columns: 1fr; } }
@media (max-width: 480px) {
  .pl-row { grid-template-columns: 1fr; }
  .pl-submit { width: 100%; justify-content: center; }
}
`;
