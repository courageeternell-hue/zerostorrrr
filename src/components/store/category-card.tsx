import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { countByGame } from "@/lib/listings";
import type { GameCategory } from "@/lib/types";

/** Kartu kategori game bergaya glassmorphism. */
export function CategoryCard({ game }: { game: GameCategory }) {
  return (
    <Link
      href={`/kategori/${game.slug}`}
      className="group relative block overflow-hidden rounded-2xl glass liquid-sheen transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:aspect-[4/3]">
        <Image
          src={game.image}
          alt={`Kategori ${game.name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
        />
        <ArrowUpRight
          aria-hidden
          className="absolute right-3 top-3 h-4 w-4 text-white/0 transition-all duration-300 group-hover:text-white/90"
        />
        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
          <h3 className="font-display text-sm font-bold text-white md:text-base">{game.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-white/70 md:text-xs">
            {game.tagline}
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-brand">{countByGame(game.slug)} akun aktif</p>
        </div>
      </div>
    </Link>
  );
}
