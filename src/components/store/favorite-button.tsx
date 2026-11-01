"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useFavorites } from "@/lib/store/favorites";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  listingId: string;
  listingTitle?: string;
  /** "card" = lingkaran kaca di pojok gambar, "detail" = tombol outline besar. */
  variant?: "card" | "detail";
  className?: string;
}

/** Tombol favorit — menambah/menghapus listing dari daftar favorit (localStorage). */
export function FavoriteButton({
  listingId,
  listingTitle,
  variant = "card",
  className,
}: FavoriteButtonProps) {
  const mounted = useMounted();
  const isFavorite = useFavorites((s) => s.ids.includes(listingId));
  const toggle = useFavorites((s) => s.toggle);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const willFavorite = !isFavorite;
    toggle(listingId);
    if (willFavorite) {
      toast.success("Ditambahkan ke favorit", {
        description: listingTitle,
      });
    } else {
      toast("Dihapus dari favorit", { description: listingTitle });
    }
  }

  const active = mounted && isFavorite;

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={active}
        aria-label={active ? "Hapus dari favorit" : "Tambahkan ke favorit"}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 font-medium transition-all active:scale-[0.98]",
          active
            ? "glass-red text-brand"
            : "glass text-foreground hover:border-white/25",
          className,
        )}
      >
        <Heart className={cn("h-5 w-5", active && "fill-brand text-brand")} />
        <span className="text-sm">{active ? "Tersimpan" : "Favorit"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={active}
      aria-label={active ? "Hapus dari favorit" : "Tambahkan ke favorit"}
      className={cn(
        "absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full glass-strong transition-all hover:scale-105 active:scale-95",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-[18px] w-[18px] transition-colors",
          active ? "fill-brand text-brand" : "text-foreground/80",
        )}
      />
    </button>
  );
}
