// Generates smaller variants of the work screenshots for responsive srcsets.
// Run: node scripts/images.mjs (outputs are committed in public/work).
import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const shots = ["top-threads", "top-speealigner", "top-julsauto", "top-idotaxi"];
for (const s of shots) {
  for (const w of [480, 640]) {
    await sharp(join(ROOT, "public/work", `${s}.webp`)).resize({ width: w }).webp({ quality: 72 }).toFile(join(ROOT, "public/work", `${s}-${w}.webp`));
  }
}
console.log("work variants written");
