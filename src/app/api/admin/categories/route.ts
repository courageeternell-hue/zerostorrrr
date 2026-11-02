import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-auth";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status }
    );
  }

  const { data, error } = await auth.supabase
    .from("game_categories")
    .select("slug, name, tagline, active, updated_at")
    .order("name");

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil kategori." },
      { status: 500 }
    );
  }

  return NextResponse.json({ categories: data ?? [] });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status }
    );
  }

  let body: { slug?: string; active?: boolean };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 }
    );
  }

  if (
    typeof body.slug !== "string" ||
    typeof body.active !== "boolean"
  ) {
    return NextResponse.json(
      { error: "Slug dan status kategori wajib diisi." },
      { status: 400 }
    );
  }

  const { data, error } = await auth.supabase
    .from("game_categories")
    .update({
      active: body.active,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", body.slug)
    .select("slug, name, active, updated_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan status kategori." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Kategori tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ category: data });
}
