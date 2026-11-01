import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { CategoryCard } from "@/components/store/category-card";
import { SectionHeading } from "@/components/store/section-heading";
import { GAME_CATEGORIES } from "@/lib/games";

export const metadata: Metadata = {
  title: "Kategori Game",
  description:
    "Telusuri akun game berdasarkan kategori: Free Fire, Mobile Legends, PUBG Mobile, Roblox, Genshin Impact, dan game lainnya.",
};

export default function CategoryIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <SectionHeading
        id="kategori-index-heading"
        icon={LayoutGrid}
        title="Semua Kategori Game"
        subtitle="Setiap kategori memiliki kurasi akun dan filter harga tersendiri"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-3">
        {GAME_CATEGORIES.map((game) => (
          <CategoryCard key={game.slug} game={game} />
        ))}
      </div>

      <div className="mt-10 rounded-2xl glass liquid-sheen p-5 md:p-7">
        <h2 className="font-display text-lg font-bold">Tidak menemukan game-mu?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Kategori “Game Lainnya” mencakup eFootball, Call of Duty Mobile, Valorant,
          dan banyak lagi. Kamu juga bisa langsung mencari judul game tertentu lewat
          halaman katalog.
        </p>
        <Link
          href="/katalog"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-all hover:bg-brand-strong active:scale-[0.98]"
        >
          Buka Semua Listing
        </Link>
      </div>
    </div>
  );
}
