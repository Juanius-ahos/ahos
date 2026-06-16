import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { Reveal } from "../components/motion";

const projectTypes = ["Website", "Web app / SaaS", "Mobile app", "Web3 / DeFi", "AI / Automation", "Branding", "Not sure yet"];
const industries = ["Restaurant & Food", "Retail & E-commerce", "Real Estate", "Fitness & Wellness", "Finance & Crypto", "Tech & SaaS", "Creative & Media", "Other"];
const goals = ["Generate leads", "Sell online", "Build authority", "Automate a process", "Launch an MVP", "Raise / pitch"];
const stages = ["Just an idea", "Concept, no designs", "Designs ready", "Existing brand", "Product to rework"];
const budgets = ["< $3k", "$3k – $8k", "$8k – $20k", "$20k+", "Not sure yet"];
const timelines = ["~2 weeks", "Within a month", "1–3 months", "3–6 months", "Flexible", "Hard deadline"];

type Data = {
  projectType: string; industry: string; goal: string; stage: string;
  budget: string; timeline: string;
  name: string; email: string; phone: string; company: string; message: string;
};
const empty: Data = { projectType: "", industry: "", goal: "", stage: "", budget: "", timeline: "", name: "", email: "", phone: "", company: "", message: "" };

const STEPS = ["Project", "Goals", "Scope", "Details"];

