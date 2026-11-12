// Generates public/og.png (1200x630): the traced AHOS wordmark on graphite, plus the tagline.
// Vector shapes only, no generated imagery. Run: node scripts/og.mjs
import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Same shapes as src/components/Mark.tsx (viewBox 8 6 584 190).
const letters = "M11 17H136V184H95V138H53V184H11ZM53 55V99H95V55ZM149 17H191V82H233V17H275V184H233V118H191V184H149ZM464 17H589V55H506V82H589V184H464V146H548V118H464Z";
const tiles = [
  ["#545454", "293,10 385,10 385,52 334,52"],
  ["#ff751f", "392,11 434,52 434,151 392,110"],
  ["#545454", "359,149 409,149 451,192 359,192"],
  ["#ff751f", "310,51 353,93 353,191 310,149"],
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#17181b"/>
<g transform="translate(80 92) scale(1.775)">
  <path fill="#f2f1ed" fill-rule="evenodd" d="${letters}" transform="translate(-8 -6)"/>
  <g transform="translate(-8 -6)">${tiles.map(([c, p]) => `<polygon fill="${c}" points="${p}"/>`).join("")}</g>
</g>
<text x="80" y="508" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="54" letter-spacing="-1.5" fill="#f2f1ed">Design that sells. Code that holds.</text>
<text x="80" y="566" font-family="Arial, sans-serif" font-weight="700" font-size="26" fill="#a7a9ae">Websites, stores, apps and AI. Designed and built in Beirut.</text>
<polygon fill="#ff751f" points="1040,540 1120,540 1140,566 1060,566"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(join(ROOT, "public/og.png"));
console.log("public/og.png written");
