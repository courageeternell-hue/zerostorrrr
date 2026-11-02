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

  const { data: listings, error: listingsError } = await auth.supabase
    .from("listings")
    .select("owner_id, status");

  if (listingsError) {
    return NextResponse.json(
      { error: "Gagal mengambil data penjual." },
      { status: 500 }
    );
  }

  const sellerIds = [
    ...new Set((listings ?? []).map((item) => item.owner_id).filter(Boolean)),
  ];

  if (sellerIds.length === 0) {
    return NextResponse.json({ sellers: [] });
  }

  const { data: moderation, error: moderationError } = await auth.supabase
    .from("user_moderation")
    .select("user_id, verified, suspended, suspension_reason")
    .in("user_id", sellerIds);

  if (moderationError) {
    return NextResponse.json(
      { error: "Gagal mengambil status verifikasi penjual." },
      { status: 500 }
    );
  }

  const sellers = sellerIds.map((id) => {
    const sellerListings = (listings ?? []).filter(
      (item) => item.owner_id === id
    );
    const status = moderation?.find((item) => item.user_id === id);

    return {
      id,
      name: `Penjual ${id.slice(0, 8)}`,
      totalListings: sellerListings.length,
      verified: status?.verified ?? false,
      suspended: status?.suspended ?? false,
      suspensionReason: status?.suspension_reason ?? null,
      rating: null,
      totalSales: null,
    };
  });

  return NextResponse.json({ sellers });
}
