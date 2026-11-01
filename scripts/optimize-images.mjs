/**
 * Optimasi gambar demo: PNG → JPG terkompresi agar cepat dimuat di mobile.
 * Jalankan: bun scripts/optimize-images.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const RAW = path.join(process.cwd(), "public", "images", "raw");
const OUT = path.join(process.cwd(), "public", "images");
fs.mkdirSync(OUT, { recursive: true });

const JOBS = [
  { file: "hero-bg", width: 1440 },
  { file: "sell-banner", width: 1280 },
  ...[
    "game-free-fire-1",
    "game-free-fire-2",
    "game-mobile-legends-1",
    "game-mobile-legends-2",
    "game-pubg-mobile-1",
    "game-pubg-mobile-2",
    "game-roblox-1",
    "game-roblox-2",
    "game-genshin-1",
    "game-genshin-2",
    "game-lainnya-1",
    "game-lainnya-2",
  ].map((file) => ({ file, width: 960 })),
];

for (const { file, width } of JOBS) {
  const src = path.join(RAW, `${file}.png`);
  const dst = path.join(OUT, `${file}.jpg`);
  if (!fs.existsSync(src)) {
    console.error(`missing: ${src}`);
    continue;
  }
  const buf = await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(dst, buf);
  console.log(`${file}.jpg  ${(buf.length / 1024).toFixed(0)} KB`);
}
console.log("DONE");
