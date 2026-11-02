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
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data listing." },
      { status: 500 }
    );
  }

  return NextResponse.json({ listings: data ?? [] });
}
