import type { ReactNode } from "react";
import { Link } from "wouter";
import { DeviceCanvas, type Region } from "./DeviceCanvas";
import "./page-hero.css";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

// Film frames rendered with the homepage film; the subject sits on the right third.
export type Visual = "design" | "build" | "live" | "launch" | "world" | "spark";
// Looping product scenes rendered with the same pipeline (public/loops/<name>.mp4).
export type Loop = "web" | "ecom" | "mobile" | "software" | "ai" | "design";

interface PageHeroProps {
  crumb?: string;
  kicker: string;
  titleLead: ReactNode;
  titleAccent?: ReactNode;
  lead?: ReactNode;
  visual: Visual | { src: string; alt: string };
  loop?: Loop;
  children?: ReactNode;
}

// Devices sit in the space the headline and lead leave free (beside them on wide screens).
function heroRegion(canvas: HTMLCanvasElement): Region {
  const c = canvas.getBoundingClientRect();
  if (window.innerWidth <= 900) return { x: 0, y: 0, w: c.width, h: c.height };
  const head = canvas.parentElement!;
  const right = Math.max(...Array.from(head.querySelectorAll(".ph-h1, .ph-lead, .ph-kicker")).map((el) => el.getBoundingClientRect().right));
  const x = Math.min(c.width * 0.58, right - c.left + 32);
  return { x, y: 64, w: c.width - x, h: c.height - 64 };
}

/** Cinematic page opener shared by every inner page, matching the homepage film. */
export function PageHero({ crumb, kicker, titleLead, titleAccent, lead, visual, loop, children }: PageHeroProps) {
  const custom = typeof visual === "object";
  const src = custom ? visual.src : asset(`visuals/${visual}.webp`);
  const srcSet = custom ? undefined : `${asset(`visuals/${visual}-800.webp`)} 800w, ${asset(`visuals/${visual}.webp`)} 1600w`;
  return (
    <header className={`ph${custom ? " ph-custom" : ""}`}>
      {loop ? (
        <DeviceCanvas scene={loop} className="ph-bg ph-canvas" region={heroRegion} />
      ) : (
        <img className={`ph-bg${custom ? "" : " ph-drift"}`} src={src} srcSet={srcSet} sizes="100vw" alt={custom ? visual.alt : ""} aria-hidden={custom ? undefined : true} fetchPriority="high" />
      )}
      <div className="ph-shade" aria-hidden="true" />
      <div className="ph-inner">
        {crumb && (
          <nav className="ph-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><span>{crumb}</span>
          </nav>
        )}
        <p className="ph-kicker"><span className="ph-rule" />{kicker}</p>
        <h1 className="ph-h1">{titleLead}{titleAccent && <> <em>{titleAccent}</em></>}</h1>
        {lead && <p className="ph-lead">{lead}</p>}
        {children && <div className="ph-ctas">{children}</div>}
      </div>
    </header>
  );
}
