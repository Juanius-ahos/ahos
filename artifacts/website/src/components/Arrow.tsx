/** Drafting arrow: one stroke, one weight, drawn for this site. */
export function Arrow({ dir = "ne", size = 14 }: { dir?: "ne" | "e" | "s"; size?: number }) {
  const rot = dir === "e" ? 45 : dir === "s" ? 135 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transform: `rotate(${rot}deg)`, flex: "none" }}>
      <path d="M3.5 12.5 L12.5 3.5 M5.5 3.5 H12.5 V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}
