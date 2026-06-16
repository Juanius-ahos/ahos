import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
  style?: React.CSSProperties;
}

export function Section({ children, className = "", id, dark, style }: SectionProps) {
  return (
    <section
      id={id}
      className={`section ${dark ? "bg-[var(--bg-2)]" : ""} ${className}`}
      style={style}
    >
      <div className="container">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeader({ eyebrow, title, highlight, subtitle, center = true }: SectionHeaderProps) {
  return (
    <div className={`section-header ${center ? "" : ""}`} style={{ textAlign: center ? "center" : "left", marginLeft: center ? "auto" : "0", marginRight: center ? "auto" : "0" }}>
      {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
      <h2 className="section-title">
        {title}{highlight && <span className="highlight"> {highlight}</span>}
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
