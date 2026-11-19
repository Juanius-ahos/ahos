/**
 * Sections and cards rise in as they come into view. Two rules keep it safe:
 *  - it starts on the first scroll, so the page a visitor (or a crawler, or a speed test) lands on is
 *    fully painted and nothing is ever hidden that they have not had the chance to scroll to;
 *  - once an element has appeared its attribute is removed, so it goes back to its own hover styles.
 * Reduced motion skips it entirely. The styles are in styles/fx.css.
 */
const TARGETS = ".sec .sh, .oc, .svc, .tst, .lab-card, .founder-copy, .founder-photo, .where-item, .where-globe, .check-copy, .check-form, .qa-grid > header, .cc, .foot-logo, .proof, .ways, .cx, .wacc, .band, .faq-tools, .cs-facts, .cs-grid";
const EVENTS = ["scroll", "wheel", "touchmove", "keydown"] as const;

export function startReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const begin = () => {
    EVENTS.forEach((e) => window.removeEventListener(e, begin));
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        const el = e.target as HTMLElement;
        io.unobserve(el);
        el.style.setProperty("--rv-d", `${Math.min(i, 5) * 80}ms`);
        el.setAttribute("data-rv", "in");
        window.setTimeout(() => { el.removeAttribute("data-rv"); el.style.removeProperty("--rv-d"); }, 1500);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already on screen
      el.setAttribute("data-rv", "wait");
      io.observe(el);
    });
  };
  EVENTS.forEach((e) => window.addEventListener(e, begin, { once: true, passive: true }));
}
