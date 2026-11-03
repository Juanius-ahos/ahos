import { useEffect, useState } from "react";
import { Crumbs, useBeirut } from "../components/ui";
import { Arrow } from "../components/Arrow";
import { services, site } from "../site.config";
import { trackEvent } from "../lib/analytics";

const TYPES = [...services.map((s) => s.label), "Not sure yet"];
const BUDGETS = ["Under $1,000", "$1,000 to $3,000", "$3,000 to $8,000", "$8,000 to $20,000", "$20,000 or more", "Not sure yet"];

type Data = { name: string; email: string; phone: string; company: string; type: string; budget: string; message: string };

export default function Contact() {
  const clock = useBeirut();
  const [d, setD] = useState<Data>({ name: "", email: "", phone: "", company: "", type: "", budget: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  // prefill from ?service=slug links
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const s = services.find((x) => x.slug === slug);
    if (s) setD((v) => ({ ...v, type: s.label }));
  }, []);

  const set = (k: keyof Data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setD((v) => ({ ...v, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(site.integrations.web3formsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: site.integrations.web3formsKey, subject: `New project enquiry, ${d.name || "unknown"}`, ...d }),
      });
      const json = await res.json();
      setStatus(json?.success ? "ok" : "err");
      if (json?.success) trackEvent("generate_lead", { method: "contact_form", type: d.type, budget: d.budget });
    } catch {
      setStatus("err");
    }
  }

  return (
    <section className="ph" aria-labelledby="ct-title">
      <div className="wrap" style={{ position: "relative" }}>
        <Crumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />
        <div className="contact-grid">
          <div>
            <h1 id="ct-title" className="d d-6">Tell us what you're building.</h1>
            <p className="lead" style={{ marginTop: 24, color: "var(--ink)" }}>
              A real person replies within {site.contact.replyWithin} with a plan and a fixed quote.
              {clock && <> It is {clock.time} in Beirut{clock.atDesk ? ", and we are at our desks." : ", so expect us first thing in the morning."}</>}
            </p>
            <div className="contact-ways" style={{ marginTop: 40 }}>
              <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { where: "contact" })}><span>WhatsApp, fastest</span><b>{site.contact.phone}</b></a>
              <a href={`mailto:${site.contact.email}`} onClick={() => trackEvent("email_click", { where: "contact" })}><span>Email</span><b>{site.contact.email}</b></a>
              <div><span>Studio</span><b>Beirut, Lebanon</b></div>
            </div>
          </div>

          <div>
            {status === "ok" ? (
              <div className="done" role="status">
                <h2 className="d d-5">Got it{d.name ? `, ${d.name.split(" ")[0]}` : ""}.</h2>
                <p className="lead">We have your message and will reply within {site.contact.replyWithin}.</p>
              </div>
            ) : (
              <form className="form" onSubmit={submit}>
                <div className="form-row">
                  <div className="field"><label htmlFor="f-name">Your name</label><input id="f-name" required value={d.name} onChange={set("name")} autoComplete="name" /></div>
                  <div className="field"><label htmlFor="f-email">Email</label><input id="f-email" type="email" required value={d.email} onChange={set("email")} autoComplete="email" /></div>
                </div>
                <div className="form-row">
                  <div className="field"><label htmlFor="f-phone">Phone or WhatsApp <span className="opt">optional</span></label><input id="f-phone" type="tel" value={d.phone} onChange={set("phone")} autoComplete="tel" /></div>
                  <div className="field"><label htmlFor="f-company">Company <span className="opt">optional</span></label><input id="f-company" value={d.company} onChange={set("company")} autoComplete="organization" /></div>
                </div>
                <fieldset className="field">
                  <legend>What are you building?</legend>
                  <div className="choices">
                    {TYPES.map((t) => (
                      <label key={t} className="choice"><input type="radio" name="type" value={t} checked={d.type === t} onChange={set("type")} /><span>{t}</span></label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="field">
                  <legend>Rough budget <span className="opt">optional</span></legend>
                  <div className="choices">
                    {BUDGETS.map((b) => (
                      <label key={b} className="choice"><input type="radio" name="budget" value={b} checked={d.budget === b} onChange={set("budget")} /><span>{b}</span></label>
                    ))}
                  </div>
                </fieldset>
                <div className="field"><label htmlFor="f-msg">A line or two about it <span className="opt">optional</span></label><textarea id="f-msg" rows={4} value={d.message} onChange={set("message")} /></div>
                <div className="acts">
                  <button type="submit" className="btn" disabled={status === "sending"}>{status === "sending" ? "Sending" : <>Send it <Arrow /></>}</button>
                  <span className="form-note">Or book a call straight away on WhatsApp.</span>
                </div>
                {status === "err" && <p className="form-err" role="alert">That did not go through. Email us at {site.contact.email} instead.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
