/**
 * The AHOS wordmark, traced from the original logo. The "O" is four tiles:
 * two brand-gray slabs and two brand-orange slabs. The tiles are separate
 * shapes so the motion layer can drop, knock and re-stack them.
 */
export const TILES = [
  { id: "t1", tone: "gray", points: "293,10 385,10 385,52 334,52" },
  { id: "t2", tone: "orange", points: "392,11 434,52 434,151 392,110" },
  { id: "t3", tone: "gray", points: "359,149 409,149 451,192 359,192" },
  { id: "t4", tone: "orange", points: "310,51 353,93 353,191 310,149" },
] as const;

const LETTERS = {
  A: "M11 17H136V184H95V138H53V184H11ZM53 55V99H95V55Z",
  H: "M149 17H191V82H233V17H275V184H233V118H191V184H149Z",
  S: "M464 17H589V55H506V82H589V184H464V146H548V118H464Z",
};

/** Full wordmark. `tiles` adds the data hooks the hero uses. */
export function Logo({ className = "", title = "AHOS", tiles = false }: { className?: string; title?: string; tiles?: boolean }) {
  return (
    <svg className={`logo ${className}`} viewBox="8 6 584 190" role="img" aria-label={title}>
      <path className="logo-ink" fillRule="evenodd" d={`${LETTERS.A}${LETTERS.H}${LETTERS.S}`} />
      <g className="logo-o">
        {TILES.map((t) => (
          <polygon key={t.id} className={`tile tile-${t.tone}`} data-tile={tiles ? t.id : undefined} points={t.points} />
        ))}
      </g>
    </svg>
  );
}

/** Just the "O": the four tiles, used as the hero mark and favicon-like accents. */
export function Mark({ className = "", tiles = false }: { className?: string; tiles?: boolean }) {
  return (
    <svg className={`mark ${className}`} viewBox="285 2 175 198" aria-hidden="true">
      {TILES.map((t) => (
        <g key={t.id} className="tile-g">
          <polygon className={`tile tile-${t.tone}`} data-tile={tiles ? t.id : undefined} points={t.points} />
        </g>
      ))}
    </svg>
  );
}
