import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GameSlug, Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("status", "tayang")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil detail listing." },
      { status: 500 }
    );
  }

  if (!item) {
    return NextResponse.json(
      { error: "Listing tidak ditemukan." },
      { status: 404 }
    );
  }

  const paths: string[] = Array.isArray(item.image_paths)
    ? item.image_paths
    : [];

  const images = await Promise.all(
    paths.map(async (path) => {
      const { data } = await supabase.storage
        .from("listing-images")
        .createSignedUrl(path, 3600);

      return data?.signedUrl ?? null;
    })
  );

  const parsedLevel = Number(item.level);

  const listing: Listing = {
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

  return NextResponse.json({ listing });
}
