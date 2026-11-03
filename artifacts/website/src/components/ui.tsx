import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { Arrow } from "./Arrow";
import { drawingPaths, W, H } from "./drawings";
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
            <b data-count={p.value} data-decimals={decimals} data-suffix={suffix}>{p.value.toFixed(decimals)}{suffix}</b>
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

/* ---------- browser frame with a real screenshot ---------- */

export function Frame({ p, eager = false, sizes = "(max-width: 900px) 90vw, 60vw", draw = false }: { p: Project; eager?: boolean; sizes?: string; draw?: boolean }) {
  const d = draw ? drawingPaths(p.id) : null;
  return (
    <div className="frame" data-sweep={draw ? "" : undefined}>
      <div className="frame-bar" aria-hidden="true"><i /><i /><i /><span>{p.liveLabel}</span></div>
      <div className="frame-view">
        <img
          src={asset(`/work/${p.shot}-640.webp`)}
          srcSet={[480, 640, 960].map((w) => `${asset(`/work/${p.shot}-${w}.webp`)} ${w}w`).concat(`${asset(`/work/${p.shot}.webp`)} 1440w`).join(", ")}
          sizes={sizes}
          width={1440}
          height={900}
          alt={`${p.name} home page, designed and built by AHOS`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
        {d && (
          <>
            <div className="draw-veil" />
            <svg className="draw" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
              <path className="dl" d={d.light} />
              <path className="dh" d={d.heavy} />
              {d.notes.map((n, i) => (
                <g className="dn" key={i}>
                  <path d={n.path} />
                  <circle cx={n.dot[0]} cy={n.dot[1]} r="6" />
                  <text x={n.label[0]} y={n.label[1]} textAnchor={n.anchor}>{n.text}</text>
                </g>
              ))}
            </svg>
            <div className="build-line" />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- drafting title block (facts box) ---------- */

export function TitleBlock({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="tblock">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

/* ---------- labelled gray placeholder (no generated imagery) ---------- */

export function Placeholder({ label, ratio }: { label: string; ratio?: string }) {
  return (
    <div className="ph-box" role="img" aria-label={`Placeholder: ${label}`} style={ratio ? { aspectRatio: ratio } : undefined}>
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
        <div>
          <Crumbs items={crumbs} />
          <h1 className={`d ${typeof title === "string" && title.length > 30 ? "d-6" : "d-7"}`}>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children && <div className="acts">{children}</div>}
          {proof && <Proof />}
        </div>
        {aside && <div data-reveal>{aside}</div>}
      </div>
    </header>
  );
}

/* ---------- section head ---------- */

export function Head({ id, title, lead, as = "h2" }: { id?: string; title: ReactNode; lead?: ReactNode; as?: "h1" | "h2" }) {
  const T = as;
  return (
    <header className="head">
      <T id={id} className="d d-6">{title}</T>
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
    <section className="sec quote tone-ink" aria-label="What a client says">
      <figure className="wrap">
        <blockquote data-reveal>{text}</blockquote>
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
    <section className="sec close tone-signal" aria-labelledby="close-title">
      <div className="wrap">
        <h2 id="close-title" className="d d-7" data-reveal>{title}</h2>
        <p className="lead">
          A real person replies within {site.contact.replyWithin} with a plan and a fixed quote.
          {clock && <> It is {clock.time} in Beirut, {clock.atDesk ? "and we are at our desks." : "so expect us first thing in the morning."}</>}
        </p>
        <ul className="ways">
          <li><Link href="/contact" onClick={() => trackEvent("cta_click", { where: `${where}_call` })}><span className="d">Book a 30-minute call</span><span className="how">Free, no obligation</span><Arrow size={24} /></Link></li>
          <li><a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { where })}><span className="d">WhatsApp us</span><span className="how">{site.contact.phone}</span><Arrow size={24} /></a></li>
          <li><a href={`mailto:${site.contact.email}`} onClick={() => trackEvent("email_click", { where })}><span className="d">Write to us</span><span className="how">{site.contact.email}</span><Arrow size={24} /></a></li>
        </ul>
      </div>
    </section>
  );
}

export const fromPrice = (n: number) => `From ${money(n)}`;
