import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { Arrow } from "./Arrow";
import { Field, Kicker, Need, Testimonial } from "./kit";
import { asset, money, process, projects, serviceBySlug, site, alsoBuilt, type Outcome } from "../site.config";
import { trackEvent } from "../lib/analytics";

/** Homepage sections that are bigger than a single kit component. */

/* ---------- outcome card ---------- */

export function OutcomeCard({ o }: { o: Outcome }) {
  const s = serviceBySlug(o.service)!;
  return (
    <article className="oc">
      <h3 className="oc-n">{o.title}</h3>
      <p className="oc-b">{o.body}</p>
      <dl className="svc-f">
        <div><dt>From</dt><dd>{money(s.from)}</dd></div>
        <div><dt>Timeline</dt><dd>{s.timeline}</dd></div>
      </dl>
      <div className="svc-i">
        <Kicker>What's included</Kicker>
        <ul>{o.included.map((i) => <li key={i}>{i}</li>)}</ul>
      </div>
      {o.need && <p><Need>{o.need}</Need></p>}
      <Link href={s.href} className="lnk">Explore {s.label} <Arrow /></Link>
    </article>
  );
}

/* ---------- how we work: five steps on one progress line ---------- */

export function ProcessLine() {
  return (
    <div className="pl">
      <ol className="pl-steps">
        {process.map((s, i) => (
          <li key={s.name} style={{ ["--i" as string]: i }}>
            <span className="pl-n" aria-hidden="true">{i + 1}</span>
            <h3>{s.name}</h3>
            <p>{s.body}</p>
            <span className="pl-t">{s.time}</span>
          </li>
        ))}
      </ol>
      <p className="pl-badge">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>
        30-day warranty on every build
      </p>
    </div>
  );
}

/* ---------- founder ---------- */

export function Founder() {
  return (
    <section id="about" className="sec founder" aria-labelledby="founder-title">
      <div className="wrap founder-in">
        <figure className="founder-photo">
          <img src={asset("/team/jean-paul-400.webp")} width={400} height={400} alt="Jean Paul, founder of AHOS" loading="lazy" decoding="async" />
        </figure>
        <div className="founder-copy">
          <Kicker>The founder</Kicker>
          <h2 id="founder-title" className="d d-5">The person you will talk to.</h2>
          <p className="founder-p">
            I'm Jean Paul, the founder of AHOS. We are a design and engineering studio in Beirut, and since {site.founded} we have delivered more than 100 projects for clients in Lebanon, the US, Europe and Oman.
          </p>
          <p className="founder-p">
            I lead a small senior team. The people who design your product are the people who build it, and you talk to them directly.
          </p>
          <p><Need>your own words on why AHOS exists, 3 to 5 lines. Rough is fine, I will only polish the wording</Need></p>
          <p className="founder-sign"><b>Jean Paul</b><span>Founder, AHOS</span></p>
        </div>
      </div>
    </section>
  );
}

/* ---------- testimonials ---------- */

export function Testimonials({ items }: { items: { text: string; name: string; role: string; link?: string }[] }) {
  const trustpilot = site.proof.find((p) => "href" in p && p.href);
  return (
    <section className="sec alt tst-section" aria-labelledby="tst-title">
      <div className="wrap">
        <header className="sh sh-split">
          <div>
            <Kicker>What clients say</Kicker>
            <h2 id="tst-title" className="d d-5">In their words.</h2>
          </div>
          {trustpilot && "href" in trustpilot && <p className="lead"><a className="lnk" href={trustpilot.href} target="_blank" rel="noopener noreferrer">See our Trustpilot profile <Arrow /></a></p>}
        </header>
        <div className="tst-grid">
          {items.map((t) => <Testimonial key={t.name} {...t} />)}
          <p className="tst-need"><Need>more real client reviews, with the client's permission to quote them</Need></p>
        </div>
      </div>
    </section>
  );
}

/* ---------- the lab ---------- */

export function LoopVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} className="lab-v" muted loop playsInline preload="none" poster={asset(poster)} aria-label={label} width={432} height={768}>
      <source src={asset(src)} type="video/mp4" />
    </video>
  );
}

const REELS: { src: string; poster: string; title: string; note: string; label: string; href?: string }[] = [
  { src: "/lab/geo-reel.mp4", poster: "/lab/geo-reel.webp", title: "Is AI recommending your business?", note: "A GEO explainer with a 3D phone", label: "Muted loop: a 3D phone asks an AI assistant which web agency in Beirut to hire" },
  { src: "/lab/particles-reel.mp4", poster: "/lab/particles-reel.webp", title: "Connect. Build.", note: "Particles that turn into a structure", label: "Muted loop: particles connect into a lattice, a 3D motion piece" },
  { src: "/lab/wifi-reel.mp4", poster: "/lab/wifi-reel.webp", title: "What if you could see Wi-Fi?", note: "A 3D what-if: the waves your router sends", label: "Muted loop: a 3D router sends out orange waves, asking what if you could see Wi-Fi", href: site.lab.wifiReel.url },
];

