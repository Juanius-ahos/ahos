import { useEffect, useRef } from "react";

/**
 * A massive ghosted display word that slides in horizontally on scroll, the
 * weevolveit-style reveal, kept in the AHOS orange identity. Sits behind/around
 * a section's real heading and is decorative only (aria-hidden). The parent is
 * expected to clip the x-overflow (.gx-wrap) so the oversized word never creates
 * horizontal scroll.
 */
export function GhostHeading({
  children,
  variant = "outline",
  from = "left",
  className = "",
  style,
}: {
  children: string;
  variant?: "outline" | "solid";
  from?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion: land the word in its final position, no scrub.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "none";
      return;
    }

    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const gsap = (await import("gsap")).default;
        const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
        gsap.registerPlugin(ScrollTrigger);

        const dir = from === "left" ? -1 : 1;
        const tween = gsap.fromTo(
          el,
          { xPercent: dir * 26, opacity: 0.15 },
          {
            xPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "center center",
              scrub: 1,
            },
          }
        );
        cleanup = () => { tween.scrollTrigger?.kill(); tween.kill(); };
      } catch {
        el.style.transform = "none";
      }
    })();
    return () => cleanup?.();
  }, [from]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`gx-ghost gx-ghost--${variant} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
