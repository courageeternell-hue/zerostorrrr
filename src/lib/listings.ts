import type { GameSlug, Listing, Seller } from "@/lib/types";

/* =====================================================================
 * ⚠️  DATA DEMO — BUKAN DATABASE SUNGGUHAN
 * ---------------------------------------------------------------------
 * Seluruh listing di file ini adalah CONTOH (dummy) yang dibuat untuk
 * keperluan pengembangan frontend. Ini BUKAN listing dari penjual nyata.
 *
 * Saat backend tersedia (mis. Supabase), ganti fungsi-fungsi query di
 * file ini dengan fetch ke API server. Bentuk data mengikuti tipe di
 * `src/lib/types.ts` sehingga UI tidak perlu banyak perubahan.
 * ===================================================================== */

function daysAgo(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 24, 0, 0);
  return d.toISOString();
}

const SELLERS: Record<string, Seller> = {
  rizky: {
    id: "slr-rizky",
    name: "Rizky Pratama",
    joinedAt: "2024-03-11T00:00:00.000Z",
    rating: 4.9,
    totalSales: 128,
    verified: true,
    responseMinutes: 5,
  },
  dewa: {
    id: "slr-dewa",
    name: "DewaGaming Store",
    joinedAt: "2023-11-02T00:00:00.000Z",
    rating: 4.8,
    totalSales: 342,
    verified: true,
    responseMinutes: 8,
  },
  andre: {
    id: "slr-andre",
    name: "Andre Valian",
    joinedAt: "2024-07-19T00:00:00.000Z",
    rating: 4.7,
    totalSales: 47,
    verified: false,
    responseMinutes: 15,
  },
  siti: {
    id: "slr-siti",
    name: "Siti Rahma",
    joinedAt: "2023-08-25T00:00:00.000Z",
    rating: 4.9,
    totalSales: 210,
    verified: true,
    responseMinutes: 4,
  },
  bima: {
    id: "slr-bima",
    name: "Bima Aryasatya",
    joinedAt: "2025-01-30T00:00:00.000Z",
    rating: 4.6,
    totalSales: 19,
    verified: false,
    responseMinutes: 25,
  },
  cyber: {
    id: "slr-cyber",
    name: "CyberPoint ID",
    joinedAt: "2023-05-14T00:00:00.000Z",
    rating: 4.8,
    totalSales: 501,
    verified: true,
    responseMinutes: 3,
  },
  nadia: {
    id: "slr-nadia",
    name: "Nadia Putri",
    joinedAt: "2024-09-08T00:00:00.000Z",
    rating: 4.8,
    totalSales: 88,
    verified: false,
    responseMinutes: 10,
  },
  joshua: {
    id: "slr-joshua",
    name: "Joshua Halim",
    joinedAt: "2025-04-21T00:00:00.000Z",
    rating: 4.5,
    totalSales: 12,
    verified: false,
    responseMinutes: 30,
  },
};

