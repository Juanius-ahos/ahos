import type { ReactNode } from "react";
import { Link } from "wouter";
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

/** Cinematic page opener shared by every inner page, matching the homepage film. */
export function PageHero({ crumb, kicker, titleLead, titleAccent, lead, visual, loop, children }: PageHeroProps) {
  const custom = typeof visual === "object";
  const src = custom ? visual.src : asset(`visuals/${visual}.webp`);
  const srcSet = custom ? undefined : `${asset(`visuals/${visual}-800.webp`)} 800w, ${asset(`visuals/${visual}.webp`)} 1600w`;
  return (
    <header className={`ph${custom ? " ph-custom" : ""}`}>
      {loop ? (
        <video className="ph-bg ph-video" data-loop autoPlay muted loop playsInline preload="auto" poster={asset(`loops/${loop}.jpg`)} aria-hidden="true">
          <source src={asset(`loops/${loop}.mp4`)} type="video/mp4" />
        </video>
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
