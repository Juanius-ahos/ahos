import { useEffect, useRef } from "react";

export function ScrollReveal({
  children,
  className = "",
  as: Tag = "div",
  type = "fade",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "span" | "h1" | "h2" | "p" | "header" | "a";
  type?: "fade" | "zoom" | "slide" | "clip";
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      const vars: gsap.TweenVars = {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        delay,
      };

      if (type === "zoom") {
        Object.assign(vars, { scale: 0.88, opacity: 0, duration: 1.2, ease: "power3.out" });
      } else if (type === "slide") {
        Object.assign(vars, { y: 48, opacity: 0, duration: 1, ease: "power3.out" });
      } else if (type === "clip") {
        Object.assign(vars, { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "power3.out" });
      } else {
        Object.assign(vars, { opacity: 0, y: 24, duration: 1, ease: "power3.out" });
      }

      const tween = gsap.from(el, vars);
      cleanup = () => { tween.kill(); };
    })();

    return () => cleanup?.();
  }, [type, delay]);

  return (
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
