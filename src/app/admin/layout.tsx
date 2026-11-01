import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Console",
  description: "Dashboard admin ZERO STORE (demo).",
  robots: { index: false, follow: false },
};

/**
 * Kerangka Admin Console.
 *
 * ⚠️ PERINGATAN ARSITEKTUR (wajib dibaca sebelum produksi):
 * Halaman admin ini adalah RANCANGAN UI. Belum ada autentikasi/otorisasi
 * server yang melindunginya. Sebelum dipakai sungguhan, wajib:
 *   1. Middleware server-side (mis. Next.js middleware + Supabase Auth) yang
 *      memverifikasi peran ADMIN pada setiap request /admin/*.
 *   2. Otorisasi per aksi di server (RBAC), bukan sekadar menyembunyikan
 *      tombol di frontend.
 *   3. Row Level Security (RLS) / policy database agar API tidak bisa dipanggil
 *      langsung oleh pengguna biasa.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-strong border-x-0 border-t-0">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
          <div className="flex items-center gap-3">
            { }
            <img src="/logo.svg" alt="" className="h-8 w-8" />
            <div>
              <p className="font-display text-base font-bold leading-tight tracking-wide">
                ZERO<span className="text-brand">STORE</span>
              </p>
              <p className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                <LayoutDashboard className="h-3 w-3" aria-hidden />
                Admin Console
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-1.5 rounded-full glass px-4 text-sm font-medium transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Kembali ke Toko</span>
            <span className="sm:hidden">Toko</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-4 md:px-6">
        <div
          role="alert"
          className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4"
        >
          <p className="flex items-start gap-2.5 text-xs leading-relaxed text-amber-200 md:text-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              <strong>Halaman ini belum dilindungi autentikasi server.</strong> Ini adalah
              rancangan UI admin. Pada produksi, akses harus dibatasi dengan middleware
              + RBAC di sisi server (mis. Supabase Auth + RLS) —{" "}
              <strong>bukan</strong> dengan menyembunyikan tombol di frontend. Lihat
              README bagian “Integrasi Backend”.
            </span>
          </p>
        </div>
      </div>

      <main className="pb-20">{children}</main>
    </div>
  );
}
