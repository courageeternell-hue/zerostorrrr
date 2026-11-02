import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-auth";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Context) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status }
    );
  }

  const { id } = await params;

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json(
      { error: "ID listing tidak valid." },
      { status: 400 }
    );
  }

  let body: { status?: string; rejection_reason?: string | null };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const allowedStatuses = ["tayang", "ditolak", "terjual"];

  if (!allowedStatuses.includes(body.status ?? "")) {
    return NextResponse.json(
      { error: "Status listing tidak valid." },
      { status: 400 }
    );
  }

  if (
    body.rejection_reason !== undefined &&
    body.rejection_reason !== null &&
    (typeof body.rejection_reason !== "string" ||
      body.rejection_reason.length > 500)
  ) {
    return NextResponse.json(
      { error: "Alasan penolakan maksimal 500 karakter." },
      { status: 400 }
    );
  }

  const { data, error } = await auth.supabase
    .from("listings")
    .update({
      status: body.status,
      rejection_reason:
        body.status === "ditolak" ? body.rejection_reason ?? null : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui listing." },
      { status: 500 }
    );
  }

  return NextResponse.json({ listing: data });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status }
    );
  }

  const { id } = await params;

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json(
      { error: "ID listing tidak valid." },
      { status: 400 }
    );
  }

  const { data: listing, error: readError } = await auth.supabase
    .from("listings")
    .select("image_paths")
    .eq("id", id)
    .maybeSingle();

  if (readError || !listing) {
    return NextResponse.json(
      { error: "Listing tidak ditemukan." },
      { status: 404 }
    );
  }

  const { error } = await auth.supabase
    .from("listings")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Gagal menghapus listing." },
      { status: 500 }
    );
  }

  if (listing.image_paths?.length) {
    await auth.supabase.storage
      .from("listing-images")
      .remove(listing.image_paths);
  }

  return NextResponse.json({ success: true });
}
