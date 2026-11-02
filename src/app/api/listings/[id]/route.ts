import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const { data: listing, error: findError } = await supabase
    .from("listings")
    .select("id, owner_id, status, image_paths")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (findError || !listing) {
    return NextResponse.json(
      { error: "Listing tidak ditemukan." },
      { status: 404 }
    );
  }

  if (!["draft", "ditolak"].includes(listing.status)) {
    return NextResponse.json(
      { error: "Hanya listing draft atau ditolak yang bisa dihapus." },
      { status: 403 }
    );
  }

  const { error: deleteError } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Gagal menghapus listing." },
      { status: 500 }
    );
  }

  const paths = Array.isArray(listing.image_paths)
    ? listing.image_paths.filter(
        (path): path is string =>
          typeof path === "string" && path.startsWith(`${user.id}/`)
      )
    : [];

  if (paths.length) {
    await supabase.storage.from("listing-images").remove(paths);
  }

  return NextResponse.json({ success: true });
}
