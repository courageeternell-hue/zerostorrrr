"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  FileClock,
  LayoutGrid,
  ListOrdered,
  Receipt,
  ShieldAlert,
  ShoppingBag,
  Users,
  XCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/store/empty-state";
import { OrderStatusBadge, UserListingStatusBadge, DemoBadge } from "@/components/store/badges";
import { GAME_CATEGORIES } from "@/lib/games";
import { DEMO_LISTINGS, searchListings } from "@/lib/listings";
import { useUserListings } from "@/lib/store/user-listings";
import { useOrders } from "@/lib/store/orders";
import { useMounted } from "@/hooks/use-mounted";
import { formatCompact, formatDateID, formatRupiah, initials } from "@/lib/format";
import { gameName } from "@/lib/games";
import { cn } from "@/lib/utils";

type Section =
  | "ringkasan"
  | "listing"
  | "pengajuan"
  | "kategori"
  | "pesanan"
  | "pengguna"
  | "laporan";

const NAV: { value: Section; label: string; icon: typeof LayoutGrid }[] = [
  { value: "ringkasan", label: "Ringkasan", icon: LayoutGrid },
  { value: "listing", label: "Kelola Listing", icon: ListOrdered },
  { value: "pengajuan", label: "Pengajuan", icon: FileClock },
  { value: "kategori", label: "Kategori", icon: LayoutGrid },
  { value: "pesanan", label: "Pesanan", icon: ShoppingBag },
  { value: "pengguna", label: "Pengguna", icon: Users },
  { value: "laporan", label: "Laporan", icon: Receipt },
];

const DEMO_REVENUE_PER_GAME = [
  { game: "Free Fire", revenue: 12500000 },
  { game: "Mobile Legends", revenue: 18300000 },
  { game: "PUBG Mobile", revenue: 9800000 },
  { game: "Roblox", revenue: 7200000 },
  { game: "Genshin Impact", revenue: 15400000 },
  { game: "Lainnya", revenue: 6100000 },
];

const DEMO_ORDERS_PER_DAY = [
  { day: "Sen", orders: 14 },
  { day: "Sel", orders: 18 },
  { day: "Rab", orders: 11 },
  { day: "Kam", orders: 22 },
  { day: "Jum", orders: 27 },
  { day: "Sab", orders: 35 },
  { day: "Min", orders: 31 },
];

