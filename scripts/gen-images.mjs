/**
 * ZERO STORE — image asset generator (demo assets)
 * Generates consistent dark-premium gaming artwork for demo listings.
 * Run: bun scripts/gen-images.mjs
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "public", "images", "raw");
fs.mkdirSync(OUT_DIR, { recursive: true });

const STYLE =
  "dark premium gaming keyart, black background, glowing crimson red rim lighting, cinematic, high contrast, minimalist composition, ultra detailed, no text, no words, no letters, no watermark, no logo";

const JOBS = [
  {
    file: "hero-bg.png",
    size: "1440x704",
    prompt:
      "wide abstract futuristic esports arena background, black glass panels and subtle smoke, glowing crimson red light streaks on the right side, empty dark space on the left for text, " +
      STYLE,
  },
  {
    file: "sell-banner.png",
    size: "1344x768",
    prompt:
      "two gamer silhouettes exchanging a glowing red gem item between their hands, dramatic red glow, " +
      STYLE,
  },
  {
    file: "game-free-fire-1.png",
    size: "1152x864",
    prompt:
      "elite battle royale soldier character in tactical gear holding rifle, confident pose, " + STYLE,
  },
  {
    file: "game-free-fire-2.png",
    size: "1152x864",
    prompt:
      "battle royale parachute squad dropping over tropical island at dusk, red flare smoke, " + STYLE,
  },
  {
    file: "game-mobile-legends-1.png",
    size: "1152x864",
    prompt:
      "fantasy MOBA heroes team, warrior with glowing sword, mage with red magic orb, assassin in shadow, " + STYLE,
  },
  {
    file: "game-mobile-legends-2.png",
    size: "1152x864",
    prompt:
      "MOBA battlefield lane at night with fantasy turret towers glowing red crystals, " + STYLE,
  },
  {
    file: "game-pubg-mobile-1.png",
    size: "1152x864",
    prompt:
      "special forces soldier with level 3 helmet and assault rifle standing in dramatic smoke, " + STYLE,
  },
  {
    file: "game-pubg-mobile-2.png",
    size: "1152x864",
    prompt:
      "abandoned urban battlefield at dusk with red flare smoke and airdrop crate, " + STYLE,
  },
  {
    file: "game-roblox-1.png",
    size: "1152x864",
    prompt:
      "cute blocky voxel characters adventure squad, 3D render, dark studio background with red neon glow, " + STYLE,
  },
  {
    file: "game-roblox-2.png",
    size: "1152x864",
    prompt:
      "blocky voxel city world at night with neon red lights, 3D render, " + STYLE,
  },
  {
    file: "game-genshin-1.png",
    size: "1152x864",
    prompt:
      "anime fantasy traveler with sword standing on cliff overlooking magical floating city at dusk, crimson accents, anime art, " + STYLE,
  },
  {
    file: "game-genshin-2.png",
    size: "1152x864",
    prompt:
      "anime fantasy character portrait channeling red elemental magic crystals, detailed anime illustration, " + STYLE,
  },
  {
    file: "game-lainnya-1.png",
    size: "1152x864",
    prompt:
      "floating game controller and headset in dark space with red neon light trails, " + STYLE,
  },
  {
    file: "game-lainnya-2.png",
    size: "1152x864",
    prompt:
      "abstract futuristic gaming podium with holographic trophy and red glow, " + STYLE,
  },
];

async function main() {
  const zai = await ZAI.create();
  let ok = 0;
  let fail = 0;
  for (const job of JOBS) {
    const outPath = path.join(OUT_DIR, job.file);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 30000) {
      console.log(`skip (exists): ${job.file}`);
      ok++;
      continue;
    }
    let done = false;
    for (let attempt = 1; attempt <= 3 && !done; attempt++) {
      try {
        const res = await zai.images.generations.create({
          prompt: job.prompt,
          size: job.size,
        });
        const b64 = res?.data?.[0]?.base64;
        if (!b64) throw new Error("empty base64");
        fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
        console.log(`OK: ${job.file}`);
        ok++;
        done = true;
      } catch (err) {
        console.error(`FAIL (${attempt}/3) ${job.file}: ${err.message}`);
        if (attempt === 3) fail++;
        else await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
  }
  console.log(`DONE ok=${ok} fail=${fail}`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
