import type { Metadata } from "next";
import { PackageOpen } from "lucide-react";
import { ListingBrowser } from "@/components/store/listing-browser";
import type { SortOption } from "@/lib/listings";
import { createClient } from "@/lib/supabase/server";

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
  const sort = VALID_SORTS.includes(sp.sort as SortOption)
    ? (sp.sort as SortOption)
    : "terbaru";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "tayang")
    .order("created_at", { ascending: false });

  if (error) console.error("Gagal mengambil katalog:", error.message);

  const listings = await Promise.all(
    (data ?? []).map(async (item) => {
      const paths: string[] = Array.isArray(item.image_paths) ? item.image_paths : [];
      const images = await Promise.all(
        paths.map(async (path) => {
          const { data: signed } = await supabase.storage
            .from("listing-images")
            .createSignedUrl(path, 3600);
          return signed?.signedUrl ?? null;
        })
      );

      return {
        id: item.id,
        title: item.title,
        game: item.game,
        price: Number(item.price),
        description: item.description ?? "",
        images: images.filter((url): url is string => Boolean(url)),
        level: item.level ?? undefined,
        rank: item.rank ?? undefined,
        skinCount: item.skin_count ?? undefined,
        heroCount: item.hero_count ?? undefined,
        highlights: item.highlights ?? [],
        createdAt: item.created_at,
        featured: false,
        status: "tersedia" as const,
        views: 0,
        seller: {
          id: item.owner_id,
          name: "Penjual ZERO STORE",
          joinedAt: item.created_at,
          rating: 0,
          totalSales: 0,
          verified: false,
          responseMinutes: 0,
        },
      };
    })
  );

  if (sort === "termurah") listings.sort((a, b) => a.price - b.price);
  else if (sort === "termahal") listings.sort((a, b) => b.price - a.price);
  else if (sort === "populer") listings.sort((a, b) => b.views - a.views);

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
