import { Suspense, use, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Below-the-fold sections arrive as plain server HTML, fully readable and linkable.
 * React takes a section over when it is about to be scrolled into view (within 250 px of the screen),
 * or the moment someone hovers, focuses or touches it, or at the latest a few seconds after the page
 * has loaded and the browser is idle. So the first load only hydrates what is on screen, and a long
 * page never becomes one long task. The server renders the children as normal.
 *
 * How: each section sits in a Suspense boundary whose content waits on a promise. While the promise is
 * pending React leaves the server HTML of that boundary exactly as it is (it is "dehydrated"): nothing
 * is cleared, rewritten or re-created, so anchors like /#faq, find in page and crawlers all see the
 * whole page. Resolving the promise lets React hydrate the section in place.
 */

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
const idle = (cb: () => void) => {
  const w = window as IdleWindow;
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 4000 });
  else window.setTimeout(cb, 200);
};

/** True once the first page has been hydrated. A Defer that mounts after that (a client-side navigation) has no
 *  server HTML to keep, so it shows its content at once. */
let hydrated = false;
if (typeof window !== "undefined") window.addEventListener("ahos:hydrated", () => { hydrated = true; }, { once: true });

/** Spreads the idle-time fallback of the sections over a few seconds instead of all at the same moment. */
let lateCount = 0;

/** A promise React can read synchronously once it is settled (React 19 reads `status` and `value`). */
type Gate = Promise<void> & { status?: "pending" | "fulfilled"; value?: void; release: () => void };
function makeGate(): Gate {
  let release!: () => void;
  const p = new Promise<void>((resolve) => { release = resolve; }) as Gate;
  p.status = "pending";
  p.release = () => { if (p.status === "pending") { p.status = "fulfilled"; release(); } };
  return p;
}

function Wait({ gate, onDone, children }: { gate: Gate | null; onDone?: () => void; children: ReactNode }) {
  if (gate) use(gate as Promise<void>);
  useEffect(() => { onDone?.(); }, [onDone]);
  return <>{children}</>;
}

export function Defer({ children }: { children: ReactNode }) {
  // No gate on the server (render everything) or after the first page (nothing to keep).
  const [gate] = useState<Gate | null>(() => (typeof window === "undefined" || hydrated ? null : makeGate()));
  const ref = useRef<HTMLDivElement>(null);
  // React only keeps a dehydrated boundary for as long as nothing about it changes: a new element from a parent
  // that re-renders makes it give up and client-render it, which throws the server HTML away. So until the section
  // has been hydrated the very same element is handed back every time, and only then does it follow its parent.
  const [live, setLive] = useState(gate === null);
  const markLive = useCallback(() => setLive(true), []);
  const frozen = useRef<ReactNode>(null);
  if (!live && frozen.current === null) {
    frozen.current = <Suspense fallback={null}><Wait gate={gate} onDone={markLive}>{children}</Wait></Suspense>;
  }

  useEffect(() => {
    if (!gate || gate.status === "fulfilled") return;
    const host = ref.current;
    if (!host) { gate.release(); return; }
    const go = () => idle(gate.release);
    let io: IntersectionObserver | undefined;
    let timer = 0;
    const el = host.firstElementChild;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io?.disconnect(); go(); } }, { rootMargin: "250px 0px" });
      io.observe(el);
    } else {
      gate.release();
    }
    // a touch, hover or focus takes the section over at once (native listeners: React does not see events inside a dehydrated boundary)
    const now = () => gate.release();
    const opts = { passive: true, once: true } as const;
    host.addEventListener("pointerover", now, opts);
    host.addEventListener("focusin", now, { once: true });
    host.addEventListener("touchstart", now, opts);
    // the safety net: everything is hydrated a while after load, even if it is never scrolled to
    const late = () => { timer = window.setTimeout(go, 7000 + (lateCount++ % 12) * 500); };
    if (document.readyState === "complete") late(); else window.addEventListener("load", late, { once: true });
    return () => {
      io?.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("load", late);
      host.removeEventListener("pointerover", now);
      host.removeEventListener("focusin", now);
      host.removeEventListener("touchstart", now);
    };
  }, [gate]);

  return (
    <div ref={ref} className="defer" style={{ display: "contents" }}>
      {live ? <Suspense fallback={null}><Wait gate={null}>{children}</Wait></Suspense> : frozen.current}
    </div>
  );
}
