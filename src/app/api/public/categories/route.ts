import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("game_categories")
    .select("slug, name, tagline, active")
    .eq("active", true)
    .order("name");

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil kategori aktif." },
      { status: 500 }
    );
  }

  return NextResponse.json({ categories: data ?? [] });
}
