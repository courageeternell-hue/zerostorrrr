import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { GAME_CATEGORIES } from "@/lib/games";

const exploreLinks = [
  { href: "/katalog", label: "Semua Listing" },
  { href: "/katalog?sort=termurah", label: "Harga Terbaik" },
  { href: "/cari", label: "Pencarian" },
  { href: "/kategori", label: "Kategori Game" },
];

const sellLinks = [
  { href: "/jual", label: "Pasang Listing" },
  { href: "/profil?tab=listing", label: "Listing Saya" },
  { href: "/profil?tab=pesanan", label: "Riwayat Pesanan" },
];

const accountLinks = [
  { href: "/favorit", label: "Favorit" },
  { href: "/notifikasi", label: "Notifikasi" },
  { href: "/profil", label: "Profil" },
  { href: "/admin", label: "Zero Store V5)" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-surface/60">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5" aria-label="ZERO STORE">
              { }
              <img src="/logo.svg" alt="" className="h-9 w-9" />
              <span className="font-display text-xl font-bold tracking-wide">
                ZERO<span className="text-brand">STORE</span>
              </span>
            </Link>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden />
              aman — data &amp; terpercaya
            </p>
          </div>

          <nav aria-label="Jelajahi">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/90">
              Jelajahi
            </h3>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Jual akun">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/90">
              Jual Akun
            </h3>
            <ul className="mt-4 space-y-2.5">
              {sellLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Akun">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/90">
              Akun
            </h3>
            <ul className="mt-4 space-y-2.5">
              {accountLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/5 pt-6">
          {GAME_CATEGORIES.map((g) => (
            <Link
              key={g.slug}
              href={`/kategori/${g.slug}`}
              className="text-xs text-muted-foreground/80 transition-colors hover:text-brand"
            >
              Akun {g.name}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs text-muted-foreground/70 md:flex-row md:items-center md:justify-between">
          <p>© 2026 ZERO STORE. Proyek demo — seluruh listing adalah data contoh.</p>
          <p>
            Dibuat dengan Next.js, TypeScript &amp; Tailwind CSS. Siap di-deploy ke Vercel.
          </p>
        </div>
      </div>
    </footer>
  );
}
