// Generates public/og.png (1200x630) from type and brand colours only. No generated imagery.
// Run: node scripts/og.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const font = readFileSync(join(ROOT, "public/fonts/space-grotesk-latin-700-normal.woff2")).toString("base64");
const grid = Array.from({ length: 26 }, (_, i) => `<path d="M${i * 48} 0V630" stroke="#0a0a0b" stroke-opacity=".07"/>`).join("") +
  Array.from({ length: 14 }, (_, i) => `<path d="M0 ${i * 48}H1200" stroke="#0a0a0b" stroke-opacity=".07"/>`).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><style>@font-face{font-family:SG;src:url(data:font/woff2;base64,${font})}text{font-family:SG,Arial,sans-serif;font-weight:700}</style></defs>
<rect width="1200" height="630" fill="#efe9df"/>${grid}
<rect y="0" width="1200" height="96" fill="#0a0a0b"/>
<text x="72" y="300" font-size="104" letter-spacing="-4" fill="#0a0a0b">We draw your product.</text>
<text x="72" y="410" font-size="104" letter-spacing="-4" fill="#0a0a0b">Then we build it.</text>
<path d="M72 452H1128M72 444V460M1128 444V460" stroke="#ff6a1a" stroke-width="3"/>
<rect y="534" width="1200" height="96" fill="#ff6a1a"/>
<text x="72" y="594" font-size="34" letter-spacing="-1" fill="#0a0a0b">Websites, stores, apps and software. Beirut. ahos.xyz</text>
</svg>`;

const logo = await sharp(join(ROOT, "public/logo.png")).resize({ height: 44 }).toBuffer();
await sharp(Buffer.from(svg)).composite([{ input: logo, left: 72, top: 26 }]).png({ compressionLevel: 9 }).toFile(join(ROOT, "public/og.png"));
console.log("public/og.png written");
