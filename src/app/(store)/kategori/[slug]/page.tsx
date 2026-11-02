import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ListingBrowser } from "@/components/store/listing-browser";
import { GAME_CATEGORIES, getGame } from "@/lib/games";
import { searchListings } from "@/lib/listings";
import type { GameSlug } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return GAME_CATEGORIES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return { title: "Kategori tidak ditemukan" };
  return {
    title: `Akun ${game.name}`,
    description: `Kumpulan akun ${game.name} terkurasi di ZERO STORE — ${game.tagline}.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  const supabase = await createClient();
  const { data: category } = await supabase
    .from("game_categories")
    .select("active")
    .eq("slug", slug)
    .maybeSingle();

  if (!category?.active) notFound();

  const { data: activeCategories } = await supabase
    .from("game_categories")
    .select("slug")
    .eq("active", true);

  const activeSlugs = new Set(
    (activeCategories ?? []).map((category) => category.slug)
  );

  const visibleCategories = GAME_CATEGORIES.filter(
    (item) => item.slug !== game.slug && activeSlugs.has(item.slug)
  );

  const listings = searchListings({ game: slug as GameSlug, includeSold: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      {/* Banner kategori */}
      <section className="relative isolate overflow-hidden rounded-3xl">
        <Image
          src={game.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
        <div className="relative p-6 md:p-10">
          <Link
            href="/kategori"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Semua kategori
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Akun {game.name}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {game.tagline}. Gunakan filter harga dan urutan untuk menemukan akun
            yang paling pas dengan budget-mu.
          </p>
        </div>
      </section>

      <div className="mt-6 md:mt-8">
        <ListingBrowser
          listings={listings}
          emptyTitle={`Belum ada akun ${game.name} yang tersedia`}
          emptyDescription="Silakan kembali lagi nanti, atau jelajahi kategori lainnya di katalog utama."
        />
      </div>

      {/* Kategori lain */}
      <nav aria-label="Kategori lainnya" className="mt-10">
        <h2 className="font-display text-lg font-bold">Kategori lainnya</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {visibleCategories.map((g) => (
            <Link
              key={g.slug}
              href={`/kategori/${g.slug}`}
              className="rounded-full glass px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              {g.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
