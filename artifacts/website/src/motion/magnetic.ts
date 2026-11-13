/**
 * Magnetic buttons: elements marked data-magnetic lean a few pixels toward the pointer.
 * One delegated listener, no library, fine pointers only, off for reduced motion.
 * Delegation means it keeps working when React re-renders a section.
 */
export function startMagnetic() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let current: HTMLElement | null = null;

  document.addEventListener(
    "pointermove",
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (current && current !== el) current.style.transform = "";
      current = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.transform = `translate(${(dx * 10).toFixed(1)}px, ${(dy * 8).toFixed(1)}px)`;
    },
    { passive: true },
  );

  document.addEventListener("pointerleave", () => { if (current) { current.style.transform = ""; current = null; } }, { passive: true });
}
