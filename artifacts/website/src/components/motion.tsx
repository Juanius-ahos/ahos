import { useEffect, useRef, useState, type ReactNode, type CSSProperties, type ElementType } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* ───────────────────────────────────────────────────────────
   SplitText — splits a line into characters that rise from a
   clipped mask, staggered. Cinematic headline entrance.
─────────────────────────────────────────────────────────── */
export function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.022,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
}) {
  const words = text.split(" ");
  let i = -1;
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="split-word" aria-hidden="true">
          {word.split("").map((ch) => {
            i += 1;
            const idx = i;
            return (
              <span key={idx} className="split-char">
                <motion.span
                  style={{ display: "inline-block", willChange: "transform" }}
                  initial={{ y: "115%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + idx * stagger }}
                >
                  {ch}
                </motion.span>
              </span>
            );
          })}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

/* ───────────────────────────────────────────────────────────
   Parallax — scroll-scrubbed translate (framer useScroll). Wrap
   an element; it drifts as the section moves through the viewport.
─────────────────────────────────────────────────────────── */
export function Parallax({
  children,
  className = "",
  amount = 80,
  axis = "y",
  style,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  axis?: "x" | "y";
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const shift = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  const motionStyle = axis === "x" ? { x: shift as MotionValue<number> } : { y: shift as MotionValue<number> };
  return (
    <motion.div ref={ref} className={className} style={{ ...motionStyle, willChange: "transform", ...style }}>
      {children}
    </motion.div>
  );
}

/* ───────────────────────────────────────────────────────────
   Reveal — directional, sequenced scroll entrance (framer-motion).
   `dir` chooses the entrance vector so the eye is guided down the
   page; `delay` (ms) staggers siblings. Respects reduced-motion via
   the <MotionConfig reducedMotion="user"> wrapper in App.
─────────────────────────────────────────────────────────── */
type Dir = "up" | "down" | "left" | "right" | "scale";

const TAGS: Record<string, any> = {
  div: motion.div, section: motion.section, span: motion.span,
  h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, a: motion.a, ul: motion.ul, li: motion.li,
};
const resolve = (as?: ElementType) => (typeof as === "string" && TAGS[as]) || motion.div;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** entrance vector (default "up") */
  dir?: Dir;
  /** travel distance for up/down (px, default 32) */
  y?: number;
}

export function Reveal({ children, delay = 0, as, className = "", style, dir = "up", y }: RevealProps) {
  const Comp = resolve(as);
  const d = y ?? 32;
  const hidden =
    dir === "left" ? { opacity: 0, x: -56 }
    : dir === "right" ? { opacity: 0, x: 56 }
    : dir === "scale" ? { opacity: 0, scale: 0.94 }
    : dir === "down" ? { opacity: 0, y: -d }
    : { opacity: 0, y: d };

  return (
    <Comp
      className={className}
      style={style}
      initial={hidden}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
    >
      {children}
    </Comp>
  );
}

/* ───────────────────────────────────────────────────────────
   useInView — lightweight IO hook (used by CountUp).
─────────────────────────────────────────────────────────── */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.unobserve(e.target);
        }
      });
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, inView };
}

/* ───────────────────────────────────────────────────────────
   CountUp — animates a number when it scrolls into view.
─────────────────────────────────────────────────────────── */
interface CountUpProps {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({ to, prefix = "", suffix = "", duration = 1600, className }: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    let raf = 0;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{val}{suffix}
    </span>
  );
}

/* ───────────────────────────────────────────────────────────
   Magnetic — element drifts toward the cursor, springs back.
   Pointer-only, reduced-motion safe.
─────────────────────────────────────────────────────────── */
export function Magnetic({
  children,
  className = "",
  strength = 0.35,
  style,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const active = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || !active()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      style={{ display: "inline-flex", transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)", ...style }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </span>
  );
}
