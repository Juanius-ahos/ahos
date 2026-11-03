import { useEffect, useRef, useState } from "react";
import { Arrow } from "./Arrow";
import { Link, useLocation } from "wouter";
import { SERVICES } from "../data/services";
import "./nav.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

const serviceHrefs = new Set(SERVICES.map((s) => s.href));
const isServicesActive = (loc: string) => loc === "/services" || serviceHrefs.has(loc);

const socials = [
  { href: "https://www.instagram.com/ahos.xyz/", label: "Instagram" },
  { href: "https://www.linkedin.com/company/ahos-xyz", label: "LinkedIn" },
  { href: "https://www.youtube.com/@ahos_xyz", label: "YouTube" },
];

const WA = "https://wa.me/96170165601";

function useBeirutTime() {
  const fmt = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Beirut" }).format(new Date());
  const hour = () => +new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Beirut" }).format(new Date());
  const [t, setT] = useState(fmt);
  const [h, setH] = useState(hour);
  useEffect(() => { const id = setInterval(() => { setT(fmt()); setH(hour()); }, 20000); return () => clearInterval(id); }, []);
  return { time: t, online: h >= 9 && h < 21 };
}

export function Nav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { time, online } = useBeirutTime();
  const sheetRef = useRef<HTMLDivElement>(null);

  // condense once the page moves; tuck away while reading down, return on the way up
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) { setHidden(y > lastY && y > 320); lastY = y; }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setHidden(false); }, [location]);

  // mobile sheet: lock scroll, trap focus, close on Escape
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab" || !open || !sheetRef.current) return;
      const f = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a, button"));
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <header className={`nv tone-ink${scrolled ? " is-scrolled" : ""}${hidden && !open ? " is-hidden" : ""}${open ? " is-open" : ""}`}>
        <div className="nv-bar">
          <Link href="/" className="nv-logo" aria-label="AHOS home">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AHOS" width={90} height={30} />
          </Link>

          <nav className="nv-links" aria-label="Main" >
            {links.map((l) => {
              const active = l.href === "/services" ? isServicesActive(location) : location === l.href;
              if (l.href !== "/services") {
                return (
                  <Link key={l.href} href={l.href} className={`nv-link${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
                    {l.label}
                  </Link>
                );
              }
              return (
                <div key={l.href} className="nv-dd">
                  <Link href={l.href} className={`nv-link${active ? " is-active" : ""}`} aria-haspopup="true" aria-current={location === l.href ? "page" : undefined}>
                    {l.label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                  </Link>
                  <div className="nv-panel" role="menu">
                    <div className="nv-panel-grid">
                      {SERVICES.map((s) => (
                        <Link key={s.href} href={s.href} role="menuitem" className={`nv-panel-item${location === s.href ? " is-active" : ""}`}>
                          <span className="nv-panel-name">{s.label}</span>
                          <span className="nv-panel-blurb">{s.blurb}</span>
                        </Link>
                      ))}
                    </div>
                    <Link href="/services" className="nv-panel-all">All services <Arrow dir="e" /></Link>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="nv-right">
            <span className="nv-status" title="Studio time in Beirut">
              <i className={online ? "is-on" : ""} aria-hidden="true" />
              Beirut {time}
            </span>
            <a href={WA} className="nv-wa" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp AHOS">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <Link href="/contact" className="btn nv-cta">
              <span className="nv-cta-label">Start a project</span>
              <Arrow />
            </Link>
            <button className={`nv-burger${open ? " is-open" : ""}`} onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <div ref={sheetRef} className={`nv-sheet${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open} aria-label="Menu">
        <div className="nv-sheet-inner">
          <nav className="nv-sheet-links" aria-label="Menu">
            {links.map((l, i) => (
              <Link key={l.href} href={l.href} className={`nv-sheet-link${location === l.href ? " is-active" : ""}`} style={{ transitionDelay: open ? `${0.06 + i * 0.05}s` : "0s" }} tabIndex={open ? 0 : -1}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nv-sheet-services" style={{ transitionDelay: open ? "0.34s" : "0s" }}>
            {SERVICES.map((s) => <Link key={s.href} href={s.href} tabIndex={open ? 0 : -1}>{s.label}</Link>)}
          </div>
          <div className="nv-sheet-foot" style={{ transitionDelay: open ? "0.4s" : "0s" }}>
            <Link href="/contact" className="btn" tabIndex={open ? 0 : -1}>Start a project <Arrow /></Link>
            <a href={WA} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>WhatsApp +961 70 165 601</a>
            <a href="mailto:info@ahos.xyz" tabIndex={open ? 0 : -1}>info@ahos.xyz</a>
            <div className="nv-sheet-socials">
              {socials.map((s) => <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>{s.label}</a>)}
            </div>
            <span className="nv-status"><i className={online ? "is-on" : ""} aria-hidden="true" />{time} in Beirut, {online ? "we’re at our desks" : "we reply in the morning"}</span>
          </div>
        </div>
      </div>
    </>
  );
}
