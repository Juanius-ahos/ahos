import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/web3", label: "Blockchain" },
  { href: "/careers", label: "Careers" },
  { href: "/faq", label: "FAQ" },
  { href: "/aria-ai", label: "ARIA AI" },
];

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <style>{css}</style>

      <nav className={`nv ${scrolled ? "is-scrolled" : ""}`}>
        <Link href="/" className="nv-logo" aria-label="AHOS home">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AHOS" />
        </Link>

        <div className="nv-links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nv-link ${location === l.href ? "is-active" : ""}`}
              aria-current={location === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nv-right">
          <button className="nv-theme" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <Link href="/contact" className="nv-cta">Start a project <span aria-hidden="true">↗</span></Link>
          <button
            className={`nv-burger ${open ? "is-open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span /><span />
          </button>
        </div>
      </nav>

      <div className={`nv-sheet ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <div className="nv-sheet-inner">
          <div className="nv-sheet-links">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nv-sheet-link ${location === l.href ? "is-active" : ""}`}
                style={{ transitionDelay: open ? `${0.08 + i * 0.05}s` : "0s" }}
              >
                <span className="nv-sheet-n">0{i + 1}</span>
                {l.label}
              </Link>
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
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
.nv {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px var(--gutter);
  transition: padding 0.4s cubic-bezier(0.25,0.1,0.25,1), background 0.4s ease, border-color 0.4s ease;
  background: var(--bg);
  border-bottom: 1px solid var(--border-soft);
}
.nv.is-scrolled {
  padding-top: 12px; padding-bottom: 12px;
  border-bottom-color: var(--border);
}
.nv-logo {
  flex-shrink: 0;
  position: relative; z-index: 1;
}
.nv-logo img { height: 30px; width: auto; display: block; transition: transform 0.3s ease, filter 0.3s ease; filter: drop-shadow(0 0 12px rgba(255,106,26,0.15)); }
.nv-logo:hover img { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(255,106,26,0.35)); }

.nv-links { display: flex; align-items: center; gap: 2px; }
.nv-link {
  position: relative; padding: 7px 16px; border-radius: 999px;
  font-size: 13.5px; font-weight: 500; letter-spacing: 0.02em;
  color: var(--text-dim); transition: color 0.25s ease, background 0.25s ease;
}
.nv-link::after {
  content: ""; position: absolute; left: 16px; right: 16px; bottom: 2px; height: 1.5px;
  background: var(--orange); border-radius: 2px;
  transform: scaleX(0); transform-origin: left; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
}
.nv-link:hover { color: var(--text); }
.nv-link:hover::after { transform: scaleX(0.4); }
.nv-link.is-active { color: var(--text); }
.nv-link.is-active::after { transform: scaleX(1); }

.nv-right { display: flex; align-items: center; gap: 12px; }
/* Theme toggle */
.nv-theme { width: 36px; height: 36px; border-radius: 999px; border: 1px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-dim); transition: all 0.2s; flex-shrink: 0; }
.nv-theme:hover { background: var(--orange-soft); border-color: var(--border-hover); color: var(--orange); }

.nv-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 20px; border-radius: 999px;
  background: var(--orange); color: #0a0a0b;
  font-size: 13px; font-weight: 700; letter-spacing: 0.01em;
  box-shadow: 0 4px 16px rgba(255,106,26,0.2);
  transition: transform 0.25s ease, box-shadow 0.3s ease, background 0.25s;
}
.nv-cta span { display: inline-block; transition: transform 0.3s ease; }
.nv-cta:hover { background: var(--orange-light); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,106,26,0.35); }
.nv-cta:hover span { transform: translate(3px,-2px); }

/* Hamburger */
.nv-burger { display: none; position: relative; width: 40px; height: 40px; border: 1px solid var(--border); border-radius: 999px; background: transparent; cursor: pointer; transition: border-color 0.25s, background 0.25s; }
.nv-burger:hover { border-color: var(--text-faint); background: var(--bg-3); }
.nv-burger span { position: absolute; left: 10px; right: 10px; height: 1.5px; background: var(--text); border-radius: 2px; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease; }
.nv-burger span:nth-child(1) { top: 15px; }
.nv-burger span:nth-child(2) { bottom: 15px; }
.nv-burger.is-open span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
.nv-burger.is-open span:nth-child(2) { transform: translateY(-5px) rotate(-45deg); }

/* Full-screen mobile sheet */
[data-theme="light"] .nv-sheet { background: rgba(237,232,224,0.96); }

.nv-sheet {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(8,8,9,0.96);
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
/* light-mode overrides handled by CSS variables */
.nv-sheet-mail { font-size: 13px; color: var(--text-faint); transition: color 0.2s; }
.nv-sheet-mail:hover { color: var(--orange); }
/* light-mode hover handled by CSS variables */

@media (max-width: 900px) {
  .nv-links, .nv-cta:not(.nv-cta-lg) { display: none; }
  .nv-burger { display: block; }
}
@media (prefers-reduced-motion: reduce) {
  .nv-sheet-link { transition: opacity 0.2s ease; transform: none; }
}
`;
