import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const { data: existingPartner, error: partnerError } = await supabase
    .from("partner_memberships")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (partnerError) {
    return NextResponse.json(
      { error: "Gagal memeriksa status Partner." },
      { status: 500 }
    );
  }

  if (existingPartner) {
    return NextResponse.json(
      { error: "Akun ini sudah menjadi Partner aktif." },
      { status: 409 }
    );
  }

  let body: { proofPath?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format data tidak valid." },
      { status: 400 }
    );
  }

  const proofPath = body.proofPath;

  if (
    typeof proofPath !== "string" ||
    !proofPath.startsWith(`${user.id}/`) ||
    proofPath.includes("..") ||
    proofPath.length > 500
  ) {
    return NextResponse.json(
      { error: "Lokasi bukti pembayaran tidak valid." },
      { status: 400 }
    );
  }

  const fileName = proofPath.slice(user.id.length + 1);

  if (!fileName || fileName.includes("/")) {
    return NextResponse.json(
      { error: "Format lokasi bukti pembayaran tidak valid." },
      { status: 400 }
    );
  }

  const { data: proofFile, error: proofError } = await supabase.storage
    .from("partner-payments")
    .list(user.id, { search: fileName, limit: 10 });

  if (proofError || !proofFile?.some((file) => file.name === fileName)) {
    return NextResponse.json(
      { error: "Bukti pembayaran belum ditemukan. Upload ulang bukti transfer." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("partner_applications")
    .insert({
      user_id: user.id,
      amount: 1500000,
      proof_path: proofPath,
      status: "pending",
    })
    .select("id, amount, status, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Pengajuan Partner kamu masih menunggu verifikasi." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Gagal mengirim pengajuan Partner." },
      { status: 500 }
    );
  }

  return NextResponse.json({ application: data }, { status: 201 });
}
