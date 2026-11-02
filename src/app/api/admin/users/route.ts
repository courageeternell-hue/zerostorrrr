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

export async function PATCH(request: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status }
    );
  }

  let body: {
    userId?: string;
    verified?: boolean;
    suspended?: boolean;
    suspensionReason?: string | null;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 }
    );
  }

  const userId = body.userId;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!userId || !uuidPattern.test(userId)) {
    return NextResponse.json(
      { error: "ID penjual tidak valid." },
      { status: 400 }
    );
  }

  const updates: {
    verified?: boolean;
    suspended?: boolean;
    suspension_reason?: string | null;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (typeof body.verified === "boolean") {
    updates.verified = body.verified;
  }

  if (typeof body.suspended === "boolean") {
    updates.suspended = body.suspended;
    updates.suspension_reason = body.suspended
      ? (body.suspensionReason?.trim() || "Ditangguhkan oleh admin")
      : null;
  }

  if (Object.keys(updates).length === 1) {
    return NextResponse.json(
      { error: "Tidak ada perubahan yang dikirim." },
      { status: 400 }
    );
  }

  const { data, error } = await auth.supabase
    .from("user_moderation")
    .upsert(
      {
        user_id: userId,
        ...updates,
      },
      { onConflict: "user_id" }
    )
    .select("user_id, verified, suspended, suspension_reason, updated_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan perubahan status penjual." },
      { status: 500 }
    );
  }

  return NextResponse.json({ moderation: data });
}
