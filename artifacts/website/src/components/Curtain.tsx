import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

/** Between pages a dark curtain lifts away with the orange signal line on its edge.
 *  Skipped on the first load, so the first paint is never covered. */
export function Curtain() {
  const [location] = useLocation();
  const first = useRef(true);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setRun((r) => r + 1);
  }, [location]);
  return run ? <div key={run} className="curtain" aria-hidden="true"><span /></div> : null;
}
