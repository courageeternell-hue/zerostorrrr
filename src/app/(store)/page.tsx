import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Headphones,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Zap,
} from "lucide-react";
import { SearchBar } from "@/components/store/search-bar";
import { CategoryCard } from "@/components/store/category-card";
import { HomeListings } from "@/components/store/home-listings";
import { SectionHeading } from "@/components/store/section-heading";
import { GAME_CATEGORIES } from "@/lib/games";
import { createClient } from "@/lib/supabase/server";
import { OpeningScreen } from "@/components/store/opening-screen";


export default async function HomePage() {
  const supabase = await createClient();
  const { data: activeCategories, error: categoryError } = await supabase
    .from("game_categories")
    .select("slug")
    .eq("active", true);

  const activeSlugs = new Set(
    (categoryError ? [] : activeCategories ?? []).map((category) => category.slug)
  );
  const visibleCategories = GAME_CATEGORIES.filter((game) =>
    activeSlugs.has(game.slug)
  );
const advantages = [
    {
      icon: ShieldCheck,
      title: "Transaksi Terlindungi",
      description:
        "Dana ditahan sistem escrow dan baru dirilis ke penjual setelah kamu menerima akun dengan aman.",
      soon: true,
    },
    {
      icon: BadgeCheck,
      title: "Penjual Terverifikasi",
      description:
        "Penjual melalui proses verifikasi identitas dan reputasi yang dipantau secara berkelanjutan.",
      soon: true,
    },
    {
      icon: Zap,
      title: "Proses Cepat",
      description:
        "Cari, bandingkan, dan checkout akun dalam beberapa ketukan. Antarmuka ringan di semua jaringan.",
      soon: false,
    },
    {
      icon: Headphones,
      title: "Dukungan 24/7",
      description:
        "Tim dukungan siap membantu setiap kendala transaksi, kapan pun kamu membutuhkannya.",
      soon: true,
    },
  ];

  return (
    <>
      <OpeningScreen />
      <div className="animate-fade-up">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 md:px-6 md:pb-24 md:pt-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-foreground/85">
              <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden />
              Marketplace Jual Beli Akun Game Premium
            </span>

            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
              Temukan Akun Game{" "}
              <span className="text-gradient">Impianmu</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              ZERO STORE menghubungkan penjual dan pembeli akun game dengan harga
              terbaik, katalog terkurasi, dan proses checkout yang jelas. Mulai dari
              akun starter hingga koleksi sultan — semua ada di sini.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/katalog"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-7 text-sm font-semibold text-white transition-all hover:bg-brand-strong active:scale-[0.98] glow-red"
              >
                Jelajahi Akun
              </Link>
              <Link
                href="/jual"
                className="inline-flex h-12 items-center justify-center rounded-xl glass px-7 text-sm font-semibold text-foreground transition-all hover:border-white/25 active:scale-[0.98]"
              >
                Jual Akun
              </Link>
            </div>

            <div className="mt-8 max-w-xl">
              <SearchBar variant="hero" />
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[
                { value: "Live", label: "Listing tayang" },
                { value: `${visibleCategories.length}`, label: "Kategori game populer" },
                { value: "2.5%", label: "Biaya layanan*" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-2xl font-bold text-white md:text-3xl">
                    {stat.value}
                  </dd>
                  <dd className="text-xs text-muted-foreground">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* ── Kategori game ────────────────────────────────── */}
        <section aria-labelledby="kategori-heading" className="mt-2 md:mt-4">
          <SectionHeading
            id="kategori-heading"
            icon={LayoutGrid}
            title="Kategori Game"
            subtitle="Pilih game favoritmu dan telusuri kumpulan akun terkurasi"
            actionHref="/kategori"
            actionLabel="Semua kategori"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-6">
            {visibleCategories.map((game) => (
              <CategoryCard key={game.slug} game={game} />
            ))}
          </div>
        </section>

        <HomeListings />

        {/* ── Banner jual akun ─────────────────────────────── */}
        <section aria-labelledby="jual-banner-heading" className="mt-12 md:mt-16">
          <div className="relative overflow-hidden rounded-3xl glass-red liquid-sheen">
            <div className="relative z-10 grid items-center gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-10 lg:p-12">
              <div>
                <span className="inline-flex items-center rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/85 ring-1 ring-white/20">
                  Untuk Penjual
                </span>
                <h2
                  id="jual-banner-heading"
                  className="mt-3 font-display text-2xl font-bold leading-tight text-white md:text-4xl"
                >
                  Punya Akun Keren? Ubah Jadi Uang.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 md:text-base">
                  Pasang listing akunmu gratis, tentukan hargamu sendiri, dan biarkan
                  ribuan pembeli menemukannya. Kamus harga &amp; tips foto akun
                  tersedia untuk membantumu.
                </p>
                <Link
                  href="/jual"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-white px-7 text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98]"
                >
                  Mulai Jual Sekarang
                </Link>
              </div>
              <div className="relative hidden aspect-[16/9] overflow-hidden rounded-2xl md:block">
                <Image
                  src="/images/sell-banner.jpg"
                  alt="Ilustrasi penjual dan pembeli bertukar akun game"
                  fill
                  sizes="(max-width: 768px) 0px, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Keunggulan ───────────────────────────────────── */}
        <section aria-labelledby="keunggulan-heading" className="mt-12 md:mt-16">
          <SectionHeading
            id="keunggulan-heading"
            icon={ShieldCheck}
            title="Kenapa ZERO STORE?"
            subtitle="Dibangun untuk transaksi yang tenang — bukan sekadar papan iklan"
          />
          <div className="grid gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {advantages.map((adv) => (
              <div
                key={adv.title}
                className="rounded-2xl glass liquid-sheen p-5 transition-colors hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl glass-red">
                    <adv.icon className="h-5 w-5 text-brand" aria-hidden />
                  </span>
                  {adv.soon && (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-white/15">
                      Segera
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-base font-bold">{adv.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
