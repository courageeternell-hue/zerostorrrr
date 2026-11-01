"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, User, X } from "lucide-react";
import { SearchBar } from "@/components/store/search-bar";
import { useNotifications } from "@/lib/store/notifications";
import { useAuth } from "@/hooks/use-auth";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-notifications";
import { useMounted } from "@/hooks/use-mounted";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Header premium ZERO STORE.
 * Tombol notifikasi dan tombol profil WAJIB terpisah (tidak digabung).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const mounted = useMounted();
  // Panel pencarian mobile otomatis tertutup saat pindah halaman:
  // state menyimpan pathname saat dibuka, sehingga `open` menjadi false
  // begitu pathname berubah — tanpa perlu setState di dalam effect.
  const [openedAtPath, setOpenedAtPath] = useState<string | null>(null);
  const [searchNonce, setSearchNonce] = useState(0);
  const mobileSearchOpen = openedAtPath !== null && openedAtPath === pathname;
  const readIds = useNotifications((s) => s.readIds);
  const { user, loading: authLoading } = useAuth();

  const unreadCount = mounted
    ? DEMO_NOTIFICATIONS.filter((n) => !n.read && !readIds.includes(n.id)).length
    : 0;

  function toggleMobileSearch() {
    if (mobileSearchOpen) {
      setOpenedAtPath(null);
    } else {
      setSearchNonce((n) => n + 1);
      setOpenedAtPath(pathname);
    }
  }

  return (
    <header className="sticky top-0 z-50 glass-strong border-x-0 border-t-0">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 md:h-16 md:gap-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="ZERO STORE — ke beranda"
        >
          <img src="/logo.svg" alt="" className="h-8 w-8 md:h-9 md:w-9" />
          <span className="font-display text-lg font-bold tracking-wide md:text-xl">
            ZERO<span className="text-brand">STORE</span>
          </span>
        </Link>

        {/* Pencarian desktop */}
        <div className="mx-auto hidden w-full max-w-md md:block">
          <SearchBar />
        </div>

        {/* Aksi kanan */}
        <div className="ml-auto flex items-center gap-1 md:gap-1.5">
          <button
            type="button"
            onClick={toggleMobileSearch}
            aria-expanded={mobileSearchOpen}
            aria-label={mobileSearchOpen ? "Tutup pencarian" : "Buka pencarian"}
            className="rounded-full p-2.5 text-foreground/85 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-ring md:hidden"
          >
            {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {/* Tombol Daftar untuk pengunjung */}
          {mounted && !authLoading && !user && (
            <Link
              href="/daftar"
              className="inline-flex min-h-9 items-center justify-center rounded-full bg-brand px-3 text-xs font-bold text-white transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-ring"
            >
              Daftar
            </Link>
          )}

          {/* Notifikasi (tombol terpisah) */}
          <Link
            href="/notifikasi"
            aria-label={`Notifikasi${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ""}`}
            className="relative rounded-full p-2.5 text-foreground/85 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span
                aria-hidden
                className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white glow-red"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Profil (tombol terpisah) */}
          <Link
            href="/profil"
            aria-label="Profil pengguna"
            className="flex items-center rounded-full transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-ring"
          >
            {mounted && user ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-full glass-red font-display text-sm font-bold text-white">
                {initials(user.name)}
              </span>
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full glass">
                <User className="h-5 w-5 text-foreground/85" />
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Panel pencarian mobile */}
      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-300 md:hidden",
          mobileSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-4 pb-3">
          <SearchBar key={searchNonce} autoFocus onSubmitted={() => setOpenedAtPath(null)} />
        </div>
      </div>
    </header>
  );
}
