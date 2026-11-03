import { useEffect, useRef, useState, type ReactNode } from "react";
import { Arrow } from "./Arrow";
import { Link } from "wouter";
import { SERVICES } from "../data/services";
import "./footer.css";

const STUDIO = [
  ["Home", "/"], ["Services", "/services"], ["Pricing", "/pricing"], ["FAQ", "/faq"], ["Careers", "/careers"], ["Contact", "/contact"],
];
const CONNECT = [
  ["WhatsApp", "https://wa.me/96170165601"], ["Email", "mailto:info@ahos.xyz"], ["Instagram", "https://www.instagram.com/ahos.xyz/"],
  ["LinkedIn", "https://www.linkedin.com/company/ahos-xyz"], ["YouTube", "https://www.youtube.com/@ahos_xyz"],
];

function FLink({ href, children }: { href: string; children: ReactNode }) {
  const external = /^(https?:|mailto:)/.test(href);
  return external
    ? <a className="ft-link" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{children}</a>
    : <Link className="ft-link" href={href}>{children}</Link>;
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [time, setTime] = useState("");
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Beirut" }).format(d));
      const h = +new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Beirut" }).format(d);
      setOnline(h >= 9 && h < 21);
    };
    tick(); const id = setInterval(tick, 20000);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15 });
    if (ref.current) io.observe(ref.current);
    return () => { clearInterval(id); io.disconnect(); };
  }, []);

  return (
    <footer className={`ft tone-ink${inView ? " is-in" : ""}`} data-tone="ink" ref={ref}>
      {/* the signal line from the film, running out across the page */}
      <svg className="ft-signal" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="ftg" x1="0" x2="1"><stop offset="0" stopColor="#ff6a1a" stopOpacity="0" /><stop offset=".18" stopColor="#ff6a1a" /><stop offset=".82" stopColor="#ff8a4a" /><stop offset="1" stopColor="#ff6a1a" stopOpacity="0" /></linearGradient>
        </defs>
        <path id="ftp" className="ft-signal-path" d="M0 92 C 220 92, 300 30, 520 34 S 820 104, 1000 80 S 1290 22, 1440 40" fill="none" stroke="url(#ftg)" strokeWidth="1.6" pathLength={1} />
        <circle r="3.2" className="ft-signal-dot">
          <animateMotion dur="7s" repeatCount="indefinite" rotate="auto"><mpath href="#ftp" /></animateMotion>
        </circle>
      </svg>

      <div className="ft-wrap">
        <div className="ft-grid">
          <div className="ft-brand">
            <p className="ft-pitch">A digital product studio in Beirut. We design and build websites, apps and software for founders in Lebanon, the Gulf, Europe and the US.</p>
            <p className="ft-status"><i className={online ? "is-on" : ""} aria-hidden="true" />{time ? `${time} in Beirut` : "Beirut"}, {online ? "we’re at our desks" : "we reply in the morning"}</p>
            <Link href="/contact" className="btn ft-cta">Start a project <Arrow /></Link>
          </div>
          <nav className="ft-col" aria-label="Studio">
            <p className="ft-head">Studio</p>
            {STUDIO.map(([l, h]) => <FLink key={h} href={h}>{l}</FLink>)}
          </nav>
          <nav className="ft-col" aria-label="Services">
            <p className="ft-head">Services</p>
            {SERVICES.map((s) => <FLink key={s.href} href={s.href}>{s.label}</FLink>)}
          </nav>
          <nav className="ft-col" aria-label="Connect">
            <p className="ft-head">Connect</p>
            {CONNECT.map(([l, h]) => <FLink key={h} href={h}>{l}</FLink>)}
          </nav>
        </div>
      </div>

      <div className="ft-mark" aria-hidden="true">AHOS</div>

      <div className="ft-wrap ft-base">
        <span>© {new Date().getFullYear()} AHOS, Advanced Hybrid Online Systems</span>
        <span>Designed and built in Beirut</span>
        <button className="ft-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top</button>
      </div>
    </footer>
  );
}
