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
    .from("site_settings")
    .select("maintenance_enabled, maintenance_message, maintenance_eta, maintenance_duration_seconds, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "Gagal mengambil pengaturan website." },
      { status: 500 }
    );
  }

  return NextResponse.json({ settings: data });
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
    maintenance_enabled?: boolean;
    maintenance_message?: string;
    maintenance_duration_seconds?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 }
    );
  }

  if (
    typeof body.maintenance_enabled !== "boolean" ||
    typeof body.maintenance_message !== "string" ||
    body.maintenance_message.trim().length < 1 ||
    body.maintenance_message.length > 1000 ||
    typeof body.maintenance_duration_seconds !== "number" ||
    !Number.isInteger(body.maintenance_duration_seconds) ||
    body.maintenance_duration_seconds < 1 ||
    body.maintenance_duration_seconds > 604800
  ) {
    return NextResponse.json(
      { error: "Data pengaturan Maintenance tidak valid." },
      { status: 400 }
    );
  }

  const { data: current, error: readError } = await auth.supabase
    .from("site_settings")
    .select("maintenance_enabled, maintenance_eta")
    .eq("id", 1)
    .maybeSingle();

  if (readError || !current) {
    return NextResponse.json(
      { error: "Gagal membaca pengaturan Maintenance." },
      { status: 500 }
    );
  }

  const currentEta = current.maintenance_eta
    ? new Date(current.maintenance_eta).getTime()
    : 0;

  const startingMaintenance =
    body.maintenance_enabled &&
    (!current.maintenance_enabled ||
      !Number.isFinite(currentEta) ||
      currentEta <= Date.now());

  const maintenanceEta = !body.maintenance_enabled
    ? null
    : startingMaintenance
      ? new Date(
          Date.now() + body.maintenance_duration_seconds * 1000
        ).toISOString()
      : current.maintenance_eta;

  const { data, error } = await auth.supabase
    .from("site_settings")
    .update({
      maintenance_enabled: body.maintenance_enabled,
      maintenance_message: body.maintenance_message.trim(),
      maintenance_duration_seconds: body.maintenance_duration_seconds,
      maintenance_eta: maintenanceEta,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select("maintenance_enabled, maintenance_message, maintenance_eta, maintenance_duration_seconds, updated_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan Maintenance." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Pengaturan website tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ settings: data });
}
