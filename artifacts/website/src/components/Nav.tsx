import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Arrow } from "./Arrow";
import { Logo } from "./Mark";
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

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
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
          <nav className="nav-links" aria-label="Main">
            {nav.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(location, l.match) ? "page" : undefined}>{l.label}</Link>
            ))}
          </nav>
          <div className="nav-end">
            <ThemeToggle />
            <Link href="/contact" className="btn btn-sm nav-cta" onClick={() => trackEvent("cta_click", { where: "nav" })}>Start a project</Link>
            <button className="nav-menu" aria-expanded={open} aria-controls="menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
              <span />
            </button>
          </div>
        </div>
      </header>
      <div id="menu" ref={sheetRef} className={`sheet${open ? " is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {[{ href: "/", label: "Home" }, ...nav, { href: "/careers", label: "Careers" }, { href: "/contact", label: "Contact" }].map((l) => (
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
