import { useState } from "react";
import { Arrow } from "../components/Arrow";
import { Head, PageHeader } from "../components/ui";
import { careers, site } from "../site.config";

export default function Careers() {
  const [f, setF] = useState({ name: "", email: "", phone: "", role: "", message: "" });
  const [cv, setCv] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((v) => ({ ...v, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!cv) return;
    if (cv.size > 10 * 1024 * 1024) { setStatus("err"); setErr("That file is over 10 MB. Try a smaller one."); return; }
    setStatus("sending");
    try {
      const fd = new FormData();
      fd.append("access_key", site.integrations.web3formsKey);
      fd.append("subject", `Career application, ${f.name}`);
      Object.entries(f).forEach(([k, v]) => fd.append(k, v));
      fd.append("cv", cv);
      const res = await fetch(site.integrations.web3formsEndpoint, { method: "POST", body: fd });
      const json = await res.json();
      setStatus(json?.success ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <>
      <PageHeader crumbs={[{ name: "Home", href: "/" }, { name: "Careers" }]} title={careers.h1} lead={careers.lead}>
        <a href="#apply" className="btn">Apply <Arrow dir="s" /></a>
      </PageHeader>

      <section className="sec" aria-labelledby="val-title">
        <div className="wrap">
          <Head id="val-title" title="No ladders. Just good work." />
          <div className="values">
            {careers.values.map((v, i) => (
              <div key={v.name}><span className="dim">{String(i + 1).padStart(2, "0")}</span><h3 className="d">{v.name}</h3><p>{v.body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec alt" aria-labelledby="roles-title">
        <div className="wrap">
          <Head id="roles-title" title="Always open to." lead="No fixed openings. If you are very good at one of these, we want to hear from you." />
          <ul className="index">
            {careers.roles.map((r) => (
              <li key={r.name} className="index-row" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
                <h3 className="d">{r.name}</h3>
                <p className="body">{r.stack}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="sec" aria-labelledby="apply-title">
        <div className="wrap contact-grid">
          <div>
            <h2 id="apply-title" className="d d-6">Show us what you have shipped.</h2>
            <p className="lead" style={{ marginTop: 20 }}>Send your work, not a template CV. Links to live things beat adjectives.</p>
          </div>
          {status === "ok" ? (
            <div className="done" role="status"><h2 className="d d-5">Application sent.</h2><p className="lead">Thanks{f.name ? `, ${f.name.split(" ")[0]}` : ""}. If there is a fit, we will be in touch.</p></div>
          ) : (
            <form className="form" onSubmit={submit}>
              <div className="form-row">
                <div className="field"><label htmlFor="c-name">Full name</label><input id="c-name" required value={f.name} onChange={set("name")} autoComplete="name" /></div>
                <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" type="email" required value={f.email} onChange={set("email")} autoComplete="email" /></div>
              </div>
              <div className="form-row">
                <div className="field"><label htmlFor="c-phone">Phone <span className="opt">optional</span></label><input id="c-phone" type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" /></div>
                <div className="field"><label htmlFor="c-role">Role <span className="opt">optional</span></label><input id="c-role" value={f.role} onChange={set("role")} /></div>
              </div>
              <div className="field"><label htmlFor="c-msg">About you and what you have shipped <span className="opt">optional</span></label><textarea id="c-msg" rows={4} value={f.message} onChange={set("message")} /></div>
              <div className="field">
                <label htmlFor="c-cv">CV or portfolio file</label>
                <div className="file">
                  <input id="c-cv" type="file" required accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => setCv(e.target.files?.[0] ?? null)} />
                  <span>{cv ? `${cv.name} (${Math.round(cv.size / 1024)} KB)` : "Drop a file or click to choose. PDF, Word or image, up to 10 MB."}</span>
                </div>
              </div>
              <div className="acts"><button type="submit" className="btn" disabled={status === "sending" || !cv}>{status === "sending" ? "Sending" : <>Send application <Arrow /></>}</button></div>
              {status === "err" && <p className="form-err" role="alert">{err || `That did not go through. Email ${site.contact.email} instead.`}</p>}
            </form>
          )}
        </div>
      </section>
    </>
  );
}
