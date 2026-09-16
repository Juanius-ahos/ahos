import { useEffect, useRef, useState } from "react";

/**
 * The five-phase method as a robust vertical timeline. No scroll pinning and no
 * horizontal scroll-jack (those kept breaking / overlapping) — just clean rows
 * that reveal on scroll via IntersectionObserver. AHOS's own process and words.
 */
const PHASES = [
  { n: "01", title: "Discover", accent: "#ff6a1a", headline: "We start with your goals, not our stack.", notes: ["A free consultation, no commitment", "We map scope, risks, and what success looks like", "You get a fixed-price quote in writing"] },
  { n: "02", title: "Design", accent: "#ff8c4a", headline: "See it before we build it.", notes: ["UX flows first, then pixel-tight UI", "A clickable direction you can react to", "You sign off before a line of code"] },
  { n: "03", title: "Build", accent: "#e0560a", headline: "Clean code, built in the open.", notes: ["Documented, tested, and yours to keep", "Milestone demos as it takes shape", "No black box, you watch it grow"] },
  { n: "04", title: "Launch", accent: "#ffb074", headline: "Live, and set up to grow.", notes: ["We deploy, QA, and load-check", "Analytics and SEO wired in", "Full handover, the code is 100% yours"] },
  { n: "05", title: "Evolve", accent: "#cc5500", headline: "We stick around after launch.", notes: ["A 30-day post-launch warranty", "Support when you need a human", "Improvements as your business grows"] },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function Phase({ p, i }: { p: (typeof PHASES)[number]; i: number }) {
  const { ref, shown } = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      className={"mth-phase" + (shown ? " in" : "")}
      style={{ ["--acc" as string]: p.accent, transitionDelay: `${i * 0.06}s` } as React.CSSProperties}
    >
      <div className="mth-phase-num" aria-hidden="true">{p.n}</div>
      <div className="mth-phase-content">
        <h3 className="mth-phase-title">{p.title}</h3>
        <p className="mth-phase-headline">{p.headline}</p>
        <ul className="mth-phase-notes">
          {p.notes.map((note) => (
            <li key={note} className="mth-note">
              <span className="mth-note-tick" aria-hidden="true">›</span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function MethodSection() {
  const head = useReveal<HTMLDivElement>();
  return (
    <section className="mth" aria-label="How we work">
      <style>{css}</style>
      <div className="ed">
        <div ref={head.ref} className={"mth-head" + (head.shown ? " in" : "")}>
          <span className="mth-label">
            <span className="mth-label-n">03</span>
            <span className="mth-label-line" />
            How we work
          </span>
          <h2 className="mth-h2">A five-phase method.</h2>
          <p className="mth-lead">
            The same path on every project, so you always know what happens next, what it costs, and who owns the result. You do.
          </p>
          <p className="mth-flow">Discover · Design · Build · Launch · <span>Evolve</span></p>
        </div>

        <ol className="mth-list">
          {PHASES.map((p, i) => <Phase key={p.n} p={p} i={i} />)}
        </ol>
      </div>
    </section>
  );
}

const css = `
.mth { position: relative; z-index: 1; padding: var(--section-pad) 0; border-top: 1px solid var(--border-soft); }

.mth-head { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1); }
.mth-head.in { opacity: 1; transform: none; }
.mth-label { display: inline-flex; align-items: center; gap: 14px; font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 22px; }
.mth-label-n { color: var(--orange); }
.mth-label-line { width: 36px; height: 1px; background: var(--border-hover); }
.mth-h2 { font-family: var(--font-display); font-size: clamp(34px, 5.2vw, 68px); font-weight: 700; line-height: 1; letter-spacing: -0.035em; color: var(--text); margin: 0; }
.mth-lead { margin: 20px 0 0; max-width: 560px; font-size: clamp(15px, 1.6vw, 18px); line-height: 1.65; color: var(--text-muted); }
.mth-flow { margin: 18px 0 0; font-family: var(--font-mono); font-size: clamp(11px, 1.2vw, 13px); font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-faint); }
.mth-flow span { color: var(--orange); }

.mth-list { list-style: none; margin: clamp(44px, 6vw, 80px) 0 0; padding: 0; }
.mth-phase {
  display: grid; grid-template-columns: clamp(88px, 13vw, 190px) 1fr; gap: clamp(20px, 4vw, 56px);
  padding: clamp(28px, 4vw, 48px) 0; border-top: 1px solid var(--border-soft);
  opacity: 0; transform: translateY(32px);
  transition: opacity 0.75s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1);
}
.mth-phase.in { opacity: 1; transform: none; }

.mth-phase-num {
  font-family: var(--font-display); font-size: clamp(46px, 7vw, 104px); font-weight: 700; line-height: 0.9; letter-spacing: -0.04em;
  color: transparent; -webkit-text-stroke: 1.5px var(--acc, var(--orange)); text-stroke: 1.5px var(--acc, var(--orange));
}
.mth-phase-title { font-family: var(--font-display); font-size: clamp(28px, 4vw, 52px); font-weight: 700; letter-spacing: -0.03em; line-height: 1; color: var(--text); margin: 0 0 12px; }
.mth-phase-headline { font-family: var(--font-display); font-size: clamp(16px, 1.9vw, 23px); font-weight: 500; line-height: 1.4; color: var(--text-muted); margin: 0 0 22px; max-width: 46ch; }
.mth-phase-notes { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 13px; }
.mth-note { display: flex; align-items: flex-start; gap: 13px; font-size: clamp(14.5px, 1.4vw, 17px); line-height: 1.5; color: var(--text-muted); }
.mth-note-tick { color: var(--acc, var(--orange)); font-family: var(--font-mono); font-weight: 700; flex-shrink: 0; }

@media (max-width: 640px) {
  .mth-phase { grid-template-columns: 1fr; gap: 14px; }
  .mth-phase-num { font-size: clamp(40px, 16vw, 64px); }
}
@media (prefers-reduced-motion: reduce) {
  .mth-head, .mth-phase { opacity: 1; transform: none; transition: none; }
}
`;