export default function Contact() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const pick = (k: keyof Data, v: string) => setData((d) => ({ ...d, [k]: v }));
  const field = (k: keyof Data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => pick(k, e.target.value);

  const canNext =
    (step === 0 && data.projectType && data.industry) ||
    (step === 1 && data.goal && data.stage) ||
    (step === 2 && data.budget && data.timeline) ||
    step === 3;

  const next = () => { if (canNext && step < 3) setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const back = () => { if (step > 0) setStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/info@ahos.xyz", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New project plan — ${data.name || "Unknown"}`,
          Name: data.name, Email: data.email, Phone: data.phone, Company: data.company,
          "Project type": data.projectType, Industry: data.industry, Goal: data.goal,
          Stage: data.stage, Budget: data.budget, Timeline: data.timeline, Brief: data.message,
        }),
      });
      const json = await res.json();
      setStatus(json && json.success === "true" ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  const Options = ({ k, list }: { k: keyof Data; list: string[] }) => (
    <div className="pl-opts">
      {list.map((o) => (
        <button type="button" key={o} className={`pl-opt ${data[k] === o ? "is-sel" : ""}`} onClick={() => pick(k, o)}>
          {o}<span className="pl-opt-check" aria-hidden="true" />
        </button>
      ))}
    </div>
  );

  return (
    <>
      <SEOHead
        title="Start a Project — Build Your Plan"
        description="Tell AHOS what you're building with our quick project planner. A few steps, a phone number, and we'll come back with a clear plan within 24 hours."
        path="/contact"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }]} />

      <style>{css}</style>

      <header className="ed ed-page-hero ct-hero">
        <div>
          <Reveal className="ed-label" y={12}>
            <span className="ed-label-n">04</span><span className="ed-label-line" /><span className="ed-label-text">Start a project</span>
          </Reveal>
          <Reveal delay={80}><h1 className="ed-h1">Let's plan<br />your <em>build.</em></h1></Reveal>
          <Reveal delay={160}><p className="ed-lead">Four quick steps — no essay required. We'll read it, think about it, and come back with a straight answer and a clear plan, usually within a day.</p></Reveal>
          <Reveal delay={240} className="ct-meta">
            <a href="mailto:info@ahos.xyz" className="ct-meta-item"><span className="ed-cap">Email</span>info@ahos.xyz</a>
            <div className="ct-meta-item"><span className="ed-cap">Reply time</span>Within 24 hours</div>
            <div className="ct-meta-item"><span className="ed-cap">Based</span>Beirut — worldwide</div>
          </Reveal>
        </div>

        <Reveal delay={120} className="pl-card">
          {status === "ok" ? (
            <div className="pl-done">
              <div className="pl-done-mark" aria-hidden="true">✓</div>
              <h2>Plan received.</h2>
              <p>Thanks{data.name ? `, ${data.name.split(" ")[0]}` : ""} — we've got your brief. Expect a reply within 24 hours.</p>
            </div>
          ) : (
            <>
              <div className="pl-prog">
                {STEPS.map((s, i) => (
                  <div key={s} className={`pl-prog-step ${i === step ? "is-now" : ""} ${i < step ? "is-done" : ""}`}>
                    <span className="pl-prog-dot">{i < step ? "✓" : i + 1}</span>
                    <span className="pl-prog-label">{s}</span>
                  </div>
                ))}
                <div className="pl-prog-bar"><span style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} /></div>
              </div>

              {step === 0 && (
                <div className="pl-step">
                  <h3 className="pl-q">What are you building?</h3>
                  <Options k="projectType" list={projectTypes} />
                  <h3 className="pl-q">What's your industry?</h3>
                  <Options k="industry" list={industries} />
                </div>
              )}
              {step === 1 && (
                <div className="pl-step">
                  <h3 className="pl-q">What's the main goal?</h3>
                  <Options k="goal" list={goals} />
                  <h3 className="pl-q">Where are you right now?</h3>
                  <Options k="stage" list={stages} />
                </div>
              )}
              {step === 2 && (
                <div className="pl-step">
                  <h3 className="pl-q">Rough budget?</h3>
                  <Options k="budget" list={budgets} />
                  <h3 className="pl-q">Ideal timeline?</h3>
                  <Options k="timeline" list={timelines} />
                </div>
              )}
              {step === 3 && (
                <form className="pl-step pl-form" onSubmit={submit}>
                  <div className="pl-field">
                    <label htmlFor="pl-name">Your name *</label>
                    <input id="pl-name" required value={data.name} onChange={field("name")} placeholder="Jane Doe" />
                  </div>
                  <div className="pl-row">
                    <div className="pl-field">
                      <label htmlFor="pl-email">Email *</label>
                      <input id="pl-email" type="email" required value={data.email} onChange={field("email")} placeholder="jane@company.com" />
                    </div>
                    <div className="pl-field">
                      <label htmlFor="pl-phone">Phone / WhatsApp <span className="pl-opt-tag">optional — for a faster reply</span></label>
                      <input id="pl-phone" type="tel" value={data.phone} onChange={field("phone")} placeholder="+961 …" />
                    </div>
                  </div>
                  <div className="pl-field">
                    <label htmlFor="pl-company">Company <span className="pl-opt-tag">optional</span></label>
                    <input id="pl-company" value={data.company} onChange={field("company")} placeholder="Company name" />
                  </div>
                  <div className="pl-field">
                    <label htmlFor="pl-msg">Anything else? <span className="pl-opt-tag">optional</span></label>
                    <textarea id="pl-msg" rows={3} value={data.message} onChange={field("message")} placeholder="A line or two on the idea." />
                  </div>
                  <div className="pl-summary">
                    {[data.projectType, data.industry, data.goal, data.budget, data.timeline].filter(Boolean).map((t) => <span key={t}>{t}</span>)}
                  </div>
                  <button type="submit" className="ed-btn ed-btn-lg pl-submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : <>Send my plan<span>↗</span></>}
                  </button>
                  {status === "err" && <p className="pl-err">Something went wrong — email us at info@ahos.xyz.</p>}
                </form>
              )}

              <div className="pl-nav">
                {step > 0 && <button type="button" className="pl-back" onClick={back}>← Back</button>}
                {step < 3 && <button type="button" className="ed-btn pl-nextbtn" onClick={next} disabled={!canNext}>Continue<span>↗</span></button>}
              </div>
            </>
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

/* Progress */
.pl-prog { position: relative; display: flex; justify-content: space-between; margin-bottom: 30px; }
.pl-prog-bar { position: absolute; left: 0; right: 0; top: 13px; height: 2px; background: var(--border); z-index: 0; }
.pl-prog-bar span { display: block; height: 100%; background: var(--orange); transition: width 0.4s cubic-bezier(0.5,0,0.2,1); }
.pl-prog-step { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.pl-prog-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; background: var(--bg-2); border: 1px solid var(--border); color: var(--text-dim); transition: all 0.3s; }
.pl-prog-step.is-now .pl-prog-dot { background: var(--orange); color: #0a0a0b; border-color: var(--orange); box-shadow: 0 0 0 4px var(--orange-soft); }
.pl-prog-step.is-done .pl-prog-dot { background: var(--orange-soft); color: var(--orange); border-color: var(--border-hover); }
.pl-prog-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-dim); }
.pl-prog-step.is-now .pl-prog-label { color: var(--text); }