export default function AdminPage() {
  const mounted = useMounted();
  const [section, setSection] = useState<Section>("ringkasan");
  const userListings = useUserListings((s) => s.listings);
  const updateUserStatus = useUserListings((s) => s.updateStatus);
  const orders = useOrders((s) => s.orders);

  const [categoryState, setCategoryState] = useState(() =>
    Object.fromEntries(GAME_CATEGORIES.map((g) => [g.slug, g.active])),
  );

  const pending = useMemo(
    () => userListings.filter((l) => l.status === "menunggu_review"),
    [userListings],
  );

  const sellers = useMemo(() => {
    const map = new Map<string, typeof DEMO_LISTINGS[number]["seller"]>();
    for (const l of DEMO_LISTINGS) map.set(l.seller.id, l.seller);
    return Array.from(map.values());
  }, []);

  const allListings = searchListings({ includeSold: true, sort: "terbaru" });
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  if (!mounted) {
    return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">Memuat konsol admin…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Navigasi: sidebar desktop, chips mobile */}
      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
        <nav aria-label="Navigasi admin" className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:mb-0 lg:block lg:space-y-1 lg:px-0">
          {NAV.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setSection(item.value)}
              aria-current={section === item.value ? "true" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all lg:w-full",
                section === item.value
                  ? "bg-brand text-white glow-red"
                  : "glass text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
              {item.value === "pengajuan" && pending.length > 0 && (
                <span className="ml-1 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-bold">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          {/* ═══ Ringkasan ═══ */}
          {section === "ringkasan" && (
            <section aria-label="Ringkasan">
              <AdminHeading title="Ringkasan" subtitle="Gambaran singkat kondisi marketplace" />
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
                <StatCard label="Total Listing" value={String(allListings.length + userListings.length)} icon={ListOrdered} note="Demo + lokal" />
                <StatCard label="Tersedia" value={String(allListings.filter((l) => l.status === "tersedia").length)} icon={BadgeCheck} note="Siap dibeli" />
                <StatCard label="Menunggu Review" value={String(pending.length)} icon={FileClock} note="Pengajuan penjual" />
                <StatCard label="Nilai Pesanan Lokal" value={formatRupiah(totalRevenue)} icon={ShoppingBag} note={`${orders.length} pesanan browser`} />
              </div>

              <div className="mt-5 rounded-2xl glass liquid-sheen p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold">Pesanan per Hari</h3>
                  <DemoBadge />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Data statis contoh — laporan nyata dihitung server dari database.
                </p>
                <ChartBox>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEMO_ORDERS_PER_DAY}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: "#9b9ba6", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#9b9ba6", fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                      <Tooltip {...chartTooltip} />
                      <Bar dataKey="orders" name="Pesanan" fill="var(--brand)" radius={[6, 6, 0, 0]} maxBarSize={38} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartBox>
              </div>
            </section>
          )}

          {/* ═══ Kelola Listing ═══ */}
          {section === "listing" && (
            <section aria-label="Kelola listing">
              <AdminHeading
                title="Kelola Listing"
                subtitle="Semua listing di katalog. Aksi server belum aktif (demo)."
              />
              <div className="overflow-x-auto rounded-2xl glass scrollbar-dark">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Listing</th>
                      <th className="px-4 py-3 font-medium">Harga</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Dilihat</th>
                      <th className="px-4 py-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allListings.map((l) => (
                      <tr key={l.id} className="border-b border-white/5 last:border-0">
                        <td className="max-w-[280px] px-4 py-3">
                          <p className="line-clamp-1 font-medium">{l.title}</p>
                          <p className="text-xs text-muted-foreground">{gameName(l.game)}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">{formatRupiah(l.price)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
                              l.status === "tersedia"
                                ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30"
                                : "bg-white/10 text-muted-foreground ring-white/20",
                            )}
                          >
                            {l.status === "tersedia" ? "Tersedia" : "Terjual"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatCompact(l.views)}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => toast.info("Aksi kelola listing membutuhkan backend", { description: "Modifikasi listing harus lewat API server dengan otorisasi admin." })}
                            className="inline-flex h-8 items-center gap-1 rounded-lg bg-white/5 px-3 text-xs font-medium ring-1 ring-inset ring-white/10 transition-colors hover:text-brand"
                          >
                            Kelola
                            <ExternalLink className="h-3 w-3" aria-hidden />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ═══ Pengajuan ═══ */}
          {section === "pengajuan" && (
            <section aria-label="Pengajuan produk">
              <AdminHeading
                title="Pengajuan Listing"
                subtitle="Setujui atau tolak listing dari penjual (aksi tersimpan lokal — demo)."
              />
              {pending.length === 0 ? (
                <EmptyState
                  icon={FileClock}
                  title="Tidak ada pengajuan"
                  description="Listing yang diajukan lewat halaman Jual Akun akan masuk ke sini untuk direview."
                />
              ) : (
                <ul className="space-y-3">
                  {pending.map((l) => (
                    <li key={l.id} className="rounded-2xl glass liquid-sheen p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold">{l.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {gameName(l.game)} · {formatRupiah(l.price)} · diajukan{" "}
                            {formatDateID(l.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              updateUserStatus(l.id, "tayang");
                              toast.success("Listing disetujui & tayang (lokal)", {
                                description: "Pada produksi, aksi ini dieksekusi server dengan audit log.",
                              });
                            }}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-400/10 px-3.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 transition-colors hover:bg-emerald-400/20"
                          >
                            <CheckCircle2 className="h-4 w-4" aria-hidden />
                            Setujui
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand/10 px-3.5 text-xs font-semibold text-brand ring-1 ring-inset ring-brand/30 transition-colors hover:bg-brand/20">
                              <XCircle className="h-4 w-4" aria-hidden />
                              Tolak
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass-strong border-white/10">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-display">
                                  Tolak pengajuan ini?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  “{l.title}” akan ditandai ditolak. Penjual dapat
                                  memperbaiki dan mengajukan ulang.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-white/15 bg-transparent hover:bg-white/10 hover:text-foreground">
                                  Batal
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    updateUserStatus(l.id, "ditolak");
                                    toast("Pengajuan ditolak (lokal)");
                                  }}
                                  className="bg-brand text-white hover:bg-brand-strong"
                                >
                                  Tolak
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* ═══ Kategori ═══ */}
          {section === "kategori" && (
            <section aria-label="Kelola kategori">
              <AdminHeading
                title="Kategori Game"
                subtitle="Aktif/nonaktifkan kategori. Persistensi perubahan butuh database."
              />
              <ul className="space-y-3">
                {GAME_CATEGORIES.map((g) => (
                  <li
                    key={g.slug}
                    className="flex items-center gap-4 rounded-2xl glass liquid-sheen p-4"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl glass-red font-display text-xs font-bold text-white">
                      {g.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.tagline}</p>
                    </div>
                    <Switch
                      checked={categoryState[g.slug]}
                      onCheckedChange={(v) => {
                        setCategoryState((s) => ({ ...s, [g.slug]: v }));
                        toast.success(
                          `Kategori ${g.name} ${v ? "diaktifkan" : "dinonaktifkan"} (lokal — belum persisten)`,
                        );
                      }}
                      aria-label={`Aktifkan kategori ${g.name}`}
                    />
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 rounded-2xl glass px-4 py-3 text-xs text-muted-foreground">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                Toggle ini hanya mengubah state browser. Pengelolaan kategori nyata
                memerlukan tabel database + API admin yang terotorisasi.
              </p>
            </section>
          )}

          {/* ═══ Pesanan ═══ */}
          {section === "pesanan" && (
            <section aria-label="Pantau pesanan">
              <AdminHeading
                title="Pesanan"
                subtitle="Pesanan yang dibuat lewat checkout di browser ini."
              />
              {orders.length === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title="Belum ada pesanan"
                  description="Lakukan checkout dari halaman detail akun untuk melihat pesanan muncul di sini."
                />
              ) : (
                <div className="overflow-x-auto rounded-2xl glass scrollbar-dark">
                  <table className="w-full min-w-[680px] text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-3 font-medium">ID</th>
                        <th className="px-4 py-3 font-medium">Akun</th>
                        <th className="px-4 py-3 font-medium">Pembeli</th>
                        <th className="px-4 py-3 font-medium">Total</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b border-white/5 last:border-0">
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{o.id}</td>
                          <td className="max-w-[220px] px-4 py-3">
                            <p className="line-clamp-1">{o.listingTitle}</p>
                            <p className="text-xs text-muted-foreground">{gameName(o.game)}</p>
                          </td>
                          <td className="max-w-[160px] px-4 py-3">
                            <p className="line-clamp-1">{o.buyer.name}</p>
                            <p className="text-xs text-muted-foreground">{o.buyer.whatsapp}</p>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">{formatRupiah(o.total)}</td>
                          <td className="px-4 py-3">
                            <OrderStatusBadge status={o.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="mt-4 flex items-start gap-2 rounded-2xl glass px-4 py-3 text-xs text-muted-foreground">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                Status pesanan dari browser tidak dapat diandalkan sebagai bukti
                pembayaran. Verifikasi pembayaran wajib dilakukan server (webhook
                payment gateway).
              </p>
            </section>
          )}

          {/* ═══ Pengguna ═══ */}
          {section === "pengguna" && (
            <section aria-label="Kelola pengguna">
              <AdminHeading
                title="Pengguna"
                subtitle="Reputasi penjual terdaftar pada data demo."
              />
              <div className="overflow-x-auto rounded-2xl glass scrollbar-dark">
                <table className="w-full min-w-[620px] text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Penjual</th>
                      <th className="px-4 py-3 font-medium">Rating</th>
                      <th className="px-4 py-3 font-medium">Terjual</th>
                      <th className="px-4 py-3 font-medium">Verifikasi</th>
                      <th className="px-4 py-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map((s) => (
                      <tr key={s.id} className="border-b border-white/5 last:border-0">
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2.5">
                            <span
                              aria-hidden
                              className="flex h-8 w-8 items-center justify-center rounded-full glass-red text-[10px] font-bold"
                            >
                              {initials(s.name)}
                            </span>
                            <span>
                              <span className="block font-medium">{s.name}</span>
                              <span className="block text-xs text-muted-foreground">
                                Sejak {formatDateID(s.joinedAt)}
                              </span>
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3">{s.rating.toFixed(1)} ★</td>
                        <td className="px-4 py-3">{s.totalSales}</td>
                        <td className="px-4 py-3">
                          {s.verified ? (
                            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                              Terverifikasi
                            </span>
                          ) : (
                            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground ring-1 ring-inset ring-white/20">
                              Belum
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => toast.info("Manajemen pengguna membutuhkan backend", { description: "Suspensi/verifikasi pengguna harus dieksekusi server dengan otorisasi admin." })}
                            className="inline-flex h-8 items-center rounded-lg bg-white/5 px-3 text-xs font-medium ring-1 ring-inset ring-white/10 transition-colors hover:text-brand"
                          >
                            Kelola
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ═══ Laporan ═══ */}
          {section === "laporan" && (
            <section aria-label="Laporan transaksi">
              <AdminHeading
                title="Laporan Transaksi"
                subtitle="Volume transaksi demo per kategori game"
              />
              <div className="rounded-2xl glass liquid-sheen p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold">Nilai Transaksi per Game</h3>
                  <DemoBadge />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Angka statis untuk memvisualkan bentuk laporan. Produksi: agregasi SQL
                  pada server, bukan di browser.
                </p>
                <ChartBox>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEMO_REVENUE_PER_GAME} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: "#9b9ba6", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)} jt`}
                      />
                      <YAxis
                        type="category"
                        dataKey="game"
                        tick={{ fill: "#9b9ba6", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={110}
                      />
                      <Tooltip {...chartTooltip} formatter={(v) => formatRupiah(Number(v))} />
                      <Bar dataKey="revenue" name="Nilai" fill="var(--brand)" radius={[0, 6, 6, 0]} maxBarSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartBox>
              </div>
              <p className="mt-4 flex items-start gap-2 rounded-2xl glass px-4 py-3 text-xs text-muted-foreground">
                <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                Laporan keuangan nyata harus berasal dari database dengan join ke tabel
                pembayaran terverifikasi — bukan dari state browser.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Utilitas kecil ── */

const chartTooltip = {
  contentStyle: {
    background: "rgba(16,16,22,0.95)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    fontSize: 12,
    color: "#f4f4f6",
  },
  cursor: { fill: "rgba(255,255,255,0.05)" },
} as const;

function AdminHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-display text-xl font-bold tracking-tight md:text-2xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  note,
}: {
  label: string;
  value: string;
  icon: typeof ListOrdered;
  note: string;
}) {
  return (
    <div className="rounded-2xl glass liquid-sheen p-4 md:p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-brand" aria-hidden />
      </div>
      <p className="mt-2 font-display text-xl font-bold md:text-2xl">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{note}</p>
    </div>
  );
}

function ChartBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 h-64 w-full rounded-xl bg-white/[0.03] p-3 ring-1 ring-inset ring-white/5">
      {children}
    </div>
  );
}
