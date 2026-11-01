import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { ListingBrowser } from "@/components/store/listing-browser";
import { Skeleton } from "@/components/ui/skeleton";
import { searchListings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Pencarian",
  description: "Cari akun game berdasarkan judul, rank, skin, atau nama penjual.",
};

function SearchResults({ q }: { q: string }) {
  const listings = searchListings({ q, includeSold: true });
  return (
    <ListingBrowser
      key={q}
      listings={listings}
      initialQuery={q}
      showGameFilter
      emptyTitle={q ? `Tidak ada hasil untuk “${q}”` : "Mulai mencari akun"}
      emptyDescription={
        q
          ? "Periksa ejaan kata kunci, atau coba istilah lain seperti nama rank, jumlah skin, atau nama game."
          : "Gunakan kolom pencarian di atas untuk mencari akun berdasarkan judul, rank, skin, atau penjual."
      }
    />
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <SearchX className="h-5 w-5 text-brand" aria-hidden />
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Hasil Pencarian
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {q ? (
            <>
              Menampilkan akun untuk kata kunci{" "}
              <span className="font-semibold text-foreground">“{q}”</span>
            </>
          ) : (
            "Ketik kata kunci pada kolom filter di bawah untuk mempersempit hasil."
          )}
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <SearchResults q={q} />
      </Suspense>
    </div>
  );
}
