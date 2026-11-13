import { useEffect, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Link } from "wouter";
import { Arrow } from "./Arrow";
import { Shot, WhatsAppIcon } from "./ui";
import { BASE, asset, money, projects, site, type CaseStudy, type Project, type Service } from "../site.config";
import { trackEvent } from "../lib/analytics";

/**
 * The AHOS component kit. Small on purpose: each piece does one job and takes
 * its colours, type and spacing from the tokens in styles/app.css.
 * Preview it at /kit while running `pnpm dev`.
 */

/* ---------- Button ---------- */

type ButtonProps = {
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  magnetic?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({ variant = "primary", size = "md", href, external, type = "button", onClick, magnetic = true, disabled, className = "", children }: ButtonProps) {
  const cls = ["btn", variant === "outline" && "btn-ghost", size === "lg" && "btn-lg", size === "sm" && "btn-sm", className].filter(Boolean).join(" ");
  const inner = <>{children}{variant === "primary" && <Arrow />}</>;
  const mag = magnetic ? { "data-magnetic": "" } : {};
  if (href && (external || href.startsWith("#") || href.startsWith("mailto:"))) {
    return <a className={cls} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={onClick} {...mag}>{inner}</a>;
  }
  if (href) return <Link className={cls} href={href} onClick={onClick} {...mag}>{inner}</Link>;
  return <button className={cls} type={type} onClick={onClick} disabled={disabled} {...mag}>{inner}</button>;
}

/** The WhatsApp button: one tap into a ready-written first message. */
export function WhatsAppCta({ where, size = "md", children = "Message us on WhatsApp" }: { where: string; size?: "md" | "lg"; children?: ReactNode }) {
  return (
    <a href={site.contact.whatsappHello} className={`btn btn-wa${size === "lg" ? " btn-lg" : ""}`} target="_blank" rel="noopener noreferrer" data-magnetic="" onClick={() => trackEvent("whatsapp_click", { where })}>
      <WhatsAppIcon /> {children}
    </a>
  );
}

/* ---------- Labels and headers ---------- */

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`kicker ${className}`}>{children}</span>;
}

export function SectionHeader({ id, kicker, title, lead, as: T = "h2", split = true }: { id?: string; kicker?: ReactNode; title: ReactNode; lead?: ReactNode; as?: "h1" | "h2"; split?: boolean }) {
  return (
    <header className={`sh${split && lead ? " sh-split" : ""}`}>
      <div>
        {kicker && <Kicker>{kicker}</Kicker>}
        <T id={id} className="d d-5">{title}</T>
      </div>
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}

/* ---------- Stat and proof bar ---------- */

export function Stat({ value, label, href }: { value: ReactNode; label: ReactNode; href?: string }) {
  const inner = <><b className="stat-v">{value}</b><span className="stat-l">{label}</span></>;
  return href ? <a className="stat" href={href} target="_blank" rel="noopener noreferrer">{inner}</a> : <div className="stat">{inner}</div>;
}

export function ProofBar() {
  return (
    <ul className="proofbar" aria-label="Why trust AHOS">
      {site.proof.map((p) => (
        <li key={p.label}><Stat value={p.value} label={p.label} href={"href" in p ? p.href : undefined} /></li>
      ))}
    </ul>
  );
}

/* ---------- Cards ---------- */

export function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="svc">
      <header>
        <h3 className="svc-n">{s.label}</h3>
        <p className="svc-p">{s.blurb}</p>
      </header>
      <dl className="svc-f">
        <div><dt>From</dt><dd>{money(s.from)}</dd></div>
        <div><dt>Timeline</dt><dd>{s.timeline}</dd></div>
      </dl>
      <div className="svc-i">
        <Kicker>What's included</Kicker>
        <ul>{s.offers.map((o) => <li key={o.name}>{o.name}</li>)}</ul>
      </div>
      <Link href={s.href} className="lnk">See {s.short.toLowerCase()} <Arrow /></Link>
    </article>
  );
}

export function CaseCard({ p }: { p: Project }) {
  return (
    <Link href={p.caseStudy} className="cc">
      <div className="cc-m"><Shot p={p} /></div>
      <div className="cc-t">
        <h3 className="cc-n">{p.name}</h3>
        <p className="cc-w">{p.what}, {p.where}</p>
      </div>
    </Link>
  );
}

export function Testimonial({ text, name, role, link }: { text: string; name: string; role: string; link?: string }) {
  return (
    <figure className="tst">
      <blockquote>{text}</blockquote>
      <figcaption>
        <span><b>{name}</b>, {role}</span>
        {link && <a className="lnk" href={link} target="_blank" rel="noopener noreferrer">Read it on Trustpilot</a>}
      </figcaption>
    </figure>
  );
}

/* ---------- Form field ---------- */

type FieldProps = { id: string; label: string; hint?: string; error?: string; textarea?: boolean; options?: string[] } & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export function Field({ id, label, hint, error, textarea, options, ...rest }: FieldProps) {
  const describedBy = error ? `${id}-e` : hint ? `${id}-h` : undefined;
  const common = { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy };
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {options ? (
        <select {...common} defaultValue="">
          <option value="" disabled>Choose one</option>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : textarea ? (
        <textarea {...common} rows={4} />
      ) : (
        <input {...common} {...rest} />
      )}
      {error ? <p className="field-e" id={`${id}-e`}>{error}</p> : hint ? <p className="field-h" id={`${id}-h`}>{hint}</p> : null}
    </div>
  );
}

