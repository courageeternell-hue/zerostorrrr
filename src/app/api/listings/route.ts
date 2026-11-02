import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedGames = [
  "free-fire",
  "mobile-legends",
  "pubg-mobile",
  "roblox",
  "genshin-impact",
  "lainnya",
];

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: partner } = await supabase
    .from("partner_memberships")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!admin && !partner) {
    return NextResponse.json(
      { error: "Hanya admin dan Partner aktif yang boleh menjual akun." },
      { status: 403 }
    );
  }

  const { data: moderation } = await supabase
    .from("user_moderation")
    .select("suspended")
    .eq("user_id", user.id)
    .maybeSingle();

  if (moderation?.suspended) {
    return NextResponse.json(
      { error: "Akun sedang ditangguhkan." },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format data tidak valid." },
      { status: 400 }
    );
  }

  const {
    game, title, price, description, level, rank, server,
    skinCount, heroCount, highlights, imagePaths, status,
  } = body;

  if (
    typeof game !== "string" ||
    !allowedGames.includes(game) ||
    typeof title !== "string" ||
    title.trim().length < 3 ||
    title.length > 90 ||
    typeof price !== "number" ||
    !Number.isInteger(price) ||
    price < 10000 ||
    price > 100000000 ||
    typeof description !== "string" ||
    description.length > 2000 ||
    !["draft", "menunggu_review"].includes(String(status)) ||
    !Array.isArray(imagePaths) ||
    imagePaths.length > 5 ||
    !imagePaths.every(
      (path) =>
        typeof path === "string" &&
        path.startsWith(`${user.id}/`) &&
        !path.includes("..")
    )
  ) {
    return NextResponse.json(
      { error: "Data listing tidak memenuhi ketentuan." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      game,
      title: title.trim(),
      price,
      description,
      level: typeof level === "string" ? level : null,
      rank: typeof rank === "string" ? rank : null,
      server: typeof server === "string" ? server : null,
      skin_count: typeof skinCount === "number" ? skinCount : null,
      hero_count: typeof heroCount === "number" ? heroCount : null,
      highlights: Array.isArray(highlights)
        ? highlights
            .filter((item): item is string => typeof item === "string")
            .slice(0, 6)
        : [],
      image_paths: imagePaths,
      status,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan listing." },
      { status: 500 }
    );
  }

  return NextResponse.json({ listing: data }, { status: 201 });
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil listing." },
      { status: 500 }
    );
  }

  const listings = await Promise.all(
    (data ?? []).map(async (listing) => {
      const paths: string[] = Array.isArray(listing.image_paths)
        ? listing.image_paths
        : [];

      const imageUrls = await Promise.all(
        paths.map(async (path) => {
          const { data: signed } = await supabase.storage
            .from("listing-images")
            .createSignedUrl(path, 3600);

          return signed?.signedUrl ?? null;
        })
      );

      return {
        ...listing,
        image_urls: imageUrls.filter((url): url is string => Boolean(url)),
      };
    })
  );

  return NextResponse.json({ listings });
}
