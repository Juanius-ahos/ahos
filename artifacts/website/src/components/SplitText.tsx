import { useEffect, useRef } from "react";

export function SplitText({
  text,
  className = "",
  as: Tag = "span",
  stagger = 0.02,
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLSpanElement>(".sp-char-inner");
    if (!chars.length) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(chars, { y: "115%" }, { y: 0, duration: 0.9, stagger, ease: "power3.out", delay });
      tl.play();

      cleanup = () => {
        tl.kill();
      };
    })();

    return () => cleanup?.();
  }, [stagger, delay]);

  const words = text.split(" ");
  let ci = 0;

  return (
    <>
      <style>{`
        .sp-word { display: inline-block; white-space: nowrap; }
        .sp-char { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.14em; margin-bottom: -0.14em; }
        .sp-char-inner { display: inline-block; will-change: transform; }
      `}</style>
      <Tag ref={ref as any} className={className} aria-label={text}>
        {words.map((word, wi) => (
          <span key={wi} className="sp-word" aria-hidden="true">
            {word.split("").map((ch) => {
              const idx = ci++;
              return (
                <span key={idx} className="sp-char">
                  <span className="sp-char-inner">{ch}</span>
                </span>
              );
            })}
            {wi < words.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </Tag>
    </>
  );
}
