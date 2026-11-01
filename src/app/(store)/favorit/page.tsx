"use client";

import Link from "next/link";
import { Heart, Info, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/store/product-card";
import { EmptyState } from "@/components/store/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFavorites } from "@/lib/store/favorites";
import { DEMO_LISTINGS } from "@/lib/listings";
import { useMounted } from "@/hooks/use-mounted";

export default function FavoritesPage() {
  const mounted = useMounted();
  const ids = useFavorites((s) => s.ids);
  const clear = useFavorites((s) => s.clear);

  const listings = mounted ? ids.map((id) => DEMO_LISTINGS.find((l) => l.id === id)).filter(Boolean) : [];
  const favoriteListings = listings as typeof DEMO_LISTINGS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-brand" aria-hidden />
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Favorit Saya
            </h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {mounted
              ? `${favoriteListings.length} akun tersimpan. Pantau perubahan harga di sini.`
              : "Memuat favorit..."}
          </p>
        </div>

        {mounted && favoriteListings.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger
              className="inline-flex h-10 items-center gap-2 rounded-xl glass px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
              aria-label="Hapus semua favorit"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Hapus Semua
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-strong border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display">
                  Hapus semua favorit?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Seluruh {favoriteListings.length} akun akan dihapus dari daftar favorit
                  di browser ini. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/15 bg-transparent hover:bg-white/10 hover:text-foreground">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    clear();
                    toast("Semua favorit dihapus");
                  }}
                  className="bg-brand text-white hover:bg-brand-strong"
                >
                  Ya, Hapus Semua
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <p className="mb-5 flex items-start gap-2 rounded-2xl glass px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
        <span>
          <strong className="text-foreground">Keterbatasan demo:</strong> favorit
          disimpan di <span className="font-mono">localStorage</span> browser ini —
          tidak tersinkron antar perangkat dan hilang jika data browser dihapus.
          Sinkronisasi lintas perangkat membutuhkan backend akun.
        </span>
      </p>

      {!mounted ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : favoriteListings.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Belum ada favorit"
          description="Tekan ikon hati pada kartu akun yang menarik perhatianmu, dan ia akan muncul di sini."
          action={
            <Link
              href="/katalog"
              className="inline-flex h-11 items-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              Jelajahi Katalog
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
          {favoriteListings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
