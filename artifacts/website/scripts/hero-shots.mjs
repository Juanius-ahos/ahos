// Makes the small captures the homepage device scene needs, from the full-size ones.
//   public/work/d-{shot}.webp (1440 wide)  ->  public/work/h-{shot}-640.webp  (laptop screen)
//   public/work/m-{shot}.webp (390 wide)   ->  public/work/p-{shot}-260.webp  (phone screen)
// Run: node scripts/hero-shots.mjs
import sharp from "sharp";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "work");
const shots = ["issam", "threads", "tavern", "speealigner", "julsauto"];

for (const s of shots) {
  const d = join(root, `d-${s}.webp`);
  const m = join(root, `m-${s}.webp`);
  if (existsSync(d)) {
    await sharp(d).resize(640, 400, { fit: "cover", position: "top" }).webp({ quality: 74, effort: 6 }).toFile(join(root, `h-${s}-640.webp`));
  }
  if (existsSync(m)) {
    await sharp(m).resize(260, 562, { fit: "cover", position: "top" }).webp({ quality: 74, effort: 6 }).toFile(join(root, `p-${s}-260.webp`));
  }
  console.log("ok", s);
}
