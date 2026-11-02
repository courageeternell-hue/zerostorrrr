import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GameSlug, Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  const { data: activeCategories, error: categoryError } = await supabase
    .from("game_categories")
    .select("slug")
    .eq("active", true);

  if (categoryError) {
    return NextResponse.json(
      { error: "Gagal mengambil kategori aktif." },
      { status: 500 }
    );
  }

  const activeSlugs = (activeCategories ?? []).map((category) => category.slug);

  if (activeSlugs.length === 0) {
    return NextResponse.json({ listings: [] });
  }

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "tayang")
    .in("game", activeSlugs)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil listing." },
      { status: 500 }
    );
  }

  const listings: Listing[] = await Promise.all(
    (data ?? []).map(async (item) => {
      const paths: string[] = Array.isArray(item.image_paths)
        ? item.image_paths
        : [];

      const images = await Promise.all(
        paths.map(async (path) => {
          const { data: signed } = await supabase.storage
            .from("listing-images")
            .createSignedUrl(path, 3600);

          return signed?.signedUrl ?? null;
        })
      );

      const parsedLevel = Number(item.level);

      return {
        id: item.id,
        title: item.title,
        game: item.game as GameSlug,
        price: Number(item.price),
        description: item.description ?? "",
        images: images.filter((url): url is string => Boolean(url)),
        ...(Number.isFinite(parsedLevel) && item.level
          ? { level: parsedLevel }
          : {}),
        ...(item.rank ? { rank: item.rank } : {}),
        skinCount: item.skin_count ?? undefined,
        heroCount: item.hero_count ?? undefined,
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        createdAt: item.created_at,
        featured: false,
        status: "tersedia",
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

  return NextResponse.json({ listings });
}
