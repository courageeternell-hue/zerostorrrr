"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  BadgeCheck,
  ClipboardList,
  Eye,
  Info,
  LogIn,
  LogOut,
  LayoutDashboard,
  Package,
  Settings2,
  ShieldAlert,
  ShoppingBag,
  Store,
  Trash2,
  UserRound,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
import { PrimaryLink, UserListingStatusBadge, OrderStatusBadge } from "@/components/store/badges";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { useUserListings } from "@/lib/store/user-listings";
import { useOrders } from "@/lib/store/orders";
import { useFavorites } from "@/lib/store/favorites";
import { useNotifications } from "@/lib/store/notifications";
import { useMounted } from "@/hooks/use-mounted";
import { formatDateID, formatRupiah, initials } from "@/lib/format";
import { gameName } from "@/lib/games";
import { cn } from "@/lib/utils";

type Tab = "listing" | "pesanan" | "pengaturan";

type ProfileListing = {
  id: string;
  game: Parameters<typeof gameName>[0];
  title: string;
  price: number;
  status: "draft" | "menunggu_review" | "tayang" | "ditolak" | "terjual";
  created_at: string;
  image_urls: string[];
};

const TABS: { value: Tab; label: string; icon: typeof Store }[] = [
  { value: "listing", label: "Listing Saya", icon: Store },
  { value: "pesanan", label: "Riwayat Pesanan", icon: ShoppingBag },
  { value: "pengaturan", label: "Pengaturan", icon: Settings2 },
];

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="mt-6 h-96 rounded-2xl" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const mounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (TABS.find((t) => t.value === searchParams.get("tab"))?.value ?? "listing") as Tab;

  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      if (!user?.id) {
        setIsAdmin(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (active) setIsAdmin(!error && Boolean(data));
    }

    void checkAdmin();

    return () => {
      active = false;
    };
  }, [user?.id]);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [userListings, setUserListings] = useState<ProfileListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const orders = useOrders((s) => s.orders);

  useEffect(() => {
    let active = true;

    async function loadListings() {
      if (!user?.id) {
        setUserListings([]);
        return;
      }

      setListingsLoading(true);
      setListingsError(null);

      try {
        const response = await fetch("/api/listings", { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Gagal mengambil listing.");
        }

        if (active) setUserListings(result.listings ?? []);
      } catch (error) {
        if (active) {
          setListingsError(
            error instanceof Error ? error.message : "Gagal mengambil listing."
          );
        }
      } finally {
        if (active) setListingsLoading(false);
      }
    }

    void loadListings();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const [emailNotif, setEmailNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);

  const favorites = useFavorites();
  const notifications = useNotifications();

  function switchTab(next: Tab) {
    router.replace(`/profil?tab=${next}`, { scroll: false });
  }

  function clearAllLocalData() {
    favorites.clear();
    useOrders.getState().clear();
    useUserListings.getState().clear();
    notifications.markAllRead([]);
    toast.success("Semua data lokal dihapus", {
      description: "Favorit, pesanan, dan listing demo telah dikosongkan.",
    });
  }

  if (!mounted || authLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="mt-6 h-72 rounded-2xl" />
      </div>
    );
  }

  /* ── Belum masuk (setelah logout) ── */
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-14 md:px-6">
        <div className="rounded-3xl glass-strong liquid-sheen p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl glass-red">
            <UserRound className="h-7 w-7 text-brand" aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold">Kamu belum masuk</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Masuk menggunakan akun ZERO STORE untuk mengakses profil dan aktivitasmu.
          </p>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setAuthSubmitting(true);
              try {
                await signIn(authEmail.trim(), authPassword);
                setAuthPassword("");
                toast.success("Berhasil masuk ke ZERO STORE");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Login gagal. Periksa email dan password.");
              } finally {
                setAuthSubmitting(false);
              }
            }}
            className="mt-6 space-y-3 text-left"
          >
            <label className="block text-sm font-medium">
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                placeholder="nama@email.com"
                className="mt-1.5 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-brand"
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                type="password"
                required
                autoComplete="current-password"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
                placeholder="Masukkan password"
                className="mt-1.5 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-brand"
              />
            </label>
            <button
              type="submit"
              disabled={authSubmitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition-all hover:bg-brand-strong disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              {authSubmitting ? "Memproses..." : "Masuk"}
            </button>
          </form>

        </div>
      </div>
    );
  }

  /* ── Profil utama ── */
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      {/* Kartu pengguna */}
      <section className="rounded-3xl glass-strong liquid-sheen p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-4">
          <span
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-2xl glass-red font-display text-xl font-bold text-white"
          >
            {initials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-1.5 font-display text-xl font-bold">
              {user.name}
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-white/15">
                Akun Terdaftar
              </span>
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {user.handle} · {user.email}
            </p>
          </div>
          <div className="relative z-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-strong active:scale-[0.98] sm:w-auto"
              >
                <LayoutDashboard className="h-5 w-5 shrink-0" aria-hidden />
                Dashboard Admin
              </Link>
            )}
            <AlertDialog>
              <AlertDialogTrigger
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand/40 bg-brand/10 px-5 text-sm font-semibold text-brand transition-colors hover:bg-brand/20 sm:w-auto"
                aria-label="Keluar dari akun ZERO STORE"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Keluar
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-strong border-white/10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">Keluar dari akun ZERO STORE?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Kamu akan keluar dari akun ZERO STORE pada perangkat ini.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-white/15 bg-transparent hover:bg-white/10 hover:text-foreground">
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      void signOut().then(() => toast.success("Berhasil keluar")).catch((error) => toast.error(error.message));
                    }}
                    className="bg-brand text-white hover:bg-brand-strong"
                  >
                    Keluar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-400/5 p-3 text-[11px] leading-relaxed text-amber-200/90 ring-1 ring-inset ring-amber-400/20">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Keamanan belum diverifikasi: sistem autentikasi, sinkronisasi akun, dan
          perlindungan data pribadi membutuhkan backend. Data di halaman ini hanya ada
          di browser-mu.
        </p>
      </section>

      {/* Tab */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Bagian profil">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => switchTab(t.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all active:scale-95",
              tab === t.value
                ? "bg-brand text-white glow-red"
                : "glass text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="h-4 w-4" aria-hidden />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Listing saya ── */}
      {tab === "listing" && (
        <section className="mt-5" aria-label="Listing saya">
          {userListings.length === 0 ? (
            <EmptyState
              icon={Store}
              title="Belum ada listing"
              description="Pasang akun game-mu untuk mulai berjualan. Kamu bisa menyimpan draft dan mengajukannya kapan saja."
              action={<PrimaryLink href="/jual">Buat Listing Pertama</PrimaryLink>}
            />
          ) : (
            <ul className="space-y-3">
              {userListings.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center gap-4 rounded-2xl glass liquid-sheen p-4"
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5">
                    {l.image_urls[0] ? (
                       
                      <img
                        src={l.image_urls[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold">{l.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {gameName(l.game)} · {formatRupiah(l.price)} ·{" "}
                      {formatDateID(l.created_at)}
                    </p>
                    <div className="mt-1.5">
                      <UserListingStatusBadge status={l.status} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
                    <Link
                      href={`/produk/${l.id}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/5 px-3 text-xs font-medium ring-1 ring-inset ring-white/10 transition-colors hover:text-brand"
                      aria-label={`Lihat detail ${l.title}`}
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden />
                      Detail
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand/10 px-3 text-xs font-semibold text-brand ring-1 ring-inset ring-brand/30 transition-colors hover:bg-brand/20"
                        aria-label={`Hapus ${l.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Hapus
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-strong border-white/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display">
                            Hapus listing ini?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            “{l.title}” akan dihapus permanen dari akunmu.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-white/15 bg-transparent hover:bg-white/10 hover:text-foreground">
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                const response = await fetch(
                                  `/api/listings/${encodeURIComponent(l.id)}`,
                                  { method: "DELETE" }
                                );
                                const result = await response.json();

                                if (!response.ok) {
                                  throw new Error(
                                    result.error || "Gagal menghapus listing."
                                  );
                                }

                                setUserListings((current) =>
                                  current.filter((item) => item.id !== l.id)
                                );
                                toast.success("Listing berhasil dihapus");
                              } catch (error) {
                                toast.error(
                                  error instanceof Error
                                    ? error.message
                                    : "Gagal menghapus listing."
                                );
                              }
                            }}
                            className="bg-brand text-white hover:bg-brand-strong"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ── Tab: Pesanan ── */}
      {tab === "pesanan" && (
        <section className="mt-5" aria-label="Riwayat pesanan">
          {orders.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Belum ada pesanan"
              description="Pesanan yang kamu buat lewat halaman checkout akan muncul di sini beserta statusnya."
              action={<PrimaryLink href="/katalog">Jelajahi Akun</PrimaryLink>}
            />
          ) : (
            <>
              <ul className="space-y-3">
                {orders.map((o) => (
                  <li key={o.id} className="rounded-2xl glass liquid-sheen p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5">
                        {o.listingImage ? (
                           
                          <img
                            src={o.listingImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" aria-hidden />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-semibold">{o.listingTitle}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          <span className="font-mono">{o.id}</span> ·{" "}
                          {formatDateID(o.createdAt)}
                        </p>
                        <p className="mt-1 font-display text-base font-bold text-brand">
                          {formatRupiah(o.total)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <OrderStatusBadge status={o.status} />
                        <Link
                          href={`/produk/${o.listingId}`}
                          className="mt-2 block text-xs text-muted-foreground underline-offset-2 hover:text-brand hover:underline"
                        >
                          Lihat akun
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 rounded-2xl glass px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                <span>
                  <strong className="text-foreground">Penting:</strong> status pesanan
                  di atas bersumber dari browser, bukan dari verifikasi server.
                  Pesanan &amp; pembayaran nyata dikelola backend tepercaya.
                </span>
              </p>
            </>
          )}
        </section>
      )}

      {/* ── Tab: Pengaturan ── */}
      {tab === "pengaturan" && (
        <section className="mt-5 space-y-3" aria-label="Pengaturan akun">
          <div className="rounded-2xl glass liquid-sheen p-5">
            <h2 className="font-display text-base font-bold">Notifikasi</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Notifikasi email</p>
                  <p className="text-xs text-muted-foreground">
                    Update transaksi &amp; listing dikirim ke email
                  </p>
                </div>
                <Switch
                  checked={emailNotif}
                  onCheckedChange={(v) => {
                    setEmailNotif(v);
                    toast.success(`Notifikasi email ${v ? "diaktifkan" : "dimatikan"} (lokal)`);
                  }}
                  aria-label="Aktifkan notifikasi email"
                />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-4">
                <div>
                  <p className="text-sm font-medium">Promosi &amp; penawaran</p>
                  <p className="text-xs text-muted-foreground">
                    Diskon musiman dan info event marketplace
                  </p>
                </div>
                <Switch
                  checked={promoNotif}
                  onCheckedChange={(v) => {
                    setPromoNotif(v);
                    toast.success(`Promosi ${v ? "diaktifkan" : "dimatikan"} (lokal)`);
                  }}
                  aria-label="Aktifkan notifikasi promosi"
                />
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Preferensi tersimpan lokal di browser (demo). Pengaturan nyata perlu
              backend untuk disinkronkan ke akunmu.
            </p>
          </div>

          <div className="rounded-2xl glass liquid-sheen p-5">
            <h2 className="font-display text-base font-bold">Data Lokal</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Menghapus favorit ({favorites.ids.length}), pesanan, listing demo, dan
              status notifikasi dari browser ini.
            </p>
            <AlertDialog>
              <AlertDialogTrigger className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand/20">
                <Trash2 className="h-4 w-4" aria-hidden />
                Hapus Semua Data Lokal
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-strong border-white/10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">
                    Hapus semua data lokal?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Favorit, pesanan, listing demo, dan status baca notifikasi akan
                    dihapus dari browser ini. Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-white/15 bg-transparent hover:bg-white/10 hover:text-foreground">
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearAllLocalData}
                    className="bg-brand text-white hover:bg-brand-strong"
                  >
                    Hapus Semua
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="rounded-2xl glass liquid-sheen p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold">
              <ClipboardList className="h-4 w-4 text-brand" aria-hidden />
              Tentang Aplikasi
            </h2>
            <dl className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <dt>Versi</dt>
                <dd className="text-foreground">ZERO STORE demo build 1.0.0</dd>
              </div>
              <div className="flex justify-between">
                <dt>Dibangun dengan</dt>
                <dd className="text-foreground">Next.js 16 · TypeScript · Tailwind CSS</dd>
              </div>
              <div className="flex justify-between">
                <dt>Status backend</dt>
                <dd className="text-amber-300">Belum terhubung (demo)</dd>
              </div>
            </dl>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
              Dokumentasi lengkap fitur &amp; rencana integrasi tersedia di file README
              proyek.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
