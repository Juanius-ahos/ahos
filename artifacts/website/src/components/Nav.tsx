import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Arrow } from "./Arrow";
import { Logo } from "./Mark";
import { WhatsAppIcon } from "./ui";
import { asset, nav, services, site } from "../site.config";
import { trackEvent } from "../lib/analytics";

const serviceHrefs = new Set(services.map((s) => s.href));
const isActive = (loc: string, match: string) =>
  match === "/services" ? loc === "/services" || serviceHrefs.has(loc) : loc.startsWith(match);

/** Light and dark. The choice is stored per visitor; the inline script in index.html applies it before paint. */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("ahos-theme", next); } catch { /* private mode */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#e7e8ea" : site.themeColor);
    trackEvent("theme_toggle", { theme: next });
  };
  return (
    <button type="button" className="theme" onClick={toggle} aria-label="Switch between light and dark">
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}

export function Nav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [hoverBox, setHoverBox] = useState<{ x: number; w: number } | null>(null);
  const [restBox, setRestBox] = useState<{ x: number; w: number } | null>(null);

  // On the homepage, the link of the section that is on screen right now.
  useEffect(() => {
    if (location !== "/") { setReading(null); return; }
    const els = nav.filter((l) => l.href.startsWith("/#")).map((l) => document.getElementById(l.href.slice(2))).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { const id = `/#${e.target.id}`; setReading((r) => (e.isIntersecting ? id : r === id ? null : r)); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [location]);

  // Where the sliding pill rests: under this page's link, or under the section being read.
  useEffect(() => {
    const measure = () => {
      const root = linksRef.current;
      const a = root?.querySelector<HTMLElement>('a[aria-current="page"]') ?? (reading ? root?.querySelector<HTMLElement>(`a[data-nav="${reading}"]`) : null);
      setRestBox(a ? { x: a.offsetLeft, w: a.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [location, reading]);

  const hoverTo = (e: { target: EventTarget | null }) => {
    const a = (e.target as HTMLElement | null)?.closest("a");
    setHoverBox(a ? { x: a.offsetLeft, w: a.offsetWidth } : null);
  };
  const box = hoverBox ?? restBox;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--sp", String(max > 0 ? Math.min(1, y / max) : 0));
      if (Math.abs(y - last) > 8) { setHidden(y > last && y > 500); last = y; }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setHidden(false); }, [location]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    sheetRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`nav${hidden && !open ? " is-hidden" : ""}${open ? " is-open" : ""}${scrolled ? " is-scrolled" : ""}`}>
        <div className="wrap nav-in">
          <Link href="/" className="nav-logo" aria-label={`${site.name} home`}>
            <Logo title={site.name} />
          </Link>
          <nav
            ref={linksRef}
            className="nav-links"
            aria-label="Main"
            onPointerOver={(e) => { if (e.pointerType !== "touch") hoverTo(e); }}
            onFocus={hoverTo}
            onPointerLeave={() => setHoverBox(null)}
            onBlur={() => setHoverBox(null)}
          >
            <span className="nav-pill" aria-hidden="true" style={box ? { transform: `translateX(${box.x}px)`, width: box.w, opacity: 1 } : undefined} />
            {nav.map((l) => (
              l.href.includes("#")
                ? <a key={l.href} href={asset(l.href)} data-nav={l.href}>{l.label}</a>
                : <Link key={l.href} href={l.href} aria-current={isActive(location, l.match) ? "page" : undefined}>{l.label}</Link>
            ))}
          </nav>
          <div className="nav-end">
            <ThemeToggle />
            <a href={site.contact.whatsappHello} className="btn btn-sm btn-wa nav-cta" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { where: "nav" })}><WhatsAppIcon size={18} /> WhatsApp us</a>
            <button className="nav-menu" aria-expanded={open} aria-controls="menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
              <span />
            </button>
          </div>
        </div>
      </header>
      {/* phones: WhatsApp is always one thumb away */}
      <a href={site.contact.whatsappHello} className="wa-bar" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { where: "mobile_bar" })}>
        <WhatsAppIcon size={22} /> Message us on WhatsApp
      </a>
      <div id="menu" ref={sheetRef} className={`sheet${open ? " is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {[{ href: "/", label: "Home" }, ...nav, { href: "/pricing", label: "Pricing" }, { href: "/aria-ai", label: "ARIA" }, { href: "/careers", label: "Careers" }, { href: "/contact", label: "Contact" }].map((l) => (
            <a key={l.href} href={asset(l.href)} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>{l.label}<Arrow size={20} /></a>
          ))}
        </nav>
        <div className="sheet-foot">
          <a href={site.contact.whatsapp} tabIndex={open ? 0 : -1} target="_blank" rel="noopener noreferrer">WhatsApp {site.contact.phone}</a>
          <a href={`mailto:${site.contact.email}`} tabIndex={open ? 0 : -1}>{site.contact.email}</a>
        </div>
      </div>
    </>
  );
}
