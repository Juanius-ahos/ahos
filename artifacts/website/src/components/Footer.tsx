import { Link } from "wouter";
import type { ReactNode } from "react";

/* Masked text-swap link — the label slides up, an orange copy rises in.
   A small bespoke touch that reads as hand-built, not a default hover. */
function SwapLink({ href, children, external }: { href: string; children: string; external?: boolean }) {
  const inner = (
    <span className="ftx-swap">
      <span className="ftx-swap-a">{children}</span>
      <span className="ftx-swap-b" aria-hidden="true">{children}</span>
    </span>
  );
  return external ? (
    <a className="ftx-link" href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <Link className="ftx-link" href={href}>{inner}</Link>
  );
}

function Col({ head, children }: { head: string; children: ReactNode }) {
  return (
    <nav className="ftx-col" aria-label={head}>
      <div className="ftx-col-head">{head}</div>
      {children}
    </nav>
  );
}

export function Footer() {
  return (
    <>
      <style>{css}</style>

      <footer className="ftx">
        <div className="ed">
          {/* Quiet CTA strip — useful on pages that don't end in a CTA */}
          <div className="ftx-cta">
            <span className="ftx-cta-label">Got something to build?</span>
            <a className="ftx-cta-mail" href="mailto:info@ahos.xyz">
              info@ahos.xyz <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="ftx-top">
            <div className="ftx-brand">
              <Link href="/" className="ftx-wordmark" aria-label="AHOS home">
                AHOS<span>.</span>
              </Link>
              <p className="ftx-pitch">
                An independent studio that builds the whole thing — sites, software, Web3,
                AI, and brand. One team, no handoffs, no filler.
              </p>
              <div className="ftx-locality">
                <span className="ftx-loc-dot" /> Beirut — working worldwide
              </div>
              <div className="ftx-socials">
                <a className="ftx-social" href="https://www.instagram.com/ahos.xyz/" target="_blank" rel="noopener noreferrer">
                  <span className="ftx-social-ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                  </span>
                  <span className="ftx-social-txt"><strong>Instagram</strong><em>@ahos.xyz · work-in-progress & launches</em></span>
                  <span className="ftx-social-go" aria-hidden="true">↗</span>
                </a>
                <a className="ftx-social" href="https://www.linkedin.com/company/ahos-xyz" target="_blank" rel="noopener noreferrer">
                  <span className="ftx-social-ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="7" y1="10" x2="7" y2="17" strokeLinecap="round"/><circle cx="7" cy="7" r="1.1" fill="currentColor" stroke="none"/><path d="M11 17v-4c0-2 4-2 4 0v4" strokeLinecap="round"/><line x1="11" y1="10" x2="11" y2="17" strokeLinecap="round"/></svg>
                  </span>
                  <span className="ftx-social-txt"><strong>LinkedIn</strong><em>/ahos-xyz · studio news & hiring</em></span>
                  <span className="ftx-social-go" aria-hidden="true">↗</span>
                </a>
                <a className="ftx-social" href="https://www.youtube.com/@ahos_xyz" target="_blank" rel="noopener noreferrer">
                  <span className="ftx-social-ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>
                  </span>
                  <span className="ftx-social-txt"><strong>YouTube</strong><em>@ahos_xyz · build breakdowns & demos</em></span>
                  <span className="ftx-social-go" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="ftx-cols">
              <Col head="Studio">
                <SwapLink href="/">Home</SwapLink>
                <SwapLink href="/pricing">Pricing</SwapLink>
                <SwapLink href="/services">Services</SwapLink>
                <SwapLink href="/aria-ai">ARIA AI</SwapLink>
                <SwapLink href="/web3">Web3</SwapLink>
                <SwapLink href="/careers">Careers</SwapLink>
                <SwapLink href="/faq">FAQ</SwapLink>
              </Col>
              <Col head="Services">
                <SwapLink href="/web-development">Web Development</SwapLink>
                <SwapLink href="/mobile-app-development">Mobile Apps</SwapLink>
                <SwapLink href="/custom-software">Custom Software</SwapLink>
                <SwapLink href="/ecommerce-development">E-Commerce</SwapLink>
                <SwapLink href="/web3">Web3 & Blockchain</SwapLink>
                <SwapLink href="/ai-development">AI & Automation</SwapLink>
                <SwapLink href="/ui-ux-design">UI/UX Design</SwapLink>
              </Col>
              <Col head="Connect">
                <SwapLink href="/contact">Start a project</SwapLink>
                <SwapLink href="/careers">Join the studio</SwapLink>
                <SwapLink href="https://www.instagram.com/ahos.xyz/" external>Instagram</SwapLink>
                <SwapLink href="https://www.linkedin.com/company/ahos-xyz" external>LinkedIn</SwapLink>
                <SwapLink href="https://www.youtube.com/@ahos_xyz" external>YouTube</SwapLink>
              </Col>
            </div>
          </div>

          {/* Oversized ghost wordmark — editorial signature */}
          <div className="ftx-ghost" aria-hidden="true">AHOS</div>

          <div className="ftx-bottom">
            <span>© {new Date().getFullYear()} AHOS — Advanced Hybrid Online Systems</span>
            <span className="ftx-signoff">Made by people, not templates.</span>
            <button className="ftx-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Back to top <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}

const css = `
.ftx { position: relative; border-top: 1px solid var(--border-soft); background: var(--bg); overflow: hidden; }
.ftx .ed { padding-top: clamp(56px, 7vw, 88px); padding-bottom: 32px; }

/* CTA strip */
.ftx-cta { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; flex-wrap: wrap; padding-bottom: clamp(40px, 5vw, 64px); margin-bottom: clamp(40px, 5vw, 64px); border-bottom: 1px solid var(--border-soft); }
.ftx-cta-label { font-size: 13px; font-weight: 600; letter-spacing: 0.04em; color: var(--text-dim); text-transform: uppercase; }
.ftx-cta-mail { font-family: var(--font-display); font-size: clamp(28px, 5vw, 56px); font-weight: 600; letter-spacing: -0.03em; color: var(--text); transition: color 0.25s; }
.ftx-cta-mail span { display: inline-block; transition: transform 0.3s ease; }
.ftx-cta-mail:hover { color: var(--orange); }
.ftx-cta-mail:hover span { transform: translate(4px, -4px); }

/* Top: brand + nav columns */
.ftx-top { display: grid; grid-template-columns: 1.4fr 2fr; gap: clamp(32px, 5vw, 72px); }
.ftx-brand { max-width: 360px; }
.ftx-wordmark { font-family: var(--font-display); font-size: 30px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); display: inline-block; margin-bottom: 18px; }
.ftx-wordmark span { color: var(--orange); }
.ftx-pitch { font-size: 14.5px; line-height: 1.7; color: var(--text-muted); margin-bottom: 20px; }
.ftx-locality { display: inline-flex; align-items: center; gap: 9px; font-size: 13px; color: var(--text-dim); margin-bottom: 26px; }
.ftx-loc-dot { width: 7px; height: 7px; border-radius: 50%; background: #46d27e; box-shadow: 0 0 0 0 rgba(70,210,126,0.5); animation: ftx-pulse 2.4s infinite; }
@keyframes ftx-pulse { 0%{box-shadow:0 0 0 0 rgba(70,210,126,0.45);} 70%{box-shadow:0 0 0 7px rgba(70,210,126,0);} 100%{box-shadow:0 0 0 0 rgba(70,210,126,0);} }

.ftx-socials { display: flex; flex-direction: column; gap: 8px; }
.ftx-social { display: flex; align-items: center; gap: 13px; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--border-soft); color: var(--text-muted); transition: border-color 0.25s, background 0.25s, transform 0.25s; }
.ftx-social:hover { border-color: var(--border-hover); background: var(--orange-soft); transform: translateX(3px); }
.ftx-social-ico { flex-shrink: 0; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 9px; border: 1px solid var(--border); color: var(--text-dim); transition: color 0.25s, border-color 0.25s; }
.ftx-social:hover .ftx-social-ico { color: var(--orange); border-color: var(--border-hover); }
.ftx-social-txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.ftx-social-txt strong { font-size: 14px; font-weight: 600; color: var(--text); }
.ftx-social-txt em { font-style: normal; font-size: 11.5px; color: var(--text-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ftx-social-go { margin-left: auto; color: var(--text-faint); transition: color 0.25s, transform 0.25s; }
.ftx-social:hover .ftx-social-go { color: var(--orange); transform: translate(2px, -2px); }

/* Nav columns */
.ftx-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.ftx-col { display: flex; flex-direction: column; gap: 14px; }
.ftx-col-head { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 4px; }

/* Masked swap link */
.ftx-link { width: fit-content; }
.ftx-swap { position: relative; display: inline-block; overflow: hidden; line-height: 1.45; }
.ftx-swap-a, .ftx-swap-b { display: block; font-size: 14.5px; color: var(--text-muted); transition: transform 0.42s cubic-bezier(0.5,0,0.2,1), color 0.42s; }
.ftx-swap-b { position: absolute; inset: 0; transform: translateY(110%); color: var(--orange); }
.ftx-link:hover .ftx-swap-a { transform: translateY(-110%); }
.ftx-link:hover .ftx-swap-b { transform: translateY(0); }

/* Oversized ghost wordmark */
.ftx-ghost { font-family: var(--font-display); font-weight: 700; font-size: clamp(80px, 26vw, 360px); line-height: 0.8; letter-spacing: -0.05em; text-align: center; margin: clamp(36px, 6vw, 80px) 0 -0.12em; color: transparent; -webkit-text-stroke: 1px var(--border); user-select: none; }

/* Bottom bar */
.ftx-bottom { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding-top: 26px; border-top: 1px solid var(--border-soft); font-size: 12.5px; color: var(--text-dim); }
.ftx-signoff { color: var(--text-faint); }
.ftx-top-btn { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 600; color: var(--text-dim); background: none; border: none; cursor: pointer; transition: color 0.25s; font-family: var(--font-sans); }
.ftx-top-btn span { display: inline-block; transition: transform 0.3s ease; }
.ftx-top-btn:hover { color: var(--orange); }
.ftx-top-btn:hover span { transform: translateY(-3px); }

@media (max-width: 860px) {
  .ftx-top { grid-template-columns: 1fr; gap: 44px; }
  .ftx-brand { max-width: 100%; }
}
@media (max-width: 540px) {
  .ftx-cols { grid-template-columns: 1fr 1fr; gap: 28px 18px; }
  .ftx-bottom { flex-direction: column; align-items: flex-start; gap: 10px; }
}
`;
