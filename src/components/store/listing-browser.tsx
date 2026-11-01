"use client";

import { useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { EmptyState } from "@/components/store/empty-state";
import { GAME_CATEGORIES, gameName } from "@/lib/games";
import { formatRupiah } from "@/lib/format";
import type { GameSlug, Listing } from "@/lib/types";
import type { SortOption } from "@/lib/listings";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "terbaru", label: "Terbaru" },
  { value: "termurah", label: "Harga Terendah" },
  { value: "termahal", label: "Harga Tertinggi" },
  { value: "populer", label: "Terpopuler" },
];

interface ListingBrowserProps {
  /** Daftar dasar (hasil query server/demo) yang akan difilter di klien. */
  listings: Listing[];
  initialQuery?: string;
  initialSort?: SortOption;
  /** Tampilkan chip filter game (dipakai di /katalog). */
  showGameFilter?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Pencarian + filter + sort yang berfungsi penuh di sisi klien. */
export function ListingBrowser({
  listings,
  initialQuery = "",
  initialSort = "terbaru",
  showGameFilter = false,
  emptyTitle = "Tidak ada listing yang cocok",
  emptyDescription = "Coba ubah kata kunci atau filter harga untuk melihat lebih banyak akun.",
}: ListingBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [game, setGame] = useState<GameSlug | "semua">("semua");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cap = Number(maxPrice.replace(/\D/g, ""));
    let result = listings.filter((l) => {
      if (game !== "semua" && l.game !== game) return false;
      if (cap > 0 && l.price > cap) return false;
      if (q) {
        const haystack =
          `${l.title} ${l.description} ${l.highlights.join(" ")} ${l.rank ?? ""} ${l.seller.name}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
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
    return result;
  }, [listings, query, sort, game, maxPrice]);

  return (
    <div>
      {/* Toolbar filter */}
      <div className="rounded-2xl glass p-3 md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex h-11 flex-1 items-center rounded-xl bg-white/5 px-3 ring-1 ring-inset ring-white/10 focus-within:ring-brand/60">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter judul, rank, skin..."
              aria-label="Filter listing"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:hidden"
            />
          </label>
          <label className="flex h-11 items-center rounded-xl bg-white/5 px-3 ring-1 ring-inset ring-white/10 focus-within:ring-brand/60">
            <span className="text-xs text-muted-foreground">Maks</span>
            <input
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
              placeholder="Harga"
              aria-label="Harga maksimum dalam Rupiah"
              className="w-28 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground/70"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Urutkan listing"
            className="h-11 rounded-xl bg-white/5 px-3 text-sm text-foreground outline-none ring-1 ring-inset ring-white/10 focus:ring-brand/60 [&>option]:bg-popover"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {showGameFilter && (
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-0.5">
            <FilterChip active={game === "semua"} onClick={() => setGame("semua")}>
              Semua Game
            </FilterChip>
            {GAME_CATEGORIES.map((g) => (
              <FilterChip
                key={g.slug}
                active={game === g.slug}
                onClick={() => setGame(g.slug)}
              >
                {g.name}
              </FilterChip>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
        listing
        {maxPrice && Number(maxPrice) > 0 && (
          <> · harga ≤ {formatRupiah(Number(maxPrice))}</>
        )}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title={emptyTitle}
          description={emptyDescription}
          className="mt-4"
        />
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
          {filtered.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95",
        active
          ? "bg-brand text-white glow-red"
          : "bg-white/5 text-muted-foreground ring-1 ring-inset ring-white/10 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
