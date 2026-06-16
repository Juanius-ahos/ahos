import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";

const values = [
  { n: "01", title: "Own the whole thing", text: "No ticket-pushing. You take a problem from blank page to shipped, and your name is on it." },
  { n: "02", title: "Remote, async, adult", text: "Work where you think best. We care about what you ship, not when your status light is green." },
  { n: "03", title: "Real work, fast", text: "Small team, short chains. Your work reaches real users in weeks, not after six months of process." },
  { n: "04", title: "Range over silos", text: "We're a studio, not a factory line. Curiosity across web, software, Web3, and design is the whole point." },
];

const roles = [
  { role: "Full-stack Developer", stack: "React · TypeScript · Node · Postgres" },
  { role: "Product & Brand Designer", stack: "UI/UX · Identity · Motion" },
  { role: "Web3 Engineer", stack: "Solidity · EVM · Dapps" },
  { role: "Motion & Video Artist", stack: "After Effects · 3D · Editing" },
];

export default function Careers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!cv) return;
    setStatus("sending");
    try {
      const fd = new FormData();
      fd.append("_subject", `Career application — ${name}`);
      fd.append("Name", name);
      fd.append("Email", email);
      fd.append("Phone", phone);
      fd.append("Role", role);
      fd.append("Message", message);
      fd.append("CV", cv);
      const res = await fetch("https://formsubmit.co/ajax/daoujuan@gmail.com", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      setStatus(json && json.success === "true" ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <>
      <SEOHead
        title="Careers — Join the Studio"
        description="AHOS hires rarely and well. Developers, designers, Web3 engineers, and motion artists who'd rather own a problem than close a ticket."
        path="/careers"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Careers", url: "/careers" }]} />

      <style>{css}</style>

      <motion.header
        className="ed ed-page-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="ed-label">
          <span className="ed-label-n">03</span><span className="ed-label-line" /><span className="ed-label-text">Careers</span>
        </div>
        <h1 className="ed-h1">We hire rarely.<br /><em>And well.</em></h1>
        <p className="ed-lead">We stay small on purpose. When we do bring someone in, it's someone who'd rather own a hard problem than be handed an easy one.</p>
      </motion.header>

      {/* Pull-quote */}
      <div className="ed cr-quote">
        <span className="cr-quote-mark">&ldquo;</span>
        <blockquote className="cr-quote-text">The best code is the code you never have to explain twice.</blockquote>
        <span className="cr-quote-author">&mdash; Engineering Lead</span>
      </div>

      <motion.section
        className="ed ed-sec"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="ed-sec-head">
          <div className="ed-label"><span className="ed-label-n">A</span><span className="ed-label-line" /><span className="ed-label-text">What it's like</span></div>
          <h2 className="ed-h2">No ladders to climb.<br />Just good work to do.</h2>
        </div>
        <div className="cr-values">
          {values.map((v) => (
            <div key={v.n} className="cr-value">
              <span className="cr-n">{v.n}</span>
              <h3 className="cr-v-title">{v.title}</h3>
              <p className="cr-v-text">{v.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="ed ed-sec"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="ed-sec-head">
          <div className="ed-label"><span className="ed-label-n">B</span><span className="ed-label-line" /><span className="ed-label-text">Who we look for</span></div>
          <h2 className="ed-h2">Always open to<br />the right people.</h2>
        </div>
        <div className="cr-roles">
          {roles.map((r) => (
            <a key={r.role} className="cr-role" href={`mailto:info@ahos.xyz?subject=${encodeURIComponent(`Joining the studio — ${r.role}`)}`}>
              <span className="cr-role-name">{r.role}</span>
              <span className="cr-role-stack">{r.stack}</span>
              <span className="cr-role-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </motion.section>

      {/* Second pull-quote */}
      <motion.div
        className="ed cr-quote cr-quote-right"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <span className="cr-quote-mark">&ldquo;</span>
        <blockquote className="cr-quote-text">We don't do meetings about meetings. We do the work.</blockquote>
        <span className="cr-quote-author">&mdash; Studio mantra</span>
      </motion.div>

      <motion.section
        className="ed ed-sec cr-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        {status === "ok" ? (
          <div className="cr-done">
            <div className="cr-done-mark" aria-hidden="true">✓</div>
            <h2 className="ed-h2">Application sent.</h2>
            <p className="ed-lead">Thanks{name ? `, ${name.split(" ")[0]}` : ""} — we'll review your CV and get back to you if there's a fit.</p>
          </div>
        ) : (
          <>
            <h2 className="ed-h2">Don't see your role?</h2>
            <p className="ed-lead" style={{ margin: "18px 0 30px" }}>If you're genuinely good at something we'd be lucky to have, tell us. Send your work, not a résumé template — show us what you've actually shipped.</p>
            <form className="cr-form" onSubmit={submit}>
              <div className="cr-row">
                <div className="cr-field">
                  <label htmlFor="cr-name">Full name *</label>
                  <input id="cr-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="cr-field">
                  <label htmlFor="cr-email">Email *</label>
                  <input id="cr-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" />
                </div>
              </div>
              <div className="cr-row">
                <div className="cr-field">
                  <label htmlFor="cr-phone">Phone <span className="cr-opt-tag">optional</span></label>
                  <input id="cr-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+961 …" />
                </div>
                <div className="cr-field">
                  <label htmlFor="cr-role">Role interested in <span className="cr-opt-tag">optional</span></label>
                  <input id="cr-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Full-stack Developer, Designer, …" />
                </div>
              </div>
              <div className="cr-field">
                <label htmlFor="cr-msg">Cover letter <span className="cr-opt-tag">optional</span></label>
                <textarea id="cr-msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about yourself and what you've shipped." />
              </div>
              <div className="cr-field cr-cv-field">
                <label htmlFor="cr-cv">CV / Résumé *</label>
                <div className={`cr-cv-area ${cv ? "cr-cv-has" : ""}`}>
                  <input id="cr-cv" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => setCv(e.target.files?.[0] ?? null)} required />
                  {cv ? (
                    <span className="cr-cv-name">{cv.name} <span className="cr-opt-tag">({(cv.size / 1024).toFixed(0)} KB)</span></span>
                  ) : (
                    <span className="cr-cv-placeholder">Drop a file or click to browse (PDF, Word, or image)</span>
                  )}
                </div>
              </div>
              <button type="submit" className="ed-btn ed-btn-lg cr-submit" disabled={status === "sending" || !cv}>
                {status === "sending" ? "Sending…" : <>Send application<span>↗</span></>}
              </button>
              {status === "err" && <p className="cr-err">Something went wrong — try emailing us at info@ahos.xyz.</p>}
            </form>
          </>
        )}
      </motion.section>

      <Footer />
    </>
  );
}

const css = `
.cr-quote { position: relative; padding: clamp(40px, 6vw, 80px) 0; border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); margin-bottom: 0; }
.cr-quote-right { text-align: right; }
.cr-quote-mark { position: absolute; top: clamp(20px, 3vw, 40px); left: 0; font-family: var(--font-display); font-size: clamp(60px, 10vw, 120px); line-height: 1; color: var(--orange); opacity: 0.15; }
.cr-quote-right .cr-quote-mark { left: auto; right: 0; }
.cr-quote-text { font-family: var(--font-display); font-size: clamp(28px, 4.5vw, 56px); font-weight: 600; letter-spacing: -0.03em; line-height: 1.1; max-width: 900px; color: var(--text); position: relative; z-index: 1; }
.cr-quote-author { display: block; margin-top: 16px; font-family: var(--font-mono); font-size: 13px; color: var(--text-dim); position: relative; z-index: 1; }

.cr-values { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); border-radius: var(--radius-lg); overflow: hidden; }
.cr-value { background: var(--bg); padding: clamp(28px, 3.5vw, 44px); transition: background 0.3s; }
.cr-value:hover { background: var(--bg-2); }
.cr-n { font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--orange); }
.cr-v-title { font-family: var(--font-display); font-size: clamp(20px, 2.4vw, 28px); font-weight: 600; letter-spacing: -0.02em; margin: 14px 0 10px; }
.cr-v-text { font-size: 15px; line-height: 1.7; color: var(--text-muted); max-width: 42ch; }

.cr-roles { border-top: 1px solid var(--border-soft); }
.cr-role { display: grid; grid-template-columns: 1fr 1fr 40px; align-items: center; gap: 24px; padding: clamp(22px, 3vw, 32px) 8px; border-bottom: 1px solid var(--border-soft); transition: padding-left 0.3s ease, background 0.3s ease; }
.cr-role:hover { padding-left: 22px; background: linear-gradient(90deg, var(--orange-soft), transparent 55%); }
.cr-role-name { font-family: var(--font-display); font-size: clamp(20px, 2.4vw, 30px); font-weight: 600; letter-spacing: -0.02em; transition: color 0.25s; }
.cr-role:hover .cr-role-name { color: var(--orange); }
.cr-role-stack { font-size: 13.5px; color: var(--text-dim); }
.cr-role-arrow { font-size: 20px; color: var(--text-faint); text-align: right; transition: color 0.25s, transform 0.25s; }
.cr-role:hover .cr-role-arrow { color: var(--orange); transform: translate(3px, -3px); }

.cr-form { max-width: 640px; display: flex; flex-direction: column; gap: 18px; }
.cr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.cr-field { display: flex; flex-direction: column; gap: 7px; }
.cr-field label { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-dim); }
.cr-opt-tag { text-transform: none; letter-spacing: 0; color: var(--text-faint); font-weight: 500; }
.cr-field input, .cr-field textarea { font-family: var(--font-sans); font-size: 15px; color: var(--text); background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; resize: vertical; }
.cr-field input::placeholder, .cr-field textarea::placeholder { color: var(--text-faint); }
.cr-field input:focus, .cr-field textarea:focus { border-color: var(--orange); box-shadow: 0 0 0 3px var(--orange-soft); }
.cr-cv-area { position: relative; border: 1px dashed var(--border); border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
.cr-cv-area:hover { border-color: var(--border-hover); background: var(--bg-2); }
.cr-cv-area.cr-cv-has { border-style: solid; border-color: var(--orange); background: var(--orange-soft); }
.cr-cv-area input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.cr-cv-placeholder { font-size: 13px; color: var(--text-faint); }
.cr-cv-name { font-size: 14px; font-weight: 600; color: var(--text); }
.cr-submit { align-self: flex-start; border: none; cursor: pointer; font-family: var(--font-sans); }
.cr-submit:disabled { opacity: 0.6; cursor: default; }
.cr-err { color: #ff7a7a; font-size: 13.5px; }
.cr-done { text-align: center; padding: 30px 10px; }
.cr-done-mark { width: 56px; height: 56px; margin: 0 auto 18px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 24px; }
.cr-done h2 { font-family: var(--font-display); font-size: clamp(32px, 4.8vw, 52px); margin-bottom: 10px; }
.cr-done p { color: var(--text-muted); line-height: 1.7; max-width: 48ch; margin: 0 auto; }

@media (max-width: 760px) {
  .cr-values { grid-template-columns: 1fr; }
  .cr-role { grid-template-columns: 1fr auto; }
  .cr-role-stack { display: none; }
  .cr-row { grid-template-columns: 1fr; }
}
`;
