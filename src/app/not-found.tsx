import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      { }
      <img src="/logo.svg" alt="" className="h-14 w-14" />
      <p className="mt-6 font-display text-6xl font-bold text-gradient">404</p>
      <h1 className="mt-3 font-display text-xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Halaman yang kamu cari mungkin sudah dipindahkan, dihapus, atau tidak pernah
        ada. Yuk kembali menjelajah katalog akun.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-strong glow-red"
        >
          Ke Beranda
        </Link>
        <Link
          href="/katalog"
          className="inline-flex h-11 items-center gap-2 rounded-xl glass px-6 text-sm font-semibold transition-colors hover:text-brand"
        >
          <Compass className="h-4 w-4" aria-hidden />
          Jelajahi Katalog
        </Link>
      </div>
    </div>
  );
}
