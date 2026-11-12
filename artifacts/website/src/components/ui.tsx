import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { Arrow } from "./Arrow";
import { asset, site, money, type Project, type QA } from "../site.config";
import { trackEvent } from "../lib/analytics";

/* ---------- proof row ---------- */

export function Proof({ className = "" }: { className?: string }) {
  return (
    <ul className={`proof ${className}`}>
      {site.proof.map((p) => {
        const decimals = "decimals" in p ? p.decimals : 0;
        const suffix = "suffix" in p ? p.suffix : "";
        const inner = (
          <>
            <b>{p.value.toFixed(decimals)}{suffix}</b>
            <span>{p.label}</span>
          </>
        );
        return (
          <li key={p.label}>
            {"href" in p && p.href ? <a href={p.href} target="_blank" rel="noopener noreferrer">{inner}</a> : inner}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- screenshots ---------- */

/** Desktop capture of a live project in a quiet browser frame. */
export function Shot({ p, eager = false, sizes = "(max-width: 900px) 92vw, 64vw" }: { p: Project; eager?: boolean; sizes?: string }) {
  if (!p.shot) return <AriaVisual />;
  return (
    <div className="shot">
      <div className="shot-bar" aria-hidden="true"><i /><i /><i /><span>{p.liveLabel}</span></div>
      <img
        src={asset(`/work/d-${p.shot}-880.webp`)}
        srcSet={`${asset(`/work/d-${p.shot}-880.webp`)} 880w, ${asset(`/work/d-${p.shot}.webp`)} 1440w`}
        sizes={sizes}
        width={1440}
        height={900}
        alt={`${p.name}, ${p.what.toLowerCase()} designed and built by AHOS`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}

/** Phone capture of a live project. */
export function Phone({ p, eager = false }: { p: Project; eager?: boolean }) {
  if (!p.shot) return null;
  return (
    <div className="phone">
      <img src={asset(`/work/m-${p.shot}.webp`)} width={390} height={844} alt={`${p.name} on a phone`} loading={eager ? "eager" : "lazy"} decoding="async" />
    </div>
  );
}

/** ARIA has no external site, so it gets a drawn conversation instead of a screenshot. */
export function AriaVisual() {
  return (
    <div className="aria-vis" role="img" aria-label="A conversation with ARIA, the AI project advisor AHOS built">
      <div className="aria-vis-top" aria-hidden="true"><b>ARIA</b><span>Project advisor</span></div>
      <div className="aria-vis-msgs" aria-hidden="true">
        <p className="a">Hi, I'm ARIA. What are you building?</p>
        <p className="u">An online store for my clothing brand in Beirut.</p>
        <p className="a">Nice. Will most people pay by card, or cash on delivery?</p>
        <p className="u">Mostly cash on delivery, and WhatsApp orders.</p>
        <p className="a">Then a custom store with COD and WhatsApp ordering fits. Usually 2 to 6 weeks. Want me to sketch a first screen?</p>
      </div>
    </div>
  );
}

/* ---------- facts list ---------- */

export function Specs({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="specs">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

/* ---------- labelled placeholder (no generated imagery) ---------- */

export function Placeholder({ label, ratio }: { label: string; ratio?: string }) {
  return (
    <div className="ph-box" role="img" aria-label={label} style={ratio ? { aspectRatio: ratio } : undefined}>
      <span>{label}</span>
    </div>
  );
}

/* ---------- breadcrumbs ---------- */

export function Crumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs">
        {items.map((c, i) => (
          <li key={c.name}>{c.href && i < items.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- page header ---------- */

export function PageHeader({ crumbs, title, lead, children, aside, proof = false }: { crumbs: { name: string; href?: string }[]; title: ReactNode; lead?: ReactNode; children?: ReactNode; aside?: ReactNode; proof?: boolean }) {
  return (
    <header className="ph">
      <div className={`wrap ph-in${aside ? "" : " solo"}`}>
        <div className="ph-main">
          <Crumbs items={crumbs} />
          <h1 className="d d-6" data-split>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children && <div className="acts">{children}</div>}
          {proof && <Proof />}
        </div>
        {aside && <div className="ph-aside">{aside}</div>}
      </div>
    </header>
  );
}

/* ---------- section head ---------- */

export function Head({ id, title, lead, as = "h2" }: { id?: string; title: ReactNode; lead?: ReactNode; as?: "h1" | "h2" }) {
  const T = as;
  return (
    <header className="head">
      <T id={id} className="d d-5">{title}</T>
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}

/* ---------- FAQ ---------- */

export function FaqList({ items, openFirst = false }: { items: QA[]; openFirst?: boolean }) {
  return (
    <div className="qa">
      {items.map((f, i) => (
        <details key={f.q} open={openFirst && i === 0}>
          <summary>{f.q}<i aria-hidden="true" /></summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ---------- quote ---------- */

export function Quote({ text, name, role, link }: { text: string; name: string; role: string; link?: string }) {
  return (
    <section className="sec quote" aria-label="What a client says">
      <figure className="wrap">
        <blockquote>{text}</blockquote>
        <figcaption>
          <span><b>{name}</b>, {role}</span>
          {link && <a className="lnk" href={link} target="_blank" rel="noopener noreferrer">Read it on Trustpilot</a>}
        </figcaption>
      </figure>
    </section>
  );
}

/* ---------- Beirut clock (client only, so the server markup never disagrees) ---------- */

export function useBeirut() {
  const [s, set] = useState<{ time: string; atDesk: boolean } | null>(null);
  useEffect(() => {
    const read = () => {
      const d = new Date();
      const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.contact.timeZone }).format(d);
      const h = +new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: site.contact.timeZone }).format(d);
      set({ time, atDesk: h >= site.contact.deskHours[0] && h < site.contact.deskHours[1] });
    };
    read();
    const id = setInterval(read, 20000);
    return () => clearInterval(id);
  }, []);
  return s;
}

/* ---------- closing CTA ---------- */

export function Close({ title = "Tell us what you're building.", where }: { title?: string; where: string }) {
  const clock = useBeirut();
  return (
    <section className="sec close" aria-labelledby="close-title">
      <div className="wrap">
        <h2 id="close-title" className="d d-6">{title}</h2>
        <p className="lead">
          A real person replies within {site.contact.replyWithin} with a plan and a fixed quote.
          {clock && <> It is <span className="clock">{clock.time}</span> in Beirut, {clock.atDesk ? "and we are at our desks." : "so expect us first thing in the morning."}</>}
        </p>
        <div className="acts">
          <a href={site.contact.whatsappHello} className="btn btn-wa btn-lg" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { where })}><WhatsAppIcon /> Message us on WhatsApp</a>
        </div>
        <ul className="ways">
          <li><Link href="/contact" onClick={() => trackEvent("cta_click", { where: `${where}_call` })}><span className="way-t">Book a 30-minute call</span><span className="how">Free, no obligation</span><Arrow size={22} /></Link></li>
          <li><a href={`mailto:${site.contact.email}`} onClick={() => trackEvent("email_click", { where })}><span className="way-t">Write to us</span><span className="how">{site.contact.email}</span><Arrow size={22} /></a></li>
        </ul>
      </div>
    </section>
  );
}

export const fromPrice = (n: number) => `From ${money(n)}`;

/** The WhatsApp glyph, drawn simply so it inherits the button colour. */
export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "none" }}>
      <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}
