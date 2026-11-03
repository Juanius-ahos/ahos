// Fails the build if an em dash appears in source, public text files, or built HTML.
// House rule: no em dashes in any copy. Use a comma, a colon or a full stop.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXT = new Set([".ts", ".tsx", ".css", ".html", ".txt", ".md", ".json", ".xml", ".webmanifest", ".mjs"]);
const dirs = ["src", "public", "index.html", "scripts", ...(process.argv.includes("--dist") ? ["dist"] : [])];
const EM = "—";
const hits = [];

function walk(p) {
  if (!existsSync(p)) return;
  const st = statSync(p);
  if (st.isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  if (!EXT.has(extname(p)) || p.endsWith("check-copy.mjs")) return;
  readFileSync(p, "utf-8").split("\n").forEach((line, i) => { if (line.includes(EM)) hits.push(`${p.replace(ROOT, ".")}:${i + 1}`); });
}
dirs.forEach((d) => walk(join(ROOT, d)));

if (hits.length) {
  console.error(`[check:copy] ${hits.length} em dash(es) found:\n  ${hits.join("\n  ")}`);
  process.exit(1);
}
console.log("[check:copy] no em dashes");
