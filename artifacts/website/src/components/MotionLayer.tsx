import { useEffect } from "react";
import { useLocation } from "wouter";
import "./motion-layer.css";

// Everything that rises into place as it enters the viewport. Headings get a mask wipe instead.
const RISE = [
  ".hm-kicker", ".wk-card", ".bd-item", ".vc-item", ".sv-item", ".qa-list details", ".sv-promise-grid > div",
  ".sv-more li", ".st-facts > div", ".st-clock", ".cl-sub", ".cl-ctas", ".wk-also", ".hm-head + *:not(.wk-list):not(.bd-grid):not(.vc-grid):not(.sv-list)",
  ".ed-sec > *", ".faq-grid", ".pr-grid > *", ".cr-quote",
].join(",");
// headings are never hidden: they are the first thing a visitor reads
const WIPE = "";
const MAGNETIC = ".fh-btn, .nv-cta, .ed-btn";

/** Site-wide motion: scroll reveals, magnetic buttons, in-view video playback. Respects reduced motion. */
export function MotionLayer() {
  const [location] = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("has-motion");
    let io: IntersectionObserver | undefined;
    // wait a frame so the new route's DOM is in place
    const raf = requestAnimationFrame(() => {
      io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io!.unobserve(e.target);
        }
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
      const seen = new Set<Element>();
      const mark = (el: Element, kind: string) => {
        if (seen.has(el) || el.closest(".fh, .ph")) return; // hero copy has its own entrance
        seen.add(el);
        el.classList.add(kind);
        // stagger siblings of the same kind
        const sib = Array.from(el.parentElement?.children ?? []).filter((c) => c.classList.contains(kind));
        (el as HTMLElement).style.setProperty("--rv-i", String(Math.min(sib.indexOf(el), 6)));
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add("is-in");
        else io!.observe(el);
      };
      if (WIPE) document.querySelectorAll(WIPE).forEach((el) => mark(el, "rv-wipe"));
      document.querySelectorAll(RISE).forEach((el) => mark(el, "rv"));

      // loop videos play only while visible
      const vio = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
        }
      }, { threshold: 0 });
      document.querySelectorAll<HTMLVideoElement>("video[data-loop]").forEach((v) => vio.observe(v));
      cleanupVideo = () => vio.disconnect();
    });
    let cleanupVideo = () => {};
    return () => { cancelAnimationFrame(raf); io?.disconnect(); cleanupVideo(); };
  }, [location]);

  // magnetic buttons (fine pointers only)
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let active: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(MAGNETIC) ?? null;
      if (active && active !== el) { active.style.transform = ""; active = null; }
      if (!el) return;
      active = el;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.transform = `translate(${dx * 7}px, ${dy * 5}px)`;
    };
    const onLeave = () => { if (active) { active.style.transform = ""; active = null; } };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => { window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); };
  }, []);

  return null;
}
