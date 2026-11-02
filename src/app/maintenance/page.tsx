import Link from "next/link";
import { Wrench, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import MaintenanceCountdown from "./countdown";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("maintenance_message, maintenance_eta")
    .eq("id", 1)
    .maybeSingle();



  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-5 py-12 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[130px]" />

      <section className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10">
          <Wrench className="h-9 w-9 text-red-500" />
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-red-500">
          ZERO STORE
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          Sedang Maintenance
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/55">
          {data?.maintenance_message ||
            "ZERO STORE sedang dalam pemeliharaan. Kami akan segera kembali dengan pengalaman yang lebih baik."}
        </p>

        <MaintenanceCountdown eta={data?.maintenance_eta ?? null} />

        <div className="mt-9 flex items-center justify-center gap-2 text-xs text-white/35">
          <ShieldCheck className="h-4 w-4" />
          Terima kasih atas kesabaranmu
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-6 text-sm font-semibold text-white/70 transition hover:border-red-500/40 hover:text-white"
        >
          Coba Lagi
        </Link>
      </section>
    </main>
  );
}
