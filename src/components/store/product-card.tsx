import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Clock, Eye, Star } from "lucide-react";
import { FavoriteButton } from "@/components/store/favorite-button";
import { gameName } from "@/lib/games";
import { formatCompact, formatRupiah, initials, timeAgo } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Kartu produk akun game.
 * Chip informasi ditampilkan sesuai data yang tersedia agar kartu tidak
 * terlihat seragam/kaku (level, rank, jumlah skin, dst. bervariasi).
 */
export function ProductCard({ listing, priority = false }: { listing: Listing; priority?: boolean }) {
  const sold = listing.status === "terjual";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl glass liquid-sheen transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl hover:shadow-black/50",
        sold && "opacity-80",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.images[0]}
          alt={`Gambar akun: ${listing.title}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-[1.04]",
            sold && "grayscale",
          )}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"
        />

        {sold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-black/70 px-4 py-1.5 font-display text-sm font-bold uppercase tracking-widest text-brand backdrop-blur-sm ring-1 ring-brand/60">
              Terjual
            </span>
          </div>
        )}

        {/* Chip game */}
        <span className="absolute left-2 top-2 rounded-full glass-strong px-2.5 py-1 text-[11px] font-medium text-foreground/90">
          {gameName(listing.game)}
        </span>

        {/* Chip unggulan */}
        {listing.featured && !sold && (
          <span className="absolute left-2 top-9 rounded-full glass-red px-2.5 py-1 text-[11px] font-semibold text-white">
            Unggulan
          </span>
        )}

        {!sold && <FavoriteButton listingId={listing.id} listingTitle={listing.title} />}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-foreground/95 md:min-h-10 md:text-[15px]">
          <Link
            href={`/produk/${listing.id}`}
            className="transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-ring"
          >
            {listing.title}
          </Link>
        </h3>

        <p className="font-display text-lg font-bold tracking-tight text-white md:text-xl">
          {formatRupiah(listing.price)}
        </p>

        {/* Info singkat bervariasi sesuai data */}
        <div className="flex flex-wrap gap-1.5">
          {listing.rank && (
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
              {listing.rank}
            </span>
          )}
          {typeof listing.level === "number" && (
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
              Lv {listing.level}
            </span>
          )}
          {typeof listing.skinCount === "number" && (
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
              {listing.skinCount} skin
            </span>
          )}
          {typeof listing.heroCount === "number" && (
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
              {listing.heroCount} hero
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold text-foreground/90"
            >
              {initials(listing.seller.name)}
            </span>
            <span className="truncate">{listing.seller.name}</span>
            {listing.seller.verified && (
              <BadgeCheck aria-label="Penjual terverifikasi" className="h-3.5 w-3.5 shrink-0 text-brand" />
            )}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground/80">
            <Eye className="h-3 w-3" aria-hidden />
            {formatCompact(listing.views)}
          </span>
        </div>

        <Link
          href={`/produk/${listing.id}`}
          className={cn(
            "mt-1 inline-flex h-9 items-center justify-center rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
            sold
              ? "glass text-muted-foreground"
              : "bg-white/5 text-foreground ring-1 ring-inset ring-white/10 hover:bg-brand hover:ring-brand",
          )}
          aria-disabled={sold}
        >
          {sold ? "Lihat Arsip" : "Lihat Detail"}
        </Link>

        <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
          <Clock className="h-3 w-3" aria-hidden />
          {timeAgo(listing.createdAt)}
          {listing.featured && (
            <span className="ml-auto inline-flex items-center gap-0.5 text-brand/80">
              <Star className="h-3 w-3 fill-brand/80" aria-hidden /> Kurasi
            </span>
          )}
        </span>
      </div>
    </article>
  );
}
