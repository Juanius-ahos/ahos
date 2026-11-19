/**
 * Cursor spotlight on cards: one delegated listener writes the pointer position into two CSS
 * variables on the card under it, and the glow itself is pure CSS (styles/fx.css). Fine pointers only.
 */
const CARDS = ".oc, .svc, .tst, .check-form, .spot";

export function startSpotlight() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  let raf = 0;
  let last: PointerEvent | null = null;
  const apply = () => {
    raf = 0;
    const e = last;
    const card = (e?.target as Element | null)?.closest<HTMLElement>(CARDS);
    if (!e || !card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--sx", `${e.clientX - r.left}px`);
    card.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };
  document.addEventListener("pointermove", (e) => { last = e; if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
}
