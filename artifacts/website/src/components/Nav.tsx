import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Arrow } from "./Arrow";
import { asset, nav, services, site } from "../site.config";
import { trackEvent } from "../lib/analytics";

const serviceHrefs = new Set(services.map((s) => s.href));
const isActive = (loc: string, match: string) =>
  match === "/services" ? loc === "/services" || serviceHrefs.has(loc) : loc.startsWith(match);

export function Nav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 8) { setHidden(y > last && y > 400); last = y; }
    };
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
      <header className={`nav${hidden && !open ? " is-hidden" : ""}${open ? " is-open" : ""}`}>
        <div className="wrap nav-in">
          <Link href="/" className="nav-logo" aria-label={`${site.name} home`}>
            <img src={asset(site.logo)} alt={site.name} width={76} height={25} />
          </Link>
          <nav className="nav-links" aria-label="Main">
            {nav.map((l) => (
              l.href.includes("#")
                ? <a key={l.href} href={asset(l.href)}>{l.label}</a>
                : <Link key={l.href} href={l.href} aria-current={isActive(location, l.match) ? "page" : undefined}>{l.label}</Link>
            ))}
          </nav>
          <Link href="/contact" className="btn nav-cta" onClick={() => trackEvent("cta_click", { where: "nav" })}>Start a project <Arrow /></Link>
          <button className="nav-menu" aria-expanded={open} aria-controls="menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <span />
          </button>
        </div>
      </header>
      <div id="menu" ref={sheetRef} className={`sheet${open ? " is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {[{ href: "/", label: "Home" }, ...nav, { href: "/contact", label: "Contact" }].map((l) => (
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