export function Lab() {
  const ig = site.socials.find((s) => s.label === "Instagram");
  return (
    <section id="lab" className="sec lab grain" aria-labelledby="lab-title">
      <div className="wrap">
        <header className="sh sh-split">
          <div>
            <Kicker>The Lab</Kicker>
            <h2 id="lab-title" className="d d-5">Motion and 3D, made in house.</h2>
          </div>
          <p className="lead">The reels we make for ourselves. Same team, same tools we use on your site.</p>
        </header>
        <div className="lab-grid">
          {REELS.map((r) => (
            <figure key={r.src} className="lab-card">
              <LoopVideo src={r.src} poster={r.poster} label={r.label} />
              <figcaption>
                <b>{r.title}</b>
                <span>{r.note}</span>
                {r.href && <a className="lnk lab-full" href={r.href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("cta_click", { where: "lab_wifi_reel" })}>Watch the full reel on Instagram <Arrow /></a>}
              </figcaption>
            </figure>
          ))}
        </div>
        {ig && (
          <p className="lab-follow">
            <a className="btn btn-ghost" href={ig.href} target="_blank" rel="noopener noreferrer" data-magnetic="" onClick={() => trackEvent("cta_click", { where: "lab_instagram" })}>Follow @ahos.xyz on Instagram</a>
          </p>
        )}
      </div>
    </section>
  );
}

/* ---------- free website check (WhatsApp only) ---------- */

const GOALS = ["Get found on Google", "Sell online", "Automate my replies", "Look more premium", "Something else"];

export function FreeCheck({ where = "home" }: { where?: string }) {
  const [v, setV] = useState({ name: "", link: "", phone: "", goal: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [url, setUrl] = useState<string | null>(null);
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (v.name.trim().length < 2) next.name = "Please tell us your name.";
    if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+|^@?[\w.]{2,}$/.test(v.link.trim())) next.link = "Add a website address or an Instagram handle we can open.";
    if (!v.goal) next.goal = "Pick the closest goal.";
    setErr(next);
    if (Object.keys(next).length) return;
    const text = [
      "Hi AHOS, I'd like the free website check.",
      `Name: ${v.name.trim()}`,
      `Website or Instagram: ${v.link.trim()}`,
      `Main goal: ${v.goal}`,
      v.phone.trim() ? `My WhatsApp: ${v.phone.trim()}` : "",
    ].filter(Boolean).join("\n");
    const href = `https://wa.me/${site.contact.phoneE164.replace("+", "")}?text=${encodeURIComponent(text)}`;
    trackEvent("free_check_submit", { where, goal: v.goal });
    setUrl(href);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="check" className="sec check" aria-labelledby="check-title">
      <div className="wrap check-in">
        <div className="check-copy">
          <Kicker>Free, no strings</Kicker>
          <h2 id="check-title" className="d d-5">Free website check.</h2>
          <p className="lead">Send us your website or Instagram link and we'll tell you the 3 things costing you customers.</p>
          <ul className="check-list">
            <li>A real person looks at it, not a report generator.</li>
            <li>The reply comes on WhatsApp, usually within {site.contact.replyWithin}.</li>
            <li>No email form and no account. Your message goes straight to us.</li>
          </ul>
        </div>
        <form className="check-form" onSubmit={submit} noValidate>
          <Field id="fc-name" label="Your name" placeholder="Jane Doe" autoComplete="name" value={v.name} onChange={set("name")} error={err.name} />
          <Field id="fc-link" label="Website or Instagram link" placeholder="https://yourbusiness.com or @yourbusiness" autoComplete="url" value={v.link} onChange={set("link")} error={err.link} />
          <Field id="fc-phone" label="WhatsApp number (optional)" placeholder="+961 …" type="tel" autoComplete="tel" value={v.phone} onChange={set("phone")} hint="Only if you want us to reply on a different number." />
          <Field id="fc-goal" label="Main goal" options={GOALS} value={v.goal} onChange={set("goal")} error={err.goal} />
          <button className="btn btn-lg" type="submit" data-magnetic="">Send it on WhatsApp <Arrow /></button>
          {url && <p className="check-done" role="status">WhatsApp should have opened with your message ready to send. If it did not, <a className="lnk" href={url} target="_blank" rel="noopener noreferrer">open it here</a>.</p>}
        </form>
      </div>
    </section>
  );
}

/* ---------- after the stories ---------- */

export function WorkMore() {
  const rest = projects.filter((p) => !p.flagship && ["aria", "tavern"].includes(p.id));
  return (
    <div className="wrap more-work">
      <p className="more-work-also">
        Also built:{" "}
        {rest.map((p) => <span key={p.id}><Link className="lnk" href={p.caseStudy}>{p.name}</Link>, </span>)}
        {alsoBuilt.map((a, i) => <span key={a.name}>{i > 0 && ", "}<a className="lnk" href={a.href} target="_blank" rel="noopener noreferrer">{a.name}</a></span>)}
        , and more our clients keep private.
      </p>
      <Link href="/work" className="btn btn-ghost" data-magnetic="">See all work</Link>
    </div>
  );
}
