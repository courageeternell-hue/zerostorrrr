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
    .from("partner_applications")
    .select("id, user_id, amount, proof_path, status, admin_note, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil pengajuan Partner." },
      { status: 500 }
    );
  }

  const applications = await Promise.all(
    (data ?? []).map(async (application) => {
      const { data: signed } = await auth.supabase.storage
        .from("partner-payments")
        .createSignedUrl(application.proof_path, 300);

      return {
        ...application,
        proof_url: signed?.signedUrl ?? null,
      };
    })
  );

  return NextResponse.json({ applications });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status }
    );
  }

  const body = await request.json();
  const id = String(body.id ?? "");
  const status = body.status;
  const adminNote =
    typeof body.admin_note === "string"
      ? body.admin_note.trim().slice(0, 500)
      : null;

  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "Data pengajuan tidak valid." },
      { status: 400 }
    );
  }

  const { data: application, error: findError } = await auth.supabase
    .from("partner_applications")
    .select("id, user_id, status")
    .eq("id", id)
    .maybeSingle();

  if (findError || !application) {
    return NextResponse.json(
      { error: "Pengajuan tidak ditemukan." },
      { status: 404 }
    );
  }

  if (application.status !== "pending") {
    return NextResponse.json(
      { error: "Pengajuan ini sudah pernah diproses." },
      { status: 409 }
    );
  }

  if (status === "approved") {
    const { error: membershipError } = await auth.supabase
      .from("partner_memberships")
      .upsert(
        {
          user_id: application.user_id,
          status: "active",
          approved_at: new Date().toISOString(),
          approved_by: auth.user.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (membershipError) {
      return NextResponse.json(
        { error: "Gagal mengaktifkan Partner: " + membershipError.message },
        { status: 500 }
      );
    }
  }

  const { data: updated, error: updateError } = await auth.supabase
    .from("partner_applications")
    .update({
      status,
      admin_note: adminNote,
      reviewed_by: auth.user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending")
    .select("id, user_id, status, admin_note, reviewed_at")
    .maybeSingle();

  if (updateError || !updated) {
    return NextResponse.json(
      { error: "Gagal memperbarui status pengajuan." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    application: updated,
  });
}
