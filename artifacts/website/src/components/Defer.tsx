import { useCallback, useEffect, useState, type ReactNode } from "react";

/**
 * Below-the-fold sections arrive as plain server HTML, fully readable and linkable.
 * React takes them over later, one section at a time while the browser is idle, so
 * hydrating a long page never becomes one long task. Hovering, focusing or touching
 * a section takes it over straight away. The server renders the children as normal.
 */

const queue: (() => void)[] = [];
let started = false;
let running = false;

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
const idle = (cb: () => void) => {
  const w = window as IdleWindow;
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 1500 });
  else window.setTimeout(cb, 80);
};

function pump() {
  if (running) return;
  running = true;
  const step = () => {
    const next = queue.shift();
    if (!next) {
      running = false;
      window.dispatchEvent(new Event("ahos:refresh"));
      return;
    }
    next();
    idle(step);
  };
  step();
}

function start() {
  if (started) return;
  started = true;
  const go = () => window.setTimeout(pump, 800);
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
}

export function Defer({ children }: { children: ReactNode }) {
  const server = typeof window === "undefined";
  const [active, setActive] = useState(server);
  const activate = useCallback(() => setActive(true), []);

  useEffect(() => {
    if (active) return;
    queue.push(activate);
    start();
    return () => {
      const i = queue.indexOf(activate);
      if (i >= 0) queue.splice(i, 1);
    };
  }, [active, activate]);

  if (!active) {
    // Keeps the server HTML exactly as it is: React does not look inside, and does not clear it.
    return <div className="defer" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: "" }} suppressHydrationWarning onPointerOver={activate} onFocusCapture={activate} onTouchStart={activate} />;
  }
  return <div className="defer" style={{ display: "contents" }}>{children}</div>;
}
