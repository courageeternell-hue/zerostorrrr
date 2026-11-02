"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronLeft,
  Clock3,
  Eye,
  Gamepad2,
  Info,
  Lock,
  PackageX,
  ShieldQuestion,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react";
import { ProductGallery } from "@/components/store/product-gallery";
import { FavoriteButton } from "@/components/store/favorite-button";
import { EmptyState } from "@/components/store/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getGame, gameName } from "@/lib/games";
import { formatDateID, formatRupiah, initials, serviceFee, timeAgo } from "@/lib/format";
import type { Listing } from "@/lib/types";

interface ProductViewProps {
  id: string;
}

/** Detail produk hanya menggunakan listing asli dari Supabase. */
export function ProductView({ id }: ProductViewProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadListing() {
      setLoading(true);
      setListing(null);

      try {
        const response = await fetch(
          `/api/public/listings/${encodeURIComponent(id)}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          if (response.status !== 404) {
            throw new Error("Gagal mengambil detail listing.");
          }
          return;
        }

        const result = await response.json();
        if (active) setListing(result.listing ?? null);
      } catch (error) {
        console.error("Gagal memuat detail produk:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadListing();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Skeleton className="h-6 w-40" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Skeleton className="aspect-[4/3] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <EmptyState
          icon={PackageX}
          title="Listing tidak ditemukan"
          description="Listing tidak tersedia, sudah dihapus, atau belum diterbitkan."
          action={
            <Link
              href="/katalog"
              className="inline-flex h-11 items-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              Jelajahi Katalog
            </Link>
          }
        />
      </div>
    );
  }

  return <ListingProductView listing={listing} />;
}

/* ── Tampilan listing Supabase ────────────────────────────────── */

function ListingProductView({ listing }: { listing: Listing }) {
  const game = getGame(listing.game);
  const fee = serviceFee(listing.price);
  const sold = listing.status === "terjual";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      {/* Breadcrumb + kembali */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/katalog" className="hover:text-foreground">
                Katalog
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/kategori/${listing.game}`} className="hover:text-foreground">
                {gameName(listing.game)}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground" aria-current="page">
              Detail
            </li>
          </ol>
        </nav>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex h-9 items-center gap-1.5 rounded-full glass px-4 text-sm transition-colors hover:text-brand"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Kembali
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Kolom kiri: galeri + deskripsi + info */}
        <div>
          <ProductGallery images={listing.images} title={listing.title} />

          <section aria-labelledby="deskripsi-heading" className="mt-6 rounded-2xl glass liquid-sheen p-5 md:p-6">
            <h2 id="deskripsi-heading" className="font-display text-lg font-bold">
              Deskripsi Akun
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {listing.description}
            </p>
          </section>

          <section aria-labelledby="info-heading" className="mt-4 rounded-2xl glass liquid-sheen p-5 md:p-6">
            <h2 id="info-heading" className="font-display text-lg font-bold">
              Informasi Game &amp; Item
            </h2>
            <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <InfoRow label="Game" value={gameName(listing.game)} />
              {listing.level !== undefined && <InfoRow label="Level" value={`Lv. ${listing.level}`} />}
              {listing.rank && <InfoRow label="Rank / Tier" value={listing.rank} />}
              {listing.server && <InfoRow label="Server" value={listing.server} />}
              {listing.skinCount !== undefined && <InfoRow label="Jumlah skin" value={`${listing.skinCount} skin`} />}
              {listing.heroCount !== undefined && <InfoRow label="Jumlah hero" value={`${listing.heroCount} hero`} />}
              {listing.binding && <InfoRow label="Binding" value={listing.binding} />}
              <InfoRow label="Dipasang" value={timeAgo(listing.createdAt)} />
            </dl>
            {listing.highlights.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {listing.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full glass-red px-3 py-1.5 text-xs font-medium text-white"
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Tips keamanan */}
          <section aria-label="Tips keamanan" className="mt-4 rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <ShieldQuestion className="h-4 w-4" aria-hidden />
              Tips Transaksi Aman
            </h2>
            <ul className="mt-2.5 list-inside list-disc space-y-1 text-xs leading-relaxed text-amber-200/80">
              <li>Selesaikan pembayaran hanya melalui sistem ZERO STORE — pastikan seluruh proses transaksi dilakukan melalui kanal resmi ZERO STORE.</li>
              <li>Jangan pernah meminta atau membagikan password akun game sebelum pembayaran terverifikasi.</li>
              <li>Rekam layar saat proses serah terima akun sebagai bukti.</li>
            </ul>
          </section>
        </div>

        {/* Kolom kanan: ringkasan + penjual (sticky desktop) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="ringkasan-heading" className="rounded-2xl glass-strong liquid-sheen p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/kategori/${listing.game}`}
                className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium transition-colors hover:text-brand"
              >
                <Gamepad2 className="h-3.5 w-3.5 text-brand" aria-hidden />
                {gameName(listing.game)}
              </Link>
              {listing.featured && (
                <span className="inline-flex items-center gap-1 rounded-full glass-red px-3 py-1.5 text-xs font-semibold text-white">
                  <Star className="h-3.5 w-3.5 fill-white" aria-hidden />
                  Unggulan
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" aria-hidden />
                {listing.views} dilihat
              </span>
            </div>

            <h1 className="mt-3 font-display text-xl font-bold leading-snug md:text-2xl">
              {listing.title}
            </h1>

            <p className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              {formatRupiah(listing.price)}
            </p>

            {/* Ringkasan pesanan */}
            <div id="ringkasan-heading" className="mt-5 rounded-xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
              <h2 className="flex items-center gap-1.5 text-sm font-bold">
                <Tag className="h-4 w-4 text-brand" aria-hidden />
                Ringkasan Pesanan
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Harga akun</dt>
                  <dd className="text-foreground">{formatRupiah(listing.price)}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt className="flex items-center gap-1">
                    Biaya layanan
                    <span className="text-[10px] text-muted-foreground/70">(2,5%, min Rp5.000)</span>
                  </dt>
                  <dd className="text-foreground">{formatRupiah(fee)}</dd>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 font-semibold">
                  <dt>Total bayar</dt>
                  <dd className="font-display text-brand">{formatRupiah(listing.price + fee)}</dd>
                </div>
              </dl>
            </div>

            {/* CTA */}
            <div className="mt-5 flex gap-3">
              {sold ? (
                <div
                  aria-disabled
                  className="inline-flex h-12 flex-1 cursor-not-allowed items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-muted-foreground ring-1 ring-inset ring-white/10"
                >
                  Akun Sudah Terjual
                </div>
              ) : (
                <Link
                  href={`/checkout/${listing.id}`}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white transition-all hover:bg-brand-strong active:scale-[0.98] glow-red"
                >
                  Beli Sekarang
                </Link>
              )}
              <FavoriteButton listingId={listing.id} listingTitle={listing.title} variant="detail" />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Tombol “Beli Sekarang” membawamu ke alur checkout — belum ada dana yang
              tertagih di langkah ini.
            </p>
          </section>

          {/* Info penjual */}
          <section aria-labelledby="penjual-heading" className="mt-4 rounded-2xl glass liquid-sheen p-5">
            <h2 id="penjual-heading" className="font-display text-base font-bold">
              Informasi Penjual
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full glass-red font-display text-base font-bold"
              >
                {initials(listing.seller.name)}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-semibold">
                  <span className="truncate">{listing.seller.name}</span>
                  {listing.seller.verified && (
                    <BadgeCheck aria-label="Penjual terverifikasi" className="h-4 w-4 shrink-0 text-brand" />
                  )}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
                  {listing.seller.rating.toFixed(1)} · {listing.seller.totalSales} akun terjual
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/5 px-2 py-2.5">
                <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Respons</dt>
                <dd className="mt-0.5 text-sm font-semibold">±{listing.seller.responseMinutes} mnt</dd>
              </div>
              <div className="rounded-xl bg-white/5 px-2 py-2.5">
                <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Bergabung</dt>
                <dd className="mt-0.5 text-xs font-semibold">
                  {formatDateID(listing.seller.joinedAt).split(" ").slice(-1)}
                </dd>
              </div>
              <div className="rounded-xl bg-white/5 px-2 py-2.5">
                <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Status</dt>
                <dd className="mt-0.5 flex items-center justify-center gap-1 text-xs font-semibold text-emerald-300">
                  <Clock3 className="h-3 w-3" aria-hidden />
                  {sold ? "Arsip" : "Aktif"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 sm:border-0 sm:pb-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

