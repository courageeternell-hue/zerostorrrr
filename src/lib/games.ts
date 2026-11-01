import type { GameCategory, GameSlug } from "@/lib/types";

/**
 * Kategori game ZERO STORE.
 * Gambar adalah aset demo yang dibuat khusus (bukan aset resmi penerbit game).
 */
export const GAME_CATEGORIES: GameCategory[] = [
  {
    slug: "free-fire",
    name: "Free Fire",
    tagline: "Battle royale 10 menit penuh aksi",
    image: "/images/game-free-fire-1.jpg",
    active: true,
  },
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    tagline: "MOBA 5v5 favorit Indonesia",
    image: "/images/game-mobile-legends-1.jpg",
    active: true,
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    tagline: "Battle royale taktis grafis realistis",
    image: "/images/game-pubg-mobile-1.jpg",
    active: true,
  },
  {
    slug: "roblox",
    name: "Roblox",
    tagline: "Dunia & game buatan komunitas",
    image: "/images/game-roblox-1.jpg",
    active: true,
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    tagline: "Open world action RPG fantasy",
    image: "/images/game-genshin-1.jpg",
    active: true,
  },
  {
    slug: "lainnya",
    name: "Game Lainnya",
    tagline: "eFootball, CODM, Valorant, dan lainnya",
    image: "/images/game-lainnya-1.jpg",
    active: true,
  },
];

export const GAME_SLUGS = GAME_CATEGORIES.map((g) => g.slug);

export function getGame(slug: string): GameCategory | undefined {
  return GAME_CATEGORIES.find((g) => g.slug === slug);
}

export function gameName(slug: GameSlug): string {
  return getGame(slug)?.name ?? "Game";
}

export function isGameSlug(value: string): value is GameSlug {
  return GAME_SLUGS.includes(value as GameSlug);
}
