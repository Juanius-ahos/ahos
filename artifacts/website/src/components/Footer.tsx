import { Link } from "wouter";

function CurvedTextMarquee() {
  return (
    <div className="ftx-curve-wrap">
      <style>{curveCss}</style>
      <div className="ftx-curve-mask">
        <svg viewBox="0 0 1400 175" className="ftx-curve-svg" aria-hidden="true">
          <defs>
            <path id="fm-curve" d="M -50,140 Q 700,240 1450,30" fill="none" />
          </defs>
          <text fill="rgba(237,232,224,0.12)" fontSize="var(--text-display-m, 36px)" fontWeight="700" fontFamily="var(--font-display)">
            <textPath href="#fm-curve" startOffset="0%">
              YOUR WEBSITES LOAD FAST. YOUR SOFTWARE ACTUALLY WORKS. YOUR CUSTOMERS STAY. · YOUR WEBSITES LOAD FAST. YOUR SOFTWARE ACTUALLY WORKS. YOUR CUSTOMERS STAY. ·{" "}
              <tspan fill="var(--orange)">BUILT TO PERFORM</tspan>.
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}

const curveCss = `
.ftx-curve-wrap { border-bottom: 1px solid var(--border-soft); overflow: hidden; }
.ftx-curve-mask { mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%); }
.ftx-curve-svg { display: block; width: 100%; height: auto; }
`;

function SocialPill({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="ftx-pill">
      {icon}
      <span>{label}</span>
    </a>
  );
}

function Col({ head, children }: { head: string; children: React.ReactNode }) {
  return (
    <nav className="ftx-col" aria-label={head}>
      <div className="ftx-col-head">{head}</div>
      {children}
    </nav>
  );
}

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

export function Footer() {
  return (
    <>
      <style>{css}</style>

      <footer className="ftx">
        <CurvedTextMarquee />

        <div className="ed">
          {/* Talk to us */}
          <div className="ftx-comms">
            <span className="ftx-comms-label">[ talk to us ]</span>
            <div className="ftx-comms-grid">
              <a href="mailto:info@ahos.xyz" className="ftx-comm-card">
                <span className="ftx-comm-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/></svg>
                </span>
                <span className="ftx-comm-text">
                  <span className="ftx-comm-type">email</span>
                  <span className="ftx-comm-detail">write to us · info@ahos.xyz</span>
                </span>
                <span className="ftx-comm-arrow" aria-hidden="true">→</span>
              </a>
              <a href="https://wa.me/96170165601" className="ftx-comm-card" target="_blank" rel="noopener noreferrer">
                <span className="ftx-comm-icon" style={{ color: "#25d366" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </span>
                <span className="ftx-comm-text">
                  <span className="ftx-comm-type">whatsapp</span>
                  <span className="ftx-comm-detail">let's talk · +961 70 165 601</span>
                </span>
                <span className="ftx-comm-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* The cure */}
          <div className="ftx-phrase">
            <span className="ftx-phrase-label">[ the cure ]</span>
            <h2 className="ftx-phrase-title">
              And every business deserves to evolve<span className="ftx-dot" aria-hidden="true" />
            </h2>
          </div>

          {/* Social pills */}
          <div className="ftx-socials-section">
            <span className="ftx-socials-label">[ follow ]</span>
            <div className="ftx-pills">
              <SocialPill href="https://www.linkedin.com/company/ahos-xyz" label="linkedin" icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>} />
              <SocialPill href="https://www.instagram.com/ahos.xyz/" label="instagram" icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.74 3.74 0 01-1.38-.9 3.74 3.74 0 01-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.87 5.87 0 00-2.13 1.38A5.87 5.87 0 00.63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.87 5.87 0 001.38 2.13 5.87 5.87 0 002.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.87 5.87 0 002.13-1.38 5.87 5.87 0 001.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.87 5.87 0 00-1.38-2.13A5.87 5.87 0 0019.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.85a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>} />
              <SocialPill href="https://www.youtube.com/@ahos_xyz" label="youtube" icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>} />
            </div>
          </div>

          {/* Link columns */}
          <div className="ftx-cols-section">
            <div className="ftx-cols">
              <Col head="Popular services">
                <SwapLink href="/web-development">Web Development</SwapLink>
                <SwapLink href="/ai-development">AI & Automation</SwapLink>
                <SwapLink href="/custom-software">Custom Software</SwapLink>
                <SwapLink href="/mobile-app-development">Mobile Apps</SwapLink>
                <SwapLink href="/ecommerce-development">E-Commerce</SwapLink>
                <SwapLink href="/services">All services →→</SwapLink>
              </Col>
              <Col head="Company">
                <SwapLink href="/">Home</SwapLink>
                <SwapLink href="/pricing">Pricing</SwapLink>
                <SwapLink href="/services">Services</SwapLink>
                <SwapLink href="/careers">Careers</SwapLink>
                <SwapLink href="/faq">FAQ</SwapLink>
                <SwapLink href="/contact">Contact</SwapLink>
              </Col>
              <Col head="Quick links">
                <SwapLink href="/web3">Web3</SwapLink>
                <SwapLink href="/aria-ai">ARIA AI</SwapLink>
                <SwapLink href="https://www.instagram.com/ahos.xyz/" external>Instagram</SwapLink>
                <SwapLink href="https://www.linkedin.com/company/ahos-xyz" external>LinkedIn</SwapLink>
                <SwapLink href="https://www.youtube.com/@ahos_xyz" external>YouTube</SwapLink>
              </Col>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="ftx-bottom">
            <div className="ftx-locations">
              <span className="ftx-location-pill">
                <span className="ftx-pulse-dot" />
                beirut · lb · hq
              </span>
              <span className="ftx-location-pill">
                <span className="ftx-pulse-dot ftx-pulse-green" />
                online · worldwide
              </span>
              <span className="ftx-location-pill ftx-location-stat">
                since 2023 · 50+ projects
              </span>
            </div>
            <div className="ftx-payments">
              <span className="ftx-payments-label">payment rails</span>
              <span className="ftx-payments-cards">VISA · Mastercard · AMEX</span>
            </div>
          </div>
          <div className="ftx-meta">
            <span>© {new Date().getFullYear()} AHOS — Advanced Hybrid Online Systems</span>
            <span className="ftx-legal">
              <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms</a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

const css = `
.ftx { position: relative; border-top: 1px solid var(--border-soft); background: var(--bg); overflow: hidden; }

/* Talk to us */
.ftx-comms { padding: clamp(48px, 6vw, 80px) 0 clamp(32px, 4vw, 56px); }
.ftx-comms-label { font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-dim); display: block; margin-bottom: 20px; }
.ftx-comms-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); border-radius: var(--radius-xl); overflow: hidden; }
.ftx-comm-card { display: flex; align-items: center; gap: 16px; padding: clamp(20px, 3vw, 32px) clamp(24px, 3vw, 40px); background: var(--bg-card); transition: background 0.3s; }
.ftx-comm-card:hover { background: var(--bg-card-hover); }
.ftx-comm-icon { flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--border); color: var(--text-dim); transition: color 0.3s, border-color 0.3s; }
.ftx-comm-card:hover .ftx-comm-icon { color: var(--orange); border-color: var(--border-hover); }
.ftx-comm-text { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
.ftx-comm-type { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text); text-transform: lowercase; transition: color 0.3s; }
.ftx-comm-card:hover .ftx-comm-type { color: var(--orange); }
.ftx-comm-detail { font-family: var(--font-mono); font-size: 12px; color: var(--text-dim); }
.ftx-comm-arrow { font-size: 20px; color: var(--text-dim); transition: color 0.3s, transform 0.3s; }
.ftx-comm-card:hover .ftx-comm-arrow { color: var(--orange); transform: translateX(4px); }

/* The cure */
.ftx-phrase { padding: clamp(48px, 6vw, 80px) 0 clamp(32px, 4vw, 56px); }
.ftx-phrase-label { font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-dim); display: block; margin-bottom: 16px; }
.ftx-phrase-title { font-family: var(--font-display); font-size: clamp(36px, 6vw, 80px); font-weight: 700; letter-spacing: -0.04em; line-height: 1; color: var(--text); max-width: 20ch; }
.ftx-dot { display: inline-block; width: 0.18em; height: 0.18em; border-radius: 50%; background: var(--orange); margin-left: 0.02em; vertical-align: baseline; }

/* Social pills */
.ftx-socials-section { border-top: 1px solid var(--border-soft); padding: clamp(32px, 4vw, 56px) 0; }
.ftx-socials-label { font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-dim); display: block; margin-bottom: 16px; }
.ftx-pills { display: flex; flex-wrap: wrap; gap: 10px; }
.ftx-pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 999px; border: 1px solid var(--border); font-family: var(--font-mono); font-size: 12px; font-weight: 500; color: var(--text-dim); transition: all 0.3s; }
.ftx-pill:hover { border-color: var(--border-hover); color: var(--text); background: var(--orange-soft); transform: translateY(-2px); }

/* Link columns */
.ftx-cols-section { border-top: 1px solid var(--border-soft); padding: clamp(32px, 4vw, 56px) 0; }
.ftx-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.ftx-col { display: flex; flex-direction: column; gap: 14px; }
.ftx-col-head { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 4px; }

/* Swap link */
.ftx-link { width: fit-content; }
.ftx-swap { position: relative; display: inline-block; overflow: hidden; line-height: 1.45; }
.ftx-swap-a, .ftx-swap-b { display: block; font-size: 14.5px; color: var(--text-muted); transition: transform 0.42s cubic-bezier(0.5,0,0.2,1), color 0.42s; }
.ftx-swap-b { position: absolute; inset: 0; transform: translateY(110%); color: var(--orange); }
.ftx-link:hover .ftx-swap-a { transform: translateY(-110%); }
.ftx-link:hover .ftx-swap-b { transform: translateY(0); }

/* Bottom */
.ftx-bottom { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 24px 0; border-top: 1px solid var(--border-soft); }
.ftx-locations { display: flex; flex-wrap: wrap; gap: 8px; }
.ftx-location-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px; border: 1px solid var(--border); font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-dim); }
.ftx-location-stat { border-color: transparent; color: var(--text-faint); }
.ftx-pulse-dot { width: 5px; height: 5px; border-radius: 50%; background: #46d27e; box-shadow: 0 0 0 0 rgba(70,210,126,0.5); animation: ftx-pulse 2.2s infinite; }
.ftx-pulse-green { background: #46d27e; }
@keyframes ftx-pulse { 0%{box-shadow:0 0 0 0 rgba(70,210,126,0.5);} 70%{box-shadow:0 0 0 6px rgba(70,210,126,0);} 100%{box-shadow:0 0 0 0 rgba(70,210,126,0);} }
.ftx-payments { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.ftx-payments-label { font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-faint); }
.ftx-payments-cards { font-family: var(--font-mono); font-size: 12px; color: var(--text-dim); }
.ftx-meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 16px 0 20px; border-top: 1px solid var(--border-soft); font-size: 11px; color: var(--text-faint); }
.ftx-legal a { color: var(--text-dim); transition: color 0.2s; }
.ftx-legal a:hover { color: var(--orange); }

@media (max-width: 768px) {
  .ftx-comms-grid { grid-template-columns: 1fr; }
  .ftx-cols { grid-template-columns: 1fr 1fr; gap: 28px 18px; }
}
@media (max-width: 480px) {
  .ftx-bottom { flex-direction: column; align-items: flex-start; gap: 10px; }
}
`;
