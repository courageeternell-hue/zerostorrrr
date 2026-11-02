"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingDown, Zap } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import type { Listing } from "@/lib/types";

export function HomeListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadListings() {
      try {
        const response = await fetch("/api/public/listings", {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Gagal mengambil listing");

        const result: { listings?: Listing[] } = await response.json();

        if (active) {
          setListings(Array.isArray(result.listings) ? result.listings : []);
          setError(false);
        }
      } catch {
        if (active) {
          setListings([]);
          setError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadListings();

    return () => {
      active = false;
    };
  }, []);

  const featured = listings.slice(0, 8);
  const newest = listings.slice(8, 16);
  const bestValue = [...listings]
    .sort((a, b) => a.price - b.price)
    .slice(0, 4);

  const emptyMessage = error
    ? "Gagal memuat listing. Coba muat ulang halaman."
    : loading
      ? "Memuat listing..."
      : "Belum ada listing yang tayang.";

  return (
    <>
      <section aria-labelledby="unggulan-heading" className="mt-12 md:mt-16">
        <SectionHeading
          id="unggulan-heading"
          icon={Sparkles}
          title="Listing Pilihan"
          subtitle="Akun game yang tersedia di ZERO STORE"
          actionHref="/katalog"
        />
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:snap-none md:grid-cols-4 md:gap-5 md:px-0">
          {featured.length > 0 ? (
            featured.map((listing, i) => (
              <div
                key={listing.id}
                className="w-[240px] shrink-0 snap-start sm:w-[280px] md:w-auto"
              >
                <ProductCard listing={listing} priority={i < 2} />
              </div>
            ))
          ) : (
            <p className="w-full py-8 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          )}
        </div>
      </section>

      {newest.length > 0 && (
        <section aria-labelledby="terbaru-heading" className="mt-12 md:mt-16">
          <SectionHeading
            id="terbaru-heading"
            icon={Zap}
            title="Listing Lainnya"
            subtitle="Lihat akun lain yang tersedia"
            actionHref="/katalog?sort=terbaru"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {newest.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {bestValue.length > 0 && (
        <section aria-labelledby="harga-heading" className="mt-12 md:mt-16">
          <SectionHeading
            id="harga-heading"
            icon={TrendingDown}
            title="Harga Terbaik"
            subtitle="Listing dengan harga paling terjangkau"
            actionHref="/katalog?sort=termurah"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {bestValue.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
