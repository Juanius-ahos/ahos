/**
 * Smooth scrolling on its own, for pages that have no scripted motion (the homepage).
 * Lenis is small; GSAP and its plugins stay out of those pages entirely. Touch devices keep
 * native scrolling (Lenis does not take over touch by default) and reduced motion keeps it off.
 * If a page that needs GSAP is opened later, motion.ts stops this instance and takes over.
 */
type Stop = () => void;

export async function startLenis() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: Lenis } = await import("lenis");
  const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, anchors: { offset: -80 } } as ConstructorParameters<typeof Lenis>[0]);
  let stopped = false;
  const frame = (t: number) => {
    if (stopped) return;
    lenis.raf(t);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  (window as Window & { __ahosStopLenis?: Stop }).__ahosStopLenis = () => { stopped = true; lenis.destroy(); };
}
