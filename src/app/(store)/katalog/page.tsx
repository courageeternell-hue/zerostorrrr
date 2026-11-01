import type { Metadata } from "next";
import { PackageOpen } from "lucide-react";
import { ListingBrowser } from "@/components/store/listing-browser";
import { searchListings, type SortOption } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Semua Listing",
  description: "Jelajahi seluruh akun game yang tersedia di ZERO STORE dengan filter harga dan urutan.",
};

const VALID_SORTS: SortOption[] = ["terbaru", "termurah", "termahal", "populer"];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const sp = await searchParams;
  const sort = VALID_SORTS.includes(sp.sort as SortOption) ? (sp.sort as SortOption) : "terbaru";
  const listings = searchListings({ includeSold: true, sort });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <PackageOpen className="h-5 w-5 text-brand" aria-hidden />
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Semua Listing
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Seluruh akun game dari semua kategori. Saring dengan kata kunci, harga
          maksimum, dan urutan sesukamu.
        </p>
      </div>
      <ListingBrowser listings={listings} initialSort={sort} showGameFilter />
    </div>
  );
}
