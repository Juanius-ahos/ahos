/**
 * Animated sparkle border SVG — a dashed stroke that travels around a rounded
 * rectangle, with a Gaussian blur halo. Matches weevolveit.com's stats bar effect.
 */
export function SparkleBorder({ className = "" }: { className?: string }) {
  return (
    <svg className={`sparkle-border ${className}`} aria-hidden="true">
      <style>{css}</style>
      <defs>
        <filter id="spark-halo">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      {/* Static background border */}
      <rect rx="8" ry="8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {/* Spark trail 1 */}
      <rect rx="8" ry="8" fill="none" stroke="rgba(255,106,26,0.7)" strokeWidth="0.5" strokeDasharray="7.5 92.5" vectorEffect="non-scaling-stroke" filter="url(#spark-halo)" className="spark-head" />
      {/* Spark trail 2 (mirrored, delayed) */}
      <rect rx="8" ry="8" fill="none" stroke="rgba(255,106,26,0.7)" strokeWidth="0.5" strokeDasharray="7.5 92.5" vectorEffect="non-scaling-stroke" filter="url(#spark-halo)" className="spark-head spark-mirror" />
    </svg>
  );
}

const css = `
.sparkle-border {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}
.spark-head {
  animation: spark-trail 12s linear infinite;
}
.spark-mirror {
  animation-delay: -6s;
}
@keyframes spark-trail {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -100px; }
}
`;
