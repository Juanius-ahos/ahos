import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

type CTA = { text: string; btn: string; href: string; external?: boolean };

const byRoute: Record<string, CTA> = {
  "/": { text: "Got a project in mind?", btn: "Start a project", href: "/contact" },
  "/services": { text: "Like what you see?", btn: "Get a quote", href: "/contact" },
  "/web3": { text: "Building on-chain?", btn: "Book a call", href: "/contact" },
  "/faq": { text: "Still have a question?", btn: "Talk to a human", href: "/contact" },
  "/careers": { text: "Think you'd fit in?", btn: "Pitch yourself", href: "mailto:info@ahos.xyz?subject=Joining the studio", external: true },
  "/aria-ai": { text: "Prefer a human?", btn: "Start a project", href: "/contact" },
};

export function SmartCTA() {
  const [location] = useLocation();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      const pastHero = y > vh * 0.7;
      const nearFooter = docH - (y + vh) < 420; // don't fight the footer CTA
      setShow(pastHero && !nearFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [location]);

  // No floating CTA on the contact page itself.
  if (location === "/contact") return null;
  const cta = byRoute[location] || byRoute["/"];
  const visible = show && !dismissed;

  return (
    <>
      <style>{css}</style>
      <div className={`scta ${visible ? "is-on" : ""}`} role="complementary" aria-hidden={!visible}>
        <span className="scta-col">
          <span className="scta-dot" />
          <span className="scta-text">{cta.text}</span>
        </span>
        <span className="scta-col">
          {cta.external ? (
            <a className="scta-btn" href={cta.href}>{cta.btn} <span aria-hidden="true">↗</span></a>
          ) : (
            <Link className="scta-btn" href={cta.href}>{cta.btn} <span aria-hidden="true">↗</span></Link>
          )}
          <button className="scta-x" onClick={() => setDismissed(true)} aria-label="Dismiss">×</button>
        </span>
      </div>
    </>
  );
}

const css = `
.scta {
  position: fixed; left: 50%; bottom: 24px; z-index: 900;
  transform: translate(-50%, 140%); opacity: 0; pointer-events: none;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  padding: 8px 8px 8px 20px; border-radius: 999px;
  background: var(--bg-2); border: 1px solid var(--border);
  box-shadow: 0 16px 50px rgba(0,0,0,0.55);
  transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease;
}
.scta.is-on { transform: translate(-50%, 0); opacity: 1; pointer-events: auto; }
.scta-col { display: flex; align-items: center; gap: 12px; }
.scta-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--orange); }
.scta-text { font-size: 14px; font-weight: 500; color: var(--text-muted); white-space: nowrap; }
.scta-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 999px; background: var(--orange); color: #0a0a0b; font-size: 13px; font-weight: 700; transition: transform 0.2s, background 0.2s; }
.scta-btn span { transition: transform 0.2s; }
.scta-btn:hover { background: var(--orange-light); transform: translateY(-1px); }
.scta-btn:hover span { transform: translate(2px,-2px); }
.scta-x { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border); background: transparent; color: var(--text-dim); font-size: 15px; line-height: 1; cursor: pointer; transition: color 0.2s, border-color 0.2s; }
.scta-x:hover { border-color: var(--border-hover); color: var(--text); }

@media (max-width: 560px) {
  .scta { left: 12px; right: 12px; bottom: 14px; transform: translateY(140%); padding: 8px 8px 8px 16px; }
  .scta.is-on { transform: translateY(0); }
  .scta-text { font-size: 13px; }
  .scta-col:first-child { gap: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .scta { transition: opacity 0.3s ease; }
  .scta.is-on { transform: translate(-50%, 0); }
}
`;
