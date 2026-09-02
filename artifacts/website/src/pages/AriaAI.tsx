import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";

/* ── Scripted showcase. ARIA's live backend is paused for an upgrade, so the
   demo plays a canned conversation on a loop instead of hitting the API. ── */
const DEMOS: [string, string][] = [
  [
    "A booking app for my salon",
    "A salon booking app usually runs about six weeks: online scheduling, reminders, and card payments. I'd start with the calendar and no-show protection. Want a rough plan and a fixed quote?",
  ],
  [
    "How much for an online store?",
    "A clean store starts at $500. Custom checkout, real analytics, and inventory built in, live in a few weeks. I can break down exactly what's included for your products.",
  ],
  [
    "An AI tool for my team",
    "Love it. Tell me the busywork you want gone, replies, reports, data entry, and I'll map what's actually worth automating first so you see savings fast.",
  ],
];

const STEPS: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Describe it in plain words", body: "No tech vocabulary needed. Tell ARIA what you want to build the way you'd tell a friend." },
  { n: "02", title: "Get an honest plan", body: "Scope, timeline, and a real price range in seconds. No sales fluff, no hidden work." },
  { n: "03", title: "See it come to life", body: "ARIA sketches a live preview of your idea, then hands you to the team to build it for real." },
];

const CAN: { icon: string; label: string }[] = [
  { icon: "◷", label: "Estimate timelines" },
  { icon: "$", label: "Ballpark your budget" },
  { icon: "◆", label: "Scope features" },
  { icon: "▲", label: "Compare approaches" },
  { icon: "◎", label: "Sketch a live preview" },
  { icon: "→", label: "Map your next step" },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

export default function AriaAI() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [user, aria] = DEMOS[idx];
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) { setTyped(aria.length); return; }
    setTyped(0);
    let i = 0;
    const type = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= aria.length) {
        clearInterval(type);
        setTimeout(() => setIdx((n) => (n + 1) % DEMOS.length), 2800);
      }
    }, 24);
    return () => clearInterval(type);
  }, [idx, aria, reduced]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [typed]);

  const steps = useReveal<HTMLDivElement>();
  const can = useReveal<HTMLDivElement>();

  return (
    <>
      <SEOHead
        title="ARIA AI | AHOS Project Advisor (Upgrading)"
        description="Meet ARIA, the AHOS AI project advisor. Describe what you want to build and get honest scope, timeline, and pricing. ARIA is being upgraded, so tell us your project and a real person replies within 24 hours."
        path="/aria-ai"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "ARIA AI", url: "/aria-ai" }]} />

      <style>{css}</style>

      <div className="aa">
        {/* ── Upgrade banner ── */}
        <div className="aa-banner" role="status">
          <span className="aa-banner-dot" aria-hidden="true" />
          <p>
            <strong>ARIA is getting an upgrade.</strong> The live chat is paused while we make it
            smarter. Tell us your project directly and a real person replies within 24 hours.
          </p>
          <Link href="/contact" className="aa-banner-cta">Tell us your project <span aria-hidden="true">↗</span></Link>
        </div>

        {/* ── Hero ── */}
        <section className="aa-hero">
          <div className="aa-orb" aria-hidden="true">
            <span className="aa-orb-ring" />
            <span className="aa-orb-ring" />
            <span className="aa-orb-ring" />
            <span className="aa-orb-core">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.4L20 10l-6.1 1.6L12 18l-1.9-6.4L4 10l6.1-1.6z" /></svg>
            </span>
          </div>
          <div className="aa-eyebrow"><span className="aa-eyebrow-dot" />AHOS · AI project advisor</div>
          <h1 className="aa-h1">Meet <em>ARIA</em></h1>
          <p className="aa-lede">
            ARIA is the AI advisor built into AHOS. Describe what you want to build in plain words and
            get an honest plan back: scope, timeline, and a real price range, in seconds.
          </p>
          <div className="aa-pills">
            <span className="aa-pill">Honest quotes</span>
            <span className="aa-pill">No jargon</span>
            <span className="aa-pill">Instant answers</span>
          </div>
        </section>

        {/* ── Animated demo ── */}
        <section className="aa-demo-sec">
          <div className="aa-demo-card">
            <div className="aa-demo-head">
              <span className="aa-demo-avatar" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.4L20 10l-6.1 1.6L12 18l-1.9-6.4L4 10l6.1-1.6z" /></svg>
              </span>
              <div className="aa-demo-id">
                <strong>ARIA</strong>
                <span>AI project advisor</span>
              </div>
              <span className="aa-demo-badge">Upgrading</span>
            </div>

            <div className="aa-demo-body" ref={scrollRef} aria-hidden="true">
              <div className="aa-msg aa-msg-user">{user}</div>
              <div className="aa-msg aa-msg-aria">
                {aria.slice(0, typed)}
                {typed < aria.length && <span className="aa-caret" />}
              </div>
            </div>

            <div className="aa-demo-note">A recorded example. The live chat is paused for its upgrade.</div>
          </div>

          <div className="aa-demo-copy">
            <h2 className="aa-h2">A conversation, not a form</h2>
            <p>
              Most agencies hide behind a quote request and a three-day wait. ARIA answers the real
              questions right away, so you know roughly what your idea costs and how long it takes
              before you ever talk to a human.
            </p>
            <p>
              While ARIA trains on its next upgrade, our team picks up where it leaves off. Send your
              project and you'll hear back from a real person, fast.
            </p>
            <Link href="/contact" className="aa-btn">Start a project <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="aa-steps" ref={steps.ref}>
          <div className="aa-sec-head">
            <span className="aa-mono">How ARIA works</span>
            <h2 className="aa-h2">Three steps, no waiting room</h2>
          </div>
          <div className="aa-steps-grid">
            {STEPS.map((s, i) => (
              <div key={s.n} className={"aa-step" + (steps.shown ? " in" : "")} style={{ transitionDelay: `${i * 0.12}s` }}>
                <span className="aa-step-n">{s.n}</span>
                <h3 className="aa-step-t">{s.title}</h3>
                <p className="aa-step-b">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What you can ask ── */}
        <section className="aa-can" ref={can.ref}>
          <div className="aa-sec-head">
            <span className="aa-mono">What you can ask</span>
            <h2 className="aa-h2">ARIA speaks projects</h2>
          </div>
          <div className="aa-can-grid">
            {CAN.map((c, i) => (
              <div key={c.label} className={"aa-can-item" + (can.shown ? " in" : "")} style={{ transitionDelay: `${i * 0.07}s` }}>
                <span className="aa-can-ico" aria-hidden="true">{c.icon}</span>
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="aa-cta">
          <h2 className="aa-cta-h">ARIA's learning. Our team isn't waiting.</h2>
          <p className="aa-cta-p">
            Tell us what you want to build. You'll get honest advice, a fixed price, and a real reply
            within 24 hours, no bot required.
          </p>
          <div className="aa-cta-row">
            <Link href="/contact" className="aa-btn aa-btn-lg">Tell us your project <span aria-hidden="true">↗</span></Link>
            <a
              href="https://wa.me/96170165601"
              target="_blank"
              rel="noopener noreferrer"
              className="aa-btn-ghost"
            >
              WhatsApp us
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

const css = `
.aa { background: var(--bg); }

/* ── Banner ── */
.aa-banner { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; width: min(var(--max-width), 100%); margin: 0 auto; padding: 14px clamp(16px, 4vw, 28px); }
.aa-banner { border-bottom: 1px solid var(--border-soft); background: linear-gradient(90deg, var(--orange-soft), transparent 70%); }
.aa-banner-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--orange); flex-shrink: 0; box-shadow: 0 0 0 0 rgba(255,106,26,0.5); animation: aa-pulse 2.2s infinite; }
@keyframes aa-pulse { 0%{box-shadow:0 0 0 0 rgba(255,106,26,0.5);} 70%{box-shadow:0 0 0 10px rgba(255,106,26,0);} 100%{box-shadow:0 0 0 0 rgba(255,106,26,0);} }
.aa-banner p { flex: 1; min-width: 240px; margin: 0; font-size: 13.5px; line-height: 1.5; color: var(--text-muted); }
.aa-banner p strong { color: var(--text); font-weight: 700; }
.aa-banner-cta { flex-shrink: 0; display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; color: var(--orange); white-space: nowrap; }
.aa-banner-cta:hover { color: var(--orange-light); }

/* ── Hero ── */
.aa-hero { width: min(760px, 100%); margin: 0 auto; padding: clamp(48px, 8vh, 96px) clamp(16px, 4vw, 28px) clamp(32px, 5vh, 60px); text-align: center; display: flex; flex-direction: column; align-items: center; }
.aa-orb { position: relative; width: 116px; height: 116px; display: grid; place-items: center; margin-bottom: 30px; }
.aa-orb-ring { position: absolute; inset: 0; border-radius: 50%; border: 1px solid var(--border-hover); opacity: 0; animation: aa-ripple 3.4s ease-out infinite; }
.aa-orb-ring:nth-child(2) { animation-delay: 1.13s; }
.aa-orb-ring:nth-child(3) { animation-delay: 2.26s; }
@keyframes aa-ripple { 0%{transform:scale(0.55);opacity:0.9;} 100%{transform:scale(1.2);opacity:0;} }
.aa-orb-core { position: relative; width: 66px; height: 66px; border-radius: 50%; display: grid; place-items: center; color: var(--orange); background: var(--orange-soft); border: 1px solid var(--border-hover); box-shadow: 0 0 40px rgba(255,106,26,0.25); animation: aa-float 5s ease-in-out infinite; }
@keyframes aa-float { 50% { transform: translateY(-6px); } }
.aa-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 18px; }
.aa-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--orange); }
.aa-h1 { font-family: var(--font-display); font-size: clamp(46px, 8vw, 88px); font-weight: 700; line-height: 0.95; letter-spacing: -0.04em; margin: 0 0 22px; }
.aa-h1 em { font-style: normal; color: var(--orange); }
.aa-lede { font-size: clamp(15px, 1.8vw, 18px); line-height: 1.65; color: var(--text-muted); max-width: 560px; margin: 0 0 26px; }
.aa-pills { display: flex; flex-wrap: wrap; gap: 9px; justify-content: center; }
.aa-pill { font-size: 12.5px; font-weight: 600; color: var(--text-dim); background: var(--bg-3); border: 1px solid var(--border); border-radius: 999px; padding: 7px 16px; }

/* ── Demo section ── */
.aa-demo-sec { width: min(var(--max-width), 100%); margin: 0 auto; padding: clamp(24px, 5vh, 56px) clamp(16px, 4vw, 28px); display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 4vw, 56px); align-items: center; }
.aa-demo-card { border: 1px solid var(--border); border-radius: var(--radius-xl); background: linear-gradient(168deg, var(--bg-3), var(--bg-card)); box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.05); overflow: hidden; display: flex; flex-direction: column; }
.aa-demo-head { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border-soft); }
.aa-demo-avatar { width: 36px; height: 36px; border-radius: 11px; display: grid; place-items: center; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); flex-shrink: 0; }
.aa-demo-id { display: flex; flex-direction: column; line-height: 1.3; }
.aa-demo-id strong { font-size: 14px; font-weight: 700; }
.aa-demo-id span { font-size: 11.5px; color: var(--text-faint); }
.aa-demo-badge { margin-left: auto; font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--orange); background: var(--orange-soft); border: 1px solid var(--border-hover); padding: 4px 10px; border-radius: 999px; }
.aa-demo-body { min-height: 220px; max-height: 260px; overflow: hidden; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.aa-msg { max-width: 90%; padding: 11px 15px; border-radius: 14px; font-size: 14px; line-height: 1.55; }
.aa-msg-aria { align-self: flex-start; background: var(--bg-card); color: var(--text); border-bottom-left-radius: 4px; min-height: 1.2em; }
.aa-msg-user { align-self: flex-end; background: var(--orange); color: #0a0a0b; font-weight: 500; border-bottom-right-radius: 4px; }
.aa-caret { display: inline-block; width: 2px; height: 1em; background: var(--orange); margin-left: 2px; vertical-align: text-bottom; animation: aa-blink 1s step-end infinite; }
@keyframes aa-blink { 50% { opacity: 0; } }
.aa-demo-note { border-top: 1px solid var(--border-soft); padding: 12px 20px; font-size: 12px; color: var(--text-faint); text-align: center; }

.aa-demo-copy h2 { margin: 0 0 16px; }
.aa-demo-copy p { font-size: 15px; line-height: 1.7; color: var(--text-muted); margin: 0 0 16px; }
.aa-h2 { font-family: var(--font-display); font-size: clamp(24px, 3vw, 36px); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; color: var(--text); }

.aa-btn { display: inline-flex; align-items: center; gap: 9px; padding: 14px 26px; border-radius: 999px; background: var(--orange); color: #0a0a0b; font-size: 14px; font-weight: 700; box-shadow: 0 8px 26px rgba(255,106,26,0.26); transition: transform 0.25s, box-shadow 0.3s, background 0.25s; }
.aa-btn:hover { transform: translateY(-2px); background: var(--orange-light); box-shadow: 0 12px 34px rgba(255,106,26,0.36); }
.aa-btn-lg { padding: 16px 32px; font-size: 15px; }

/* ── Section heads ── */
.aa-sec-head { text-align: center; margin-bottom: clamp(28px, 4vh, 48px); }
.aa-mono { display: block; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 12px; }

/* ── Steps ── */
.aa-steps { width: min(var(--max-width), 100%); margin: 0 auto; padding: clamp(40px, 7vh, 90px) clamp(16px, 4vw, 28px); }
.aa-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.aa-step { border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--bg-2); padding: clamp(24px, 2.6vw, 36px); opacity: 0; transform: translateY(22px); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1); }
.aa-step.in { opacity: 1; transform: none; }
.aa-step-n { font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--orange); }
.aa-step-t { font-family: var(--font-display); font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); margin: 16px 0 10px; }
.aa-step-b { font-size: 14.5px; line-height: 1.65; color: var(--text-muted); margin: 0; }

/* ── Can ── */
.aa-can { width: min(var(--max-width), 100%); margin: 0 auto; padding: clamp(20px, 3vh, 40px) clamp(16px, 4vw, 28px) clamp(40px, 7vh, 90px); }
.aa-can-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.aa-can-item { display: flex; align-items: center; gap: 14px; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--bg-2); padding: 18px 22px; font-size: 15px; font-weight: 600; color: var(--text); opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.2s; }
.aa-can-item.in { opacity: 1; transform: none; }
.aa-can-item:hover { border-color: var(--border-hover); }
.aa-can-ico { width: 38px; height: 38px; flex-shrink: 0; display: grid; place-items: center; border-radius: 10px; background: var(--orange-soft); color: var(--orange); font-size: 17px; font-family: var(--font-mono); }

/* ── CTA ── */
.aa-cta { width: min(820px, 100%); margin: 0 auto; padding: clamp(48px, 9vh, 110px) clamp(16px, 4vw, 28px); text-align: center; }
.aa-cta-h { font-family: var(--font-display); font-size: clamp(30px, 5vw, 56px); font-weight: 700; line-height: 1.02; letter-spacing: -0.03em; color: var(--text); margin: 0 0 20px; }
.aa-cta-p { font-size: clamp(15px, 1.8vw, 18px); line-height: 1.65; color: var(--text-muted); max-width: 520px; margin: 0 auto 30px; }
.aa-cta-row { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
.aa-btn-ghost { display: inline-flex; align-items: center; gap: 9px; padding: 16px 32px; border-radius: 999px; background: none; border: 1px solid var(--border-hover); color: var(--text); font-size: 15px; font-weight: 600; transition: border-color 0.2s, color 0.2s, transform 0.25s; }
.aa-btn-ghost:hover { border-color: var(--orange); color: var(--orange); transform: translateY(-2px); }

/* ── Responsive ── */
@media (max-width: 860px) {
  .aa-demo-sec { grid-template-columns: 1fr; gap: 28px; }
  .aa-steps-grid { grid-template-columns: 1fr; }
  .aa-can-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 520px) {
  .aa-can-grid { grid-template-columns: 1fr; }
  .aa-banner { justify-content: center; text-align: center; }
  .aa-banner p { min-width: 0; }
}
`;