export const DEMO_LISTINGS: Listing[] = [
  // ── Free Fire ──────────────────────────────────────────────
  {
    id: "ff-001",
    title: "Akun FF Sultan — Bundle Chrono & 32 Skin Epik",
    game: "free-fire",
    price: 1250000,
    description:
      "Akun Free Fire level 68 dengan koleksi skin lengkap. Bundle Chrono masih tersedia, Elite Pass terkumpul penuh sejak 2023, dan 8 emote langka siap dipakai. Akun terikat pada email dan Facebook yang akan diserahkan lengkap beserta akses recovery-nya setelah pembayaran terverifikasi.",
    images: ["/images/game-free-fire-1.jpg", "/images/game-free-fire-2.jpg"],
    level: 68,
    rank: "Heroik",
    server: "Indonesia",
    skinCount: 32,
    highlights: ["Bundle Chrono", "32 skin epik", "Elite Pass 2023–2025", "8 emote langka"],
    binding: "Full akses email & Facebook",
    createdAt: daysAgo(2, 13),
    featured: true,
    status: "tersedia",
    views: 1243,
    seller: SELLERS.cyber,
  },
  {
    id: "ff-002",
    title: "Akun Free Fire Level 55 — Rank Grandmaster",
    game: "free-fire",
    price: 450000,
    description:
      "Akun FF dengan push rank Grandmaster musim ini. Sudah terdapat 12 skin senjata dan karakter aktif hingga Maxwell. Cocok untuk kamu yang ingin langsung push ranked tanpa grinding dari nol.",
    images: ["/images/game-free-fire-2.jpg", "/images/game-free-fire-1.jpg"],
    level: 55,
    rank: "Grandmaster",
    server: "Indonesia",
    skinCount: 12,
    highlights: ["Rank GM musim ini", "12 skin senjata", "Karakter aktif lengkap"],
    binding: "Akses email jual",
    createdAt: daysAgo(5, 9),
    status: "tersedia",
    views: 512,
    seller: SELLERS.rizky,
  },
  {
    id: "ff-003",
    title: "Akun FF Starter Murah — Siap Naik Rank",
    game: "free-fire",
    price: 85000,
    description:
      "Akun starter Free Fire level 32 dengan 3 skin senjata dasar. Pilihan tepat untuk akun kedua atau pemain baru yang ingin mencoba ranked dengan modal kecil.",
    images: ["/images/game-free-fire-1.jpg", "/images/game-free-fire-2.jpg"],
    level: 32,
    rank: "Gold IV",
    server: "Indonesia",
    skinCount: 3,
    highlights: ["Level 32", "3 skin dasar", "Siap ranked"],
    binding: "Guest binding, siap bind email",
    createdAt: daysAgo(1, 20),
    status: "tersedia",
    views: 96,
    seller: SELLERS.bima,
  },
  {
    id: "ff-004",
    title: "Akun FF Koleksi Faded Wheel Lengkap",
    game: "free-fire",
    price: 890000,
    description:
      "Koleksi bundle Faded Wheel dari beberapa musim, total 24 skin. Akun ini sudah terjual dan dipertahankan sebagai contoh arsip listing pada data demo.",
    images: ["/images/game-free-fire-2.jpg", "/images/game-free-fire-1.jpg"],
    level: 61,
    rank: "Heroik",
    server: "Indonesia",
    skinCount: 24,
    highlights: ["Faded Wheel x5 musim", "24 skin", "Bundle langka"],
    createdAt: daysAgo(12, 15),
    featured: true,
    status: "terjual",
    views: 1876,
    seller: SELLERS.dewa,
  },

  // ── Mobile Legends ─────────────────────────────────────────
  {
    id: "ml-001",
    title: "Akun ML Mythical Glory — 89 Skin, 98 Hero",
    game: "mobile-legends",
    price: 1800000,
    description:
      "Akun Mobile Legends Mythical Glory dengan koleksi besar: 89 skin (termasuk skin Collector dan Legend), 98 hero, dan emblem max. Binding Moonton diserahkan penuh beserta email utamanya. Sangat cocok untuk content creator atau pro player.",
    images: ["/images/game-mobile-legends-1.jpg", "/images/game-mobile-legends-2.jpg"],
    level: 60,
    rank: "Mythical Glory",
    server: "S16 (Indonesia)",
    skinCount: 89,
    heroCount: 98,
    highlights: ["Mythical Glory", "Skin Collector x3", "98 hero", "Emblem max"],
    binding: "Full akses Moonton + email",
    createdAt: daysAgo(3, 11),
    featured: true,
    status: "tersedia",
    views: 2107,
    seller: SELLERS.siti,
  },
  {
    id: "ml-002",
    title: "Akun ML Legend II — 42 Hero, 18 Skin",
    game: "mobile-legends",
    price: 320000,
    description:
      "Akun ML di rank Legend II dengan roster 42 hero dan 18 skin. Semua hero meta musim ini sudah dimiliki. Akun siap pakai untuk push Mythic.",
    images: ["/images/game-mobile-legends-2.jpg", "/images/game-mobile-legends-1.jpg"],
    level: 47,
    rank: "Legend II",
    server: "Indonesia",
    skinCount: 18,
    heroCount: 42,
    highlights: ["Legend II", "42 hero", "Hero meta lengkap"],
    binding: "Binding Moonton jual",
    createdAt: daysAgo(4, 16),
    status: "tersedia",
    views: 431,
    seller: SELLERS.nadia,
  },
  {
    id: "ml-003",
    title: "Akun ML Epic — Kolaborasi Kimetsu & KOF",
    game: "mobile-legends",
    price: 675000,
    description:
      "Akun ML rank Epic dengan skin kolaborasi langka: Kimetsu no Yaiba dan KOF. Total 31 skin dengan beberapa skin Starlight yang sudah tidak bisa didapatkan lagi.",
    images: ["/images/game-mobile-legends-1.jpg", "/images/game-mobile-legends-2.jpg"],
    level: 52,
    rank: "Epic I",
    server: "Indonesia",
    skinCount: 31,
    heroCount: 66,
    highlights: ["Skin kolaborasi Kimetsu", "Skin KOF", "Starlight terkumpul"],
    binding: "Full akses Moonton",
    createdAt: daysAgo(9, 14),
    status: "tersedia",
    views: 987,
    seller: SELLERS.dewa,
  },
  {
    id: "ml-004",
    title: "Akun ML Starter Master — Cocok Pemula",
    game: "mobile-legends",
    price: 95000,
    description:
      "Akun pemula rank Master dengan 14 hero dasar. Harga paling ramah kantong untuk mulai bermain Mobile Legends dengan akun sendiri.",
    images: ["/images/game-mobile-legends-2.jpg", "/images/game-mobile-legends-1.jpg"],
    level: 28,
    rank: "Master",
    server: "Indonesia",
    skinCount: 4,
    heroCount: 14,
    highlights: ["14 hero", "Harga pelajar", "Akun bersih"],
    createdAt: daysAgo(1, 8),
    status: "tersedia",
    views: 154,
    seller: SELLERS.joshua,
  },

  // ── PUBG Mobile ────────────────────────────────────────────
  {
    id: "pm-001",
    title: "Akun PUBGM Conqueror — Mythic Fashion x21",
    game: "pubg-mobile",
    price: 2100000,
    description:
      "Akun PUBG Mobile tier Conqueror dengan 21 set fashion Mythic dan senjata upgrade Gunung Glacier level max. Include UC sisa 1.800. Akun ini adalah koleksi pribadi yang dirawat sejak musim pertama.",
    images: ["/images/game-pubg-mobile-1.jpg", "/images/game-pubg-mobile-2.jpg"],
    level: 74,
    rank: "Conqueror",
    server: "ASIA (Indonesia)",
    skinCount: 21,
    highlights: ["Tier Conqueror", "Fashion Mythic x21", "M416 Glacier max", "UC sisa 1.800"],
    binding: "Full akses Google + Twitter",
    createdAt: daysAgo(6, 19),
    featured: true,
    status: "tersedia",
    views: 3245,
    seller: SELLERS.cyber,
  },
  {
    id: "pm-002",
    title: "Akun PUBGM Crown III — Fokus Senjata Upgrade",
    game: "pubg-mobile",
    price: 780000,
    description:
      "Akun PUBGM Crown III dengan fokus koleksi senjata upgrade. Cocok untuk pemain serius yang mengutamakan performa dibanding fashion.",
    images: ["/images/game-pubg-mobile-2.jpg", "/images/game-pubg-mobile-1.jpg"],
    level: 63,
    rank: "Crown III",
    server: "ASIA (Indonesia)",
    skinCount: 9,
    highlights: ["Crown III", "Senjata upgrade x2", "Royale Pass aktif"],
    createdAt: daysAgo(8, 12),
    status: "tersedia",
    views: 764,
    seller: SELLERS.andre,
  },
  {
    id: "pm-003",
    title: "Akun PUBGM Ace — 12 Outfit Epik",
    game: "pubg-mobile",
    price: 425000,
    description:
      "Akun PUBGM tier Ace dengan 12 outfit epik dan beberapa emote populer. Akun bersih tanpa riwayat ban, binding email utama akan diserahkan.",
    images: ["/images/game-pubg-mobile-1.jpg", "/images/game-pubg-mobile-2.jpg"],
    level: 58,
    rank: "Ace Dominator",
    server: "ASIA (Indonesia)",
    skinCount: 12,
    highlights: ["Tier Ace", "Outfit epik x12", "Akun bersih"],
    createdAt: daysAgo(2, 22),
    status: "tersedia",
    views: 388,
    seller: SELLERS.joshua,
  },

  // ── Roblox ─────────────────────────────────────────────────
  {
    id: "rb-001",
    title: "Akun Roblox Aged 2017 + 12.500 Robux",
    game: "roblox",
    price: 950000,
    description:
      "Akun Roblox tahun 2017 (aged account) dengan saldo 12.500 Robux, membership Premium aktif, dan 6 item limited. Akun tua seperti ini sangat stabil untuk trading item di dalam game.",
    images: ["/images/game-roblox-1.jpg", "/images/game-roblox-2.jpg"],
    highlights: ["Aged 2017", "Robux 12.500", "Premium aktif", "Item limited x6"],
    binding: "Full akses email 2017",
    createdAt: daysAgo(7, 10),
    featured: true,
    status: "tersedia",
    views: 1522,
    seller: SELLERS.dewa,
  },
  {
    id: "rb-002",
    title: "Akun Roblox Adopt Me — Koleksi Pet Neon Mega",
    game: "roblox",
    price: 310000,
    description:
      "Akun Roblox dengan inventaris Adopt Me penuh: beberapa pet Neon dan Mega lengkap dengan inventory pet food. Cocok untuk penggemar game pet trading.",
    images: ["/images/game-roblox-2.jpg", "/images/game-roblox-1.jpg"],
    highlights: ["Pet Neon x4", "Pet Mega x2", "Inventaris penuh"],
    createdAt: daysAgo(10, 17),
    status: "tersedia",
    views: 652,
    seller: SELLERS.nadia,
  },
  {
    id: "rb-003",
    title: "Akun Roblox Blox Fruits — Level Max, Kit Lengkap",
    game: "roblox",
    price: 540000,
    description:
      "Akun Roblox fokus Blox Fruits dengan level max, semua fruit langka sudah terkumpul, dan race V4. Siap raid sea event tanpa grinding lagi.",
    images: ["/images/game-roblox-1.jpg", "/images/game-roblox-2.jpg"],
    highlights: ["Blox Fruits max", "Fruit langka lengkap", "Race V4"],
    createdAt: daysAgo(3, 21),
    status: "tersedia",
    views: 812,
    seller: SELLERS.andre,
  },

  // ── Genshin Impact ─────────────────────────────────────────
  {
    id: "gi-001",
    title: "Akun Genshin AR60 — 18 Karakter 5★",
    game: "genshin-impact",
    price: 2450000,
    description:
      "Akun Genshin Impact Adventure Rank 60 dengan 18 karakter 5★ dan 22 senjata 5★. Spiral Abyss 12★ konsisten, eksplorasi region hampir 100%. Akun original owner, siap serah terima data lengkap.",
    images: ["/images/game-genshin-1.jpg", "/images/game-genshin-2.jpg"],
    level: 60,
    rank: "AR60 · Abyss 12★",
    server: "Asia",
    highlights: ["Karakter 5★ x18", "Senjata 5★ x22", "Spiral Abyss 12★", "Eksplorasi ±100%"],
    binding: "Full akses email + Hoyoverse",
    createdAt: daysAgo(5, 15),
    featured: true,
    status: "tersedia",
    views: 2891,
    seller: SELLERS.siti,
  },
  {
    id: "gi-002",
    title: "Akun Genshin AR45 — F2P Friendly Siap Endgame",
    game: "genshin-impact",
    price: 520000,
    description:
      "Akun Genshin AR45 yang ramah untuk pemain F2P. Sudah punya fondasi tim meta dan artefarm mulai stabil. Cocok untuk masuk fase endgame tanpa top-up besar.",
    images: ["/images/game-genshin-2.jpg", "/images/game-genshin-1.jpg"],
    level: 45,
    rank: "AR45 · Abyss 9★",
    server: "Asia",
    highlights: ["AR45", "Tim meta dasar", "Abyss 9★"],
    createdAt: daysAgo(11, 13),
    status: "tersedia",
    views: 474,
    seller: SELLERS.bima,
  },
  {
    id: "gi-003",
    title: "Akun Genshin AR55 — Dupe Ayaka & Hu Tao",
    game: "genshin-impact",
    price: 1150000,
    description:
      "Akun Genshin AR55 dengan constelasi Ayaka C1 dan Hu Tao C1, plus senjata signature keduanya. Nilai investasi bagus untuk pencinta karakter cryo dan pyro.",
    images: ["/images/game-genshin-1.jpg", "/images/game-genshin-2.jpg"],
    level: 55,
    rank: "AR55 · Abyss 11★",
    server: "Asia",
    highlights: ["Ayaka C1", "Hu Tao C1", "Signature weapon x2"],
    createdAt: daysAgo(14, 9),
    status: "tersedia",
    views: 1105,
    seller: SELLERS.rizky,
  },

  // ── Game Lainnya ───────────────────────────────────────────
  {
    id: "ln-001",
    title: "Akun eFootball 2026 — Tim Penuh Bintang",
    game: "lainnya",
    price: 275000,
    description:
      "Akun eFootball 2026 dengan squad penuh bintang: card epic legenda dan formasi max chemistry. Harga terbaik di kelasnya untuk langsung kompetitif online.",
    images: ["/images/game-lainnya-1.jpg", "/images/game-lainnya-2.jpg"],
    highlights: ["Card epic legenda", "Squad penuh", "Siap online match"],
    createdAt: daysAgo(2, 18),
    status: "tersedia",
    views: 366,
    seller: SELLERS.andre,
  },
  {
    id: "ln-002",
    title: "Akun CODM Legendary — Senjata Mythic x2",
    game: "lainnya",
    price: 1350000,
    description:
      "Akun Call of Duty Mobile rank Legendary dengan 2 senjata Mythic dan battle pass terkumpul sejak season awal. Binding lengkap dan bersih.",
    images: ["/images/game-lainnya-2.jpg", "/images/game-lainnya-1.jpg"],
    highlights: ["Rank Legendary", "Senjata Mythic x2", "BP terkumpul"],
    createdAt: daysAgo(9, 11),
    status: "tersedia",
    views: 934,
    seller: SELLERS.cyber,
  },
  {
    id: "ln-003",
    title: "Akun Valorant Radiant — Koleksi Skin RGX",
    game: "lainnya",
    price: 1600000,
    description:
      "Akun Valorant rank Radiant dengan koleksi skin RGX dan Reaver. Akun ini sudah terjual — dipertahankan sebagai contoh arsip pada data demo.",
    images: ["/images/game-lainnya-1.jpg", "/images/game-lainnya-2.jpg"],
    highlights: ["Rank Radiant", "Skin RGX", "Skin Reaver"],
    createdAt: daysAgo(13, 16),
    status: "terjual",
    views: 1740,
    seller: SELLERS.rizky,
  },
];