/* ---------- Placeholder for what only the owner can supply ---------- */

const SHOW_NEED = import.meta.env.DEV || BASE !== "";

/** Marks content that only JeanPaul can supply. Shown in dev and preview builds, never on the live site. */
export function Need({ children }: { children: ReactNode }) {
  if (!SHOW_NEED) return null;
  return <span className="need" data-need="">[NEED FROM JEANPAUL: {children}]</span>;
}

/* ---------- Devices ---------- */

/** The order the projects cycle in. */
const SCENE_ORDER = ["threads", "tavern", "speealigner", "issam", "julsauto"];
/** Seconds each project stays on screen. */
const HOLD = 4;

/**
 * A laptop and a phone showing real captures of client sites, crossfading
 * in pure CSS (no JavaScript, nothing to block). With reduced motion it holds
 * the first project. The 3D version replaces this later and falls back to it.
 */
export function DeviceScene({ ids = SCENE_ORDER, eager = false, className = "" }: { ids?: string[]; eager?: boolean; className?: string }) {
  const list = ids.map((id) => projects.find((p) => p.id === id)).filter((p): p is Project => !!p && !!p.shot);
  const n = list.length;
  const canCycle = n === 5;

  // Only the first project is in the page at load. The other four, and the crossfade,
  // start once the page has finished loading and the browser is idle, so they never
  // compete with the first paint. Reduced motion keeps the first project.
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (!canCycle || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const start = () => { timer = window.setTimeout(() => setLive(true), 1200); };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("load", start); };
  }, [canCycle]);

  const cycle = canCycle && live;
  const shown = cycle ? list : list.slice(0, 1);
  const timing = (i: number) => (cycle ? { animationDelay: `${-(((n - i) % n) * HOLD)}s`, animationDuration: `${n * HOLD}s` } : undefined);
  const first = list[0];
  return (
    <div className={`scene ${className}`} role="img" aria-label={`${first ? first.name : "Client"} and other sites built by AHOS, shown on a laptop and a phone`}>
      <div className="scene-glow" aria-hidden="true" />
      <div className="laptop" aria-hidden="true">
        <div className="laptop-lid">
          <div className="laptop-screen">
            {shown.map((p, i) => (
              <img
                key={p.id}
                className={`scr${cycle ? " scr-fade" : ""}`}
                style={timing(i)}
                src={asset(`/work/h-${p.shot}-640.webp`)}
                srcSet={`${asset(`/work/h-${p.shot}-640.webp`)} 640w, ${asset(`/work/d-${p.shot}-880.webp`)} 880w`}
                sizes="(max-width: 860px) 86vw, 560px"
                width={640}
                height={400}
                alt=""
                loading={eager && i === 0 ? "eager" : "lazy"}
                {...(eager && i === 0 ? { fetchPriority: "high" as const } : {})}
                decoding="async"
              />
            ))}
          </div>
        </div>
        <div className="laptop-base" />
      </div>
      <div className="phone-d" aria-hidden="true">
        <div className="phone-d-screen">
          {shown.map((p, i) => (
            <img
              key={p.id}
              className={`scr${cycle ? " scr-fade" : ""}`}
              style={timing(i)}
              src={asset(`/work/p-${p.shot}-260.webp`)}
              width={260}
              height={562}
              alt=""
              loading={eager && i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </div>
        <i className="phone-d-island" />
      </div>
    </div>
  );
}

/* ---------- Case study story (homepage) ---------- */

export function CaseStory({ c, p, no, id }: { c: CaseStudy; p: Project; no: string; id?: string }) {
  const s = c.story;
  if (!s) return null;
  return (
    <section id={id} className="story grain" aria-labelledby={`story-${p.id}`}>
      <div className="wrap story-in">
        <div className="story-copy">
          <Kicker>Case study {no} <span aria-hidden="true">/</span> {p.where}</Kicker>
          <h2 id={`story-${p.id}`} className="d d-5 story-name">{p.name}</h2>
          <p className="story-problem">{s.problem}</p>

          <div className="story-b">
            <Kicker>What we built</Kicker>
            <ul>{s.built.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>

          <div className="story-r">
            <Kicker>The result</Kicker>
            <dl>{s.results.map((r) => <div key={r.l}><dt>{r.l}</dt><dd>{r.v}</dd></div>)}</dl>
            {s.note && <p className="story-note">{s.note}</p>}
            {s.need && <p><Need>{s.need}</Need></p>}
          </div>

          <div className="acts">
            <Button href={p.caseStudy} variant="outline">View case study</Button>
            <a className="lnk" href={p.live} target="_blank" rel="noopener noreferrer">{p.liveLabel} <Arrow /></a>
          </div>
        </div>
        <div className="story-vis"><DeviceScene ids={[p.id]} /></div>
      </div>
    </section>
  );
}
