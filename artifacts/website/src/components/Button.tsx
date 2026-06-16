import type { ReactNode } from "react";
import { Link } from "wouter";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

const variants = {
  primary:
    "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm tracking-wider " +
    "bg-[var(--orange)] text-white shadow-[0_4px_24px_var(--orange-glow)] " +
    "hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200",
  secondary:
    "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm tracking-wider " +
    "border border-[var(--border)] bg-[var(--bg-card)] text-white " +
    "hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5 transition-all duration-200",
  ghost:
    "inline-flex items-center gap-2 text-sm text-[var(--text-muted)] " +
    "hover:text-[var(--orange)] transition-colors duration-200",
};

export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  return (
    <Link href={href} className={`${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
