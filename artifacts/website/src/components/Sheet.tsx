import { useEffect, useRef } from "react";
import { Arrow } from "./Arrow";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

// Drawing primitives in fractions of a 1440 x 900 desktop frame.
export type Mark =
  | { k: "bar"; x: number; y: number; w: number; h: number }        // solid strip (promo bar, nav)
  | { k: "text"; x: number; y: number; w: number; h: number; lines?: number; heavy?: boolean }
  | { k: "img"; x: number; y: number; w: number; h: number }        // picture placeholder, drawn with an X
  | { k: "btn"; x: number; y: number; w: number; h: number; fill?: boolean }
  | { k: "box"; x: number; y: number; w: number; h: number }
  | { k: "rule"; x: number; y: number; w: number }
  | { k: "ring"; x: number; y: number; r: number };
export type Note = { x: number; y: number; to: [number, number]; text: string };

export interface Project {
  id: string;
  name: string;
  what: string;
  where: string;
  href: string;
  linkLabel: string;
  marks: Mark[];
  notes: Note[];
}

const W = 1440, H = 900;
// a little hand in every line: deterministic wobble so the drawing reads as drawn, not plotted
function hand(seed: number) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280 - 0.5); }
function line(x1: number, y1: number, x2: number, y2: number, j: () => number, amp = 1.4) {
  const mx = (x1 + x2) / 2 + j() * amp * 2, my = (y1 + y2) / 2 + j() * amp * 2;
  return `M${(x1 + j() * amp).toFixed(1)} ${(y1 + j() * amp).toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${(x2 + j() * amp).toFixed(1)} ${(y2 + j() * amp).toFixed(1)}`;
}
function rect(x: number, y: number, w: number, h: number, j: () => number) {
  return [line(x, y, x + w, y, j), line(x + w, y, x + w, y + h, j), line(x + w, y + h, x, y + h, j), line(x, y + h, x, y, j)].join(" ");
}

function Drawing({ p }: { p: Project }) {
  const j = hand(p.id.length * 31 + p.marks.length);
  const paths: string[] = [], heavy: string[] = [], fills: [number, number, number, number][] = [];
  for (const m of p.marks) {
    if (m.k === "ring") { const cx = m.x * W, cy = m.y * H, r = m.r * W; paths.push(`M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`); continue; }
    if (m.k === "rule") { paths.push(line(m.x * W, m.y * H, (m.x + m.w) * W, m.y * H, j, 0.8)); continue; }
    const x = m.x * W, y = m.y * H, w = m.w * W, h = m.h * H;
    if (m.k === "bar") { fills.push([x, y, w, h]); paths.push(rect(x, y, w, h, j)); }
    if (m.k === "box") paths.push(rect(x, y, w, h, j));
    if (m.k === "btn") { paths.push(rect(x, y, w, h, j)); if (m.fill) fills.push([x, y, w, h]); }
    if (m.k === "img") { paths.push(rect(x, y, w, h, j)); paths.push(line(x, y, x + w, y + h, j, 2)); paths.push(line(x + w, y, x, y + h, j, 2)); }
    if (m.k === "text") {
      const n = m.lines ?? (m.heavy ? 2 : 3);
      for (let i = 0; i < n; i++) {
        const ly = y + (h * (i + 0.5)) / n, lw = w * (i === n - 1 && n > 1 ? 0.62 : 1);
        (m.heavy ? heavy : paths).push(line(x, ly, x + lw, ly, j, m.heavy ? 1.2 : 0.8));
      }
    }
  }
  return (
    <svg className="sh-draw" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id={`grid-${p.id}`} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="var(--rule-soft)" strokeWidth="1" /></pattern>
        <pattern id={`hatch-${p.id}`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V9" stroke="var(--ink)" strokeWidth="1.2" opacity=".35" /></pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#grid-${p.id})`} />
      {fills.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={`url(#hatch-${p.id})`} />)}
      <path d={paths.join(" ")} fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
      <path d={heavy.join(" ")} fill="none" stroke="var(--ink)" strokeWidth="9" strokeLinecap="round" opacity=".85" />
      {/* dimensions, as on any sheet */}
      <g className="sh-dim" stroke="var(--signal)" strokeWidth="1.4" fill="var(--signal)">
        <path d={`M24 26 H${W - 24} M24 18 V34 M${W - 24} 18 V34`} />
        <path d={`M${W - 26} 60 V${H - 24} M${W - 34} 60 H${W - 18} M${W - 34} ${H - 24} H${W - 18}`} />
      </g>
      <text className="sh-dimtxt" x={W / 2} y={20} textAnchor="middle">1440</text>
      <text className="sh-dimtxt" x={W - 38} y={H / 2} textAnchor="end">900</text>
      {p.notes.map((n, i) => (
        <g key={i} className="sh-note">
          <path d={line(n.x * W, n.y * H, n.to[0] * W, n.to[1] * H, j, 3)} fill="none" stroke="var(--signal)" strokeWidth="1.6" />
          <circle cx={n.to[0] * W} cy={n.to[1] * H} r="5" fill="var(--signal)" />
          <text x={n.x * W} y={n.y * H - 12} textAnchor={n.x > n.to[0] ? "start" : "end"}>{n.text}</text>
        </g>
      ))}
    </svg>
  );
}

/** One project, presented as a drawing sheet. As the sheet crosses the middle of the
 *  viewport, the build line from the film sweeps down and the drawing becomes the live site. */
export function Sheet({ p, index, total }: { p: Project; index: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.setProperty("--b", "1"); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      // 0 when the sheet's top reaches 85% of the viewport, 1 when its middle passes 40%
      const b = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.45 + r.height * 0.5)));
      el.style.setProperty("--b", b.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  const external = p.href.startsWith("http");
  return (
    <article className="sh" ref={ref}>
      <div className="sh-stage">
        <Drawing p={p} />
        <img
          className="sh-real"
          src={asset(`work/top-${p.id}.webp`)}
          srcSet={`${asset(`work/top-${p.id}-960.webp`)} 960w, ${asset(`work/top-${p.id}.webp`)} 1440w`}
          sizes="(max-width: 900px) 100vw, 1180px"
          alt={`${p.name}, the live site designed and built by AHOS`}
          width={1440}
          height={900}
          loading="lazy"
        />
        <span className="sh-cut" aria-hidden="true" />
      </div>
      <dl className="sh-tb">
        <div className="sh-tb-name"><dt>Project</dt><dd>{p.name}</dd></div>
        <div><dt>What we made</dt><dd>{p.what}</dd></div>
        <div><dt>Where</dt><dd>{p.where}</dd></div>
        <div><dt>Sheet</dt><dd className="num">{index + 1} of {total}</dd></div>
        <div className="sh-tb-go">
          <dt>See it</dt>
          <dd>
            <a className="lnk" href={p.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
              {p.linkLabel} <Arrow />
            </a>
          </dd>
        </div>
      </dl>
    </article>
  );
}
