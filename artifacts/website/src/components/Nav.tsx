import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { SERVICES } from "../data/services";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/web3", label: "Blockchain" },
  { href: "/careers", label: "Careers" },
  { href: "/faq", label: "FAQ" },
  { href: "/aria-ai", label: "ARIA AI" },
];

const serviceHrefs = new Set(SERVICES.map((s) => s.href));
const isServicesActive = (loc: string) => loc === "/services" || serviceHrefs.has(loc);

const socials = [
  { href: "https://www.instagram.com/ahos.xyz/", label: "Instagram" },
  { href: "https://www.linkedin.com/company/ahos-xyz", label: "LinkedIn" },
  { href: "https://www.youtube.com/@ahos_xyz", label: "YouTube" },
];

export function Nav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const sheetRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const prev = document.activeElement as HTMLElement | null;
    if (open && sheetRef.current) {
      const first = sheetRef.current.querySelector<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])");
      first?.focus();
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key === "Tab" && open && sheetRef.current) {
        const focusable = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (!open && prev && "focus" in prev) prev.focus();
    };
  }, [open]);

  return (
    <>
      <style>{css}</style>

      <nav className={`nv ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nv-bar">
          <Link href="/" className="nv-logo" aria-label="AHOS home">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AHOS" />
            <span className="nv-dots" aria-hidden="true"><i /><i /><i /><i /></span>
          </Link>

          <div className="nv-links">
            {links.map((l) =>
              l.href === "/services" ? (
                <div key={l.href} className="nv-dd">
                  <Link
                    href={l.href}
                    className={`nv-link nv-dd-trigger ${isServicesActive(location) ? "is-active" : ""}`}
                    aria-current={location === l.href ? "page" : undefined}
                    aria-haspopup="true"
                  >
                    {l.label}
                    <svg className="nv-dd-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                  </Link>
                  <div className="nv-dd-menu" role="menu">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className={`nv-dd-item ${location === s.href ? "is-active" : ""}`}
                        role="menuitem"
                      >
                        <span className="nv-dd-item-name">{s.label}</span>
                        <span className="nv-dd-item-blurb">{s.blurb}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nv-link ${location === l.href ? "is-active" : ""}`}
                  aria-current={location === l.href ? "page" : undefined}
                >
                  {l.label}
                </Link>
              )
            )}
          </div>

          <div className="nv-right">
            <button className="nv-theme" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              {theme === "dark" ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <a href="https://wa.me/96170165601" className="nv-wa" target="_blank" rel="noopener noreferrer" aria-label="Message us on WhatsApp">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span className="nv-wa-txt">Message us</span>
            </a>
            <Link href="/contact" className="nv-cta">Start a project <span aria-hidden="true">↗</span></Link>
            <button
              ref={burgerRef}
              className={`nv-burger ${open ? "is-open" : ""}`}
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div ref={sheetRef} className={`nv-sheet ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <div className="nv-sheet-inner">
          <div className="nv-sheet-links">
            {links.map((l, i) => (
              <div key={l.href} className="nv-sheet-group">
                <Link
                  href={l.href}
                  className={`nv-sheet-link ${location === l.href ? "is-active" : ""}`}
                  style={{ transitionDelay: open ? `${0.08 + i * 0.05}s` : "0s" }}
                >
                  <span className="nv-sheet-n">0{i + 1}</span>
                  {l.label}
                </Link>
                {l.href === "/services" && (
                  <div className="nv-sheet-sub">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className={`nv-sheet-sublink ${location === s.href ? "is-active" : ""}`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="nv-sheet-foot">
            <Link href="/contact" className="nv-cta nv-cta-lg">Start a project <span aria-hidden="true">↗</span></Link>
            <div className="nv-sheet-extras">
              <button className="nv-sheet-theme" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> Light mode</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark mode</>
                )}
              </button>
              <div className="nv-sheet-socials">
                {socials.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                ))}
              </div>
            </div>
            <a className="nv-sheet-mail" href="mailto:info@ahos.xyz">info@ahos.xyz</a>
            <a className="nv-sheet-mail" href="https://wa.me/96170165601" target="_blank" rel="noopener noreferrer">WhatsApp +961 70 165 601</a>
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
/* ── Floating pill nav ── */
.nv {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 14px var(--gutter);
  pointer-events: none;
  transition: padding 0.4s cubic-bezier(0.25,0.1,0.25,1);
}
.nv.is-scrolled { padding-top: 10px; padding-bottom: 10px; }
.nv-bar {
  pointer-events: auto;
  width: min(var(--max-width), 100%); margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; gap: 18px;
  height: 60px; padding: 0 10px 0 22px;
  border-radius: 999px;
  background: rgba(10,10,11,0.62);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  border: 1px solid var(--border);
  box-shadow: 0 12px 44px rgba(0,0,0,0.34);
  transition: background 0.35s ease, box-shadow 0.35s ease, height 0.35s ease;
}
[data-theme="light"] .nv-bar { background: rgba(237,232,224,0.68); box-shadow: 0 12px 44px rgba(0,0,0,0.10); }
.nv.is-scrolled .nv-bar { height: 54px; background: rgba(10,10,11,0.82); box-shadow: 0 14px 48px rgba(0,0,0,0.5); }
[data-theme="light"] .nv.is-scrolled .nv-bar { background: rgba(237,232,224,0.9); }

/* Logo + animated dot cluster */
.nv-logo { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; }
.nv-logo img { height: 26px; width: auto; display: block; transition: transform 0.3s ease, filter 0.3s ease; filter: drop-shadow(0 0 12px rgba(255,106,26,0.15)); }
.nv-logo:hover img { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(255,106,26,0.35)); }
.nv-dots { display: flex; gap: 6px; padding-left: 1px; }
.nv-dots i { width: 5px; height: 5px; border-radius: 50%; background: var(--text-faint); animation: nv-dot 2.6s ease-in-out infinite; }
.nv-dots i:nth-child(2) { animation-delay: 0.32s; }
.nv-dots i:nth-child(3) { animation-delay: 0.64s; }
.nv-dots i:nth-child(4) { animation-delay: 0.96s; }
@keyframes nv-dot {
  0%, 65%, 100% { background: var(--text-faint); transform: scale(1); }
  18% { background: var(--orange); transform: scale(1.35); box-shadow: 0 0 8px var(--orange-glow); }
}

/* Links — uppercase, tracked, mono (weevolveit style) */
.nv-links { display: flex; align-items: center; gap: 2px; }
.nv-link {
  position: relative; padding: 8px 14px; border-radius: 999px;
  font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-dim); transition: color 0.25s ease;
}
.nv-link::after {
  content: ""; position: absolute; left: 14px; right: 14px; bottom: 4px; height: 1.5px;
  background: var(--orange); border-radius: 2px;
  transform: scaleX(0); transform-origin: left; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
}
.nv-link:hover { color: var(--text); }
.nv-link:hover::after { transform: scaleX(0.4); }
.nv-link.is-active { color: var(--text); }
.nv-link.is-active::after { transform: scaleX(1); }

/* Services dropdown */
.nv-dd { position: relative; }
.nv-dd-trigger { display: inline-flex; align-items: center; gap: 5px; }
.nv-dd-caret { opacity: 0.55; transition: transform 0.25s ease, opacity 0.2s ease; }
.nv-dd:hover .nv-dd-caret, .nv-dd:focus-within .nv-dd-caret { transform: rotate(180deg); opacity: 1; }
.nv-dd-menu {
  position: absolute; top: calc(100% + 16px); left: 50%;
  transform: translateX(-50%) translateY(6px);
  min-width: 340px; padding: 8px; border-radius: 18px;
  background: var(--bg-2); border: 1px solid var(--border);
  box-shadow: 0 24px 64px rgba(0,0,0,0.4);
  display: grid; gap: 2px; z-index: 1001;
  opacity: 0; pointer-events: none; visibility: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
}
.nv-dd-menu::before { content: ""; position: absolute; top: -18px; left: 0; right: 0; height: 18px; }
.nv-dd:hover .nv-dd-menu, .nv-dd:focus-within .nv-dd-menu {
  opacity: 1; pointer-events: auto; visibility: visible;
  transform: translateX(-50%) translateY(0);
}
.nv-dd-item { display: flex; flex-direction: column; gap: 1px; padding: 10px 14px; border-radius: 10px; transition: background 0.18s ease; }
.nv-dd-item:hover { background: var(--bg-card); }
.nv-dd-item-name { font-size: 13.5px; font-weight: 600; color: var(--text); letter-spacing: 0.01em; }
.nv-dd-item-blurb { font-size: 11.5px; color: var(--text-faint); }
.nv-dd-item.is-active .nv-dd-item-name { color: var(--orange); }

/* Mobile sheet service sub-links */
.nv-sheet-group { display: flex; flex-direction: column; }
.nv-sheet-sub { display: flex; flex-wrap: wrap; gap: 8px 16px; padding: 12px 0 16px; }
.nv-sheet-sublink { font-size: 14.5px; font-weight: 500; color: var(--text-dim); transition: color 0.2s ease; }
.nv-sheet-sublink:hover, .nv-sheet-sublink.is-active { color: var(--orange); }

/* Right cluster */
.nv-right { display: flex; align-items: center; gap: 8px; }
.nv-theme { width: 38px; height: 38px; border-radius: 999px; border: 1px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-dim); transition: all 0.2s; flex-shrink: 0; }
.nv-theme:hover { background: var(--orange-soft); border-color: var(--border-hover); color: var(--orange); }
/* WhatsApp "message us" pill */
.nv-wa {
  display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 16px;
  border-radius: 999px; border: 1px solid var(--border); background: transparent;
  color: var(--text-dim); font-family: var(--font-mono); font-size: 10.5px; font-weight: 500;
  letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
  transition: all 0.2s; flex-shrink: 0;
}
.nv-wa svg { color: #25d366; flex-shrink: 0; }
.nv-wa:hover { color: var(--text); border-color: #25d366; background: rgba(37,211,102,0.08); }

.nv-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 999px;
  background: var(--orange); color: #0a0a0b;
  font-size: 13px; font-weight: 700; letter-spacing: 0.01em; white-space: nowrap;
  box-shadow: 0 4px 16px rgba(255,106,26,0.2);
  transition: transform 0.25s ease, box-shadow 0.3s ease, background 0.25s;
}
.nv-cta span { display: inline-block; transition: transform 0.3s ease; }
.nv-cta:hover { background: var(--orange-light); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,106,26,0.35); }
.nv-cta:hover span { transform: translate(3px,-2px); }

/* Hamburger */
.nv-burger { display: none; position: relative; width: 40px; height: 40px; border: 1px solid var(--border); border-radius: 999px; background: transparent; cursor: pointer; transition: border-color 0.25s, background 0.25s; flex-shrink: 0; }
.nv-burger:hover { border-color: var(--text-faint); background: var(--bg-3); }
.nv-burger span { position: absolute; left: 10px; right: 10px; height: 1.5px; background: var(--text); border-radius: 2px; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease; }
.nv-burger span:nth-child(1) { top: 15px; }
.nv-burger span:nth-child(2) { bottom: 15px; }
.nv-burger.is-open span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
.nv-burger.is-open span:nth-child(2) { transform: translateY(-5px) rotate(-45deg); }

/* Full-screen mobile sheet */
[data-theme="light"] .nv-sheet { background: rgba(237,232,224,0.97); }
.nv-sheet {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(8,8,9,0.97);
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
  opacity: 0; pointer-events: none; transition: opacity 0.45s ease;
  display: flex; align-items: stretch;
}
.nv-sheet.is-open { opacity: 1; pointer-events: auto; }
.nv-sheet-inner { width: 100%; display: flex; flex-direction: column; justify-content: center; gap: 36px; padding: 96px var(--gutter) 48px; }
.nv-sheet-links { display: flex; flex-direction: column; }
.nv-sheet-link {
  display: flex; align-items: baseline; gap: 16px;
  padding: 14px 0; border-bottom: 1px solid var(--border);
  font-family: var(--font-display); font-size: clamp(28px, 8vw, 44px); font-weight: 600; letter-spacing: -0.03em;
  color: var(--text);
  opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.25,0.1,0.25,1), color 0.2s;
}
.nv-sheet.is-open .nv-sheet-link { opacity: 1; transform: none; }
.nv-sheet-link.is-active, .nv-sheet-link:hover { color: var(--orange); }
.nv-sheet-n { font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: var(--orange); letter-spacing: 0.05em; }
.nv-sheet-foot { display: flex; flex-direction: column; gap: 24px; }
.nv-cta-lg { align-self: flex-start; padding: 14px 28px; font-size: 14px; }
.nv-sheet-extras { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.nv-sheet-theme { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-dim); background: none; border: none; cursor: pointer; transition: color 0.2s; font-family: var(--font-sans); padding: 0; }
.nv-sheet-theme:hover { color: var(--orange); }
.nv-sheet-socials { display: flex; gap: 24px; flex-wrap: wrap; }
.nv-sheet-socials a { font-size: 13px; font-weight: 600; color: var(--text-dim); transition: color 0.2s; letter-spacing: 0.03em; }
.nv-sheet-socials a:hover { color: var(--orange); }
.nv-sheet-mail { font-size: 13px; color: var(--text-faint); transition: color 0.2s; }
.nv-sheet-mail:hover { color: var(--orange); }

/* Hide the mono links a touch earlier so the pill never crowds */
@media (max-width: 1040px) {
  .nv-wa-txt { display: none; }
  .nv-wa { padding: 0; width: 38px; justify-content: center; }
}
@media (max-width: 900px) {
  .nv-links { display: none; }
  .nv-burger { display: block; }
  .nv-bar { height: 56px; padding: 0 10px 0 18px; }
  .nv.is-scrolled .nv-bar { height: 52px; }
  .nv-cta:not(.nv-cta-lg) { padding: 9px 16px; font-size: 12px; }
}
@media (max-width: 460px) {
  .nv { padding: 10px 12px; }
  .nv-wa { display: none; }
  .nv-cta:not(.nv-cta-lg) span { display: none; }
  .nv-cta:not(.nv-cta-lg) { padding: 9px 14px; gap: 0; }
}
@media (max-width: 360px) {
  .nv-bar { padding: 0 8px 0 14px; }
  .nv-logo img { height: 22px; }
  .nv-theme { width: 34px; height: 34px; }
  .nv-burger { width: 34px; height: 34px; }
}
@media (prefers-reduced-motion: reduce) {
  .nv-sheet-link { transition: opacity 0.2s ease; transform: none; }
  .nv-dots i { animation: none; }
}
`;