/* ================= Query helpers (pure, aman SSR) ================= */

export type SortOption = "terbaru" | "termurah" | "termahal" | "populer";

export interface ListingQuery {
  q?: string;
  game?: GameSlug | "semua";
  sort?: SortOption;
  includeSold?: boolean;
  limit?: number;
}

export function searchListings(query: ListingQuery = {}): Listing[] {
  const q = query.q?.trim().toLowerCase() ?? "";
  let result = DEMO_LISTINGS.filter((l) => {
    if (!query.includeSold && l.status !== "tersedia") return false;
    if (query.game && query.game !== "semua" && l.game !== query.game) return false;
    if (q) {
      const haystack = `${l.title} ${l.description} ${l.highlights.join(" ")} ${l.rank ?? ""} ${l.seller.name}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sort = query.sort ?? "terbaru";
  result = [...result].sort((a, b) => {
    switch (sort) {
      case "termurah":
        return a.price - b.price;
      case "termahal":
        return b.price - a.price;
      case "populer":
        return b.views - a.views;
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });

  return query.limit ? result.slice(0, query.limit) : result;
}

export function getListingById(id: string): Listing | undefined {
  return DEMO_LISTINGS.find((l) => l.id === id);
}

export function countByGame(game: GameSlug): number {
  return DEMO_LISTINGS.filter((l) => l.game === game && l.status === "tersedia").length;
}

/** Listing unggulan (kurasi) yang masih tersedia. */
export function featuredListings(limit = 8): Listing[] {
  return DEMO_LISTINGS.filter((l) => l.featured && l.status === "tersedia").slice(0, limit);
}

/** Listing terbaru. */
export function newestListings(limit = 8): Listing[] {
  return [...DEMO_LISTINGS]
    .filter((l) => l.status === "tersedia")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

/**
 * "Harga terbaik": listing tersedia dengan harga di bawah median
 * kategorinya, diurutkan paling murah dulu.
 */
export function bestValueListings(limit = 6): Listing[] {
  const byGame = new Map<GameSlug, number[]>();
  for (const l of DEMO_LISTINGS) {
    if (l.status !== "tersedia") continue;
    const arr = byGame.get(l.game) ?? [];
    arr.push(l.price);
    byGame.set(l.game, arr);
  }
  const median = new Map<GameSlug, number>();
  for (const [game, prices] of byGame) {
    prices.sort((a, b) => a - b);
    const mid = Math.floor(prices.length / 2);
    median.set(game, prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2);
  }
  return DEMO_LISTINGS.filter((l) => l.status === "tersedia" && l.price <= (median.get(l.game) ?? 0))
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);
}

/** Listing serupa: game sama, id berbeda. */
export function similarListings(listing: Listing, limit = 4): Listing[] {
  return DEMO_LISTINGS.filter(
    (l) => l.game === listing.game && l.id !== listing.id && l.status === "tersedia",
  ).slice(0, limit);
}