.pl-step { animation: pl-in 0.4s cubic-bezier(0.22,1,0.36,1); }
@keyframes pl-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.pl-q { font-family: var(--font-display); font-size: 16px; font-weight: 600; margin: 4px 0 12px; }
.pl-q:not(:first-child) { margin-top: 26px; }

.pl-opts { display: flex; flex-wrap: wrap; gap: 8px; }
.pl-opt { position: relative; padding: 10px 16px; border-radius: 999px; background: var(--bg); border: 1px solid var(--border); color: var(--text-muted); font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.pl-opt:hover { border-color: var(--border-hover); color: var(--text); }
.pl-opt.is-sel { background: var(--orange-soft); border-color: var(--orange); color: var(--orange); padding-right: 30px; }
.pl-opt-check { position: absolute; right: 12px; top: 50%; width: 12px; height: 12px; opacity: 0; transform: translateY(-50%) scale(0.6); transition: all 0.2s; }
.pl-opt.is-sel .pl-opt-check { opacity: 1; transform: translateY(-50%) scale(1); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 6.5l2.2 2.2L9.5 3.8' stroke='%23ff6a1a' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: center; }

/* Final form */
.pl-form { display: flex; flex-direction: column; gap: 16px; }
.pl-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pl-field { display: flex; flex-direction: column; gap: 7px; }
.pl-field label { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-dim); }
.pl-opt-tag { text-transform: none; letter-spacing: 0; color: var(--text-faint); font-weight: 500; }
.pl-field input, .pl-field textarea { font-family: var(--font-sans); font-size: 15px; color: var(--text); background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; resize: vertical; }
.pl-field input::placeholder, .pl-field textarea::placeholder { color: var(--text-faint); }
.pl-field input:focus, .pl-field textarea:focus { border-color: var(--orange); box-shadow: 0 0 0 3px var(--orange-soft); }
.pl-summary { display: flex; flex-wrap: wrap; gap: 6px; }
.pl-summary span { padding: 4px 10px; border-radius: 7px; background: var(--bg); border: 1px solid var(--border-soft); color: var(--text-dim); font-size: 11px; font-weight: 600; }
.pl-submit { align-self: flex-start; border: none; cursor: pointer; font-family: var(--font-sans); margin-top: 4px; }
.pl-submit:disabled { opacity: 0.6; cursor: default; }
.pl-err { color: #ff7a7a; font-size: 13.5px; }

.pl-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 26px; }
.pl-back { background: none; border: none; color: var(--text-dim); font-family: var(--font-sans); font-size: 14px; font-weight: 600; cursor: pointer; transition: color 0.2s; }
.pl-back:hover { color: var(--text); }
.pl-nextbtn { margin-left: auto; border: none; cursor: pointer; font-family: var(--font-sans); }
.pl-nextbtn:disabled { opacity: 0.45; cursor: not-allowed; }

.pl-done { text-align: center; padding: 30px 10px; }
.pl-done-mark { width: 56px; height: 56px; margin: 0 auto 18px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 24px; }
.pl-done h2 { font-family: var(--font-display); font-size: 28px; margin-bottom: 10px; }
.pl-done p { color: var(--text-muted); line-height: 1.7; }

@media (max-width: 860px) { .ct-hero { grid-template-columns: 1fr; } }
@media (max-width: 480px) { .pl-row { grid-template-columns: 1fr; } .pl-prog-label { display: none; } }
`;
