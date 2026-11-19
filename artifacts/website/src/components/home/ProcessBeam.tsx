import { useState } from "react";
import { PathBeam } from "@/components/corsair/path-beam";
import { process } from "../../site.config";

/**
 * How we work, as a flow: five steps in a row with a beam of light travelling from one to the next as
 * the section scrolls into view, lighting each step on arrival. The beam is the real PathBeam from
 * Corsair UI (https://21st.dev/@kevingirelli), drawn as SVG over the row. On a narrow screen the
 * steps are a plain numbered list. The steps are real text either way.
 */
const PATHS = ["M100 4H300", "M300 4H500", "M500 4H700", "M700 4H900"];

export function ProcessLine() {
  const [reached, setReached] = useState(1);
  return (
    <div className="relative">
      <PathBeam
        className="pointer-events-none absolute top-[19px] left-0 hidden h-2 w-full lg:block"
        viewBox="0 0 1000 8"
        preserveAspectRatio="none"
        paths={PATHS}
        track
        glow
        strokeWidth={2}
        beamLength={0.35}
        duration={900}
        stagger={-150}
        delay={300}
        trackClassName="stroke-border"
        beamClassName="stroke-primary"
        onPathComplete={(i) => setReached((r) => Math.max(r, i + 2))}
      />
      <ol className="relative grid gap-0 lg:grid-cols-5">
        {process.map((s, i) => (
          <li key={s.name} className="relative px-0 pb-10 pl-14 lg:px-4 lg:pt-14 lg:pb-0 lg:pl-4 lg:text-center">
            <span
              aria-hidden="true"
              className={`absolute top-0 left-0 grid size-10 place-items-center rounded-full text-sm font-semibold transition-colors duration-500 lg:left-1/2 lg:-translate-x-1/2 ${
                i < reached ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground ring-1 ring-border"
              }`}
            >
              <span style={{ fontFamily: "var(--f-m)" }}>{i + 1}</span>
            </span>
            <h3 className="d text-foreground text-xl font-semibold tracking-tight">{s.name}</h3>
            <p className="text-muted-foreground mt-2 text-[0.95rem] leading-relaxed">{s.body}</p>
            <span className="text-primary mt-3 block text-xs tracking-wider uppercase" style={{ fontFamily: "var(--f-m)" }}>{s.time}</span>
          </li>
        ))}
      </ol>
      <p className="pl-badge">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 4.5 3.2 8.2 8 9 4.8-.8 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
        30-day warranty on every build
      </p>
    </div>
  );
}
