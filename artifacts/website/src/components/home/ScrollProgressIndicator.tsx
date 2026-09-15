import { useEffect, useState } from "react";

/**
 * Fixed right-side scroll progress indicator matching weevolveit.com:
 * vertical bar with a moving dot + "000%" text, mix-blend-difference.
 */
export function ScrollProgressIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = h.scrollHeight - h.clientHeight;
      setProgress(pct > 0 ? Math.round((h.scrollTop / pct) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="spi" aria-hidden="true">
      <style>{css}</style>
      <div className="spi-bar">
        <span className="spi-dot" style={{ top: `${progress}%` }} />
      </div>
      <span className="spi-text">{String(progress).padStart(3, "0")}%</span>
    </div>
  );
}

const css = `
.spi {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 12px;
  mix-blend-mode: difference;
  pointer-events: none;
}
.spi-bar {
  position: relative;
  width: 1px;
  height: 64px;
  background: rgba(255,255,255,0.2);
}
.spi-dot {
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 8px;
  background: #fff;
  transform: translateY(-50%);
  transition: top 0.15s ease-out;
}
.spi-text {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  font-variant-numeric: tabular-nums;
}
@media (max-width: 768px) {
  .spi { display: none; }
}
`;
