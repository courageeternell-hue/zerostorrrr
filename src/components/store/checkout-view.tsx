"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Gamepad2,
  Landmark,
  PackageX,
  PartyPopper,
  QrCode,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { EmptyState } from "@/components/store/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getListingById } from "@/lib/listings";
import { gameName } from "@/lib/games";
import { formatRupiah, serviceFee } from "@/lib/format";
import { useOrders } from "@/lib/store/orders";
import { useUserListings, genId } from "@/lib/store/user-listings";
import { useMounted } from "@/hooks/use-mounted";
import type { Order, PaymentMethodValue } from "@/lib/checkout-types";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  whatsapp: z
    .string()
    .regex(/^(\+62|62|0)8\d{7,12}$/, "Format nomor WhatsApp tidak valid. Contoh: 081234567890"),
  email: z.string().email("Format email tidak valid"),
});
type ContactForm = z.infer<typeof contactSchema>;

const PAYMENT_METHODS: {
  value: PaymentMethodValue;
  label: string;
  description: string;
  icon: typeof Landmark;
}[] = [
  {
    value: "transfer_bank",
    label: "Transfer Bank",
    description: "BCA · BRI · Mandiri — verifikasi manual oleh tim",
    icon: Landmark,
  },
  {
    value: "ewallet",
    label: "E-Wallet",
    description: "DANA · OVO · GoPay — pembayaran instan",
    icon: Wallet,
  },
  {
    value: "qris",
    label: "QRIS",
    description: "Scan QR dari semua aplikasi pembayaran",
    icon: QrCode,
  },
];

const STEP_LABELS = ["Kontak", "Pembayaran", "Tinjauan", "Selesai"];

export function CheckoutView({ id }: { id: string }) {
  const mounted = useMounted();
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState<PaymentMethodValue | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addOrder = useOrders((s) => s.addOrder);

  const demo = getListingById(id);
  const userListing = useUserListings((s) => s.listings.find((l) => l.id === id));

  /** Item checkout terpadu dari sumber demo atau listing pengguna. */
  const item = useMemo(() => {
    if (demo) {
      return {
        title: demo.title,
        game: demo.game,
        price: demo.price,
        image: demo.images[0],
        sold: demo.status === "terjual",
        purchasable: demo.status === "tersedia",
      };
    }
    if (userListing) {
      return {
        title: userListing.title,
        game: userListing.game,
        price: userListing.price,
        image: userListing.imagePreviews[0] as string | undefined,
        sold: false,
        purchasable: userListing.status === "tayang",
      };
    }
    return null;
  }, [demo, userListing]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", whatsapp: "", email: "" },
    mode: "onTouched",
  });

  const fee = useMemo(() => (item ? serviceFee(item.price) : 0), [item]);
  const total = item ? item.price + fee : 0;
  const paymentLabel = PAYMENT_METHODS.find((p) => p.value === payment)?.label ?? "-";

  /* ── Guard: listing tidak ada / tidak dapat dibeli ── */
  if (!item) {
    if (!mounted) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <EmptyState
          icon={PackageX}
          title="Listing tidak ditemukan"
          description="Akun ini mungkin sudah dihapus atau tidak pernah ada. Cari akun lain di katalog."
          action={
            <Link
              href="/katalog"
              className="inline-flex h-11 items-center rounded-xl bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-strong"
            >
              Jelajahi Katalog
            </Link>
          }
        />
      </div>
    );
  }

  const isSold = item.sold;
  const notListed = !item.purchasable && !isSold;
  const blocked = isSold || notListed;

  if (blocked) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <EmptyState
          icon={PackageX}
          title={isSold ? "Akun sudah terjual" : "Listing belum tayang"}
          description={
            isSold
              ? "Sayangnya akun ini sudah dibeli orang lain. Lihat akun serupa di katalog."
              : "Checkout hanya tersedia untuk listing dengan status Tayang."
          }
          action={
            <Link
              href="/katalog"
              className="inline-flex h-11 items-center rounded-xl bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-strong"
            >
              Cari Akun Lain
            </Link>
          }
        />
      </div>
    );
  }

  function onContactSubmit() {
    setStep(2);
  }

  function goPaymentNext() {
    if (!payment) return;
    setStep(3);
  }

  const placeOrder = (data: ContactForm) => {
    setSubmitting(true);
    // Simulasi pembuatan pesanan — pada produksi, POST ke server & lakukan
    // verifikasi pembayaran di backend sebelum status berubah.
    setTimeout(() => {
      const order: Order = {
        id: genId("ORD"),
        listingId: id,
        listingTitle: item.title,
        listingImage: item.image ?? "",
        game: item.game,
        price: item.price,
        fee,
        total,
        buyer: { name: data.name, whatsapp: data.whatsapp, email: data.email },
        paymentMethod: paymentLabel,
        status: "menunggu_pembayaran",
        createdAt: new Date().toISOString(),
      };
      addOrder(order);
      setPlacedOrderId(order.id);
      setSubmitting(false);
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  const title = item.title;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Checkout</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Selesaikan pembelian akun dengan langkah yang jelas dan terlindungi.
      </p>

      {/* Indikator langkah */}
      <ol className="mt-6 flex items-center gap-1.5 md:gap-3" aria-label="Langkah checkout">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const current = step === n;
          return (
            <li key={label} className="flex flex-1 items-center gap-1.5 md:gap-3">
              <div className="flex flex-col items-center gap-1">
                <span
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors md:h-9 md:w-9",
                    done && "bg-brand text-white",
                    current && "bg-brand text-white glow-red",
                    !done && !current && "bg-white/5 text-muted-foreground ring-1 ring-inset ring-white/15",
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : n}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium md:text-xs",
                    current ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {n < STEP_LABELS.length && (
                <span
                  aria-hidden
                  className={cn(
                    "mb-4 h-px flex-1",
                    step > n ? "bg-brand" : "bg-white/15",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* ── Langkah 1: Kontak ── */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onContactSubmit)} className="mt-8 space-y-5">
          <section className="rounded-2xl glass liquid-sheen p-5 md:p-6">
            <h2 className="font-display text-lg font-bold">Ringkasan Akun</h2>
            <div className="mt-3 flex gap-4">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                {demo ? (
                  <CheckoutImage src={demo.images[0]} alt={title} />
                ) : item.image ? (
                   
                  <img src={item.image} alt={title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-white/5">
                    <Gamepad2 className="h-6 w-6 text-muted-foreground" aria-hidden />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-medium">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{gameName(item.game)}</p>
                <p className="mt-1.5 font-display text-lg font-bold text-brand">
                  {formatRupiah(item.price)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl glass liquid-sheen p-5 md:p-6">
            <h2 className="font-display text-lg font-bold">Data Kontak Pembeli</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Digunakan penjual &amp; tim untuk menghubungimu selama proses serah terima.
            </p>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="co-name">Nama lengkap</Label>
                <Input id="co-name" placeholder="cth. Rizky Ramadhan" {...register("name")} aria-invalid={!!errors.name} />
                {errors.name && <FieldError message={errors.name.message} />}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="co-wa">Nomor WhatsApp</Label>
                <Input id="co-wa" inputMode="tel" placeholder="081234567890" {...register("whatsapp")} aria-invalid={!!errors.whatsapp} />
                {errors.whatsapp && <FieldError message={errors.whatsapp.message} />}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="co-email">Email</Label>
                <Input id="co-email" type="email" placeholder="nama@email.com" {...register("email")} aria-invalid={!!errors.email} />
                {errors.email && <FieldError message={errors.email.message} />}
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition-all hover:bg-brand-strong active:scale-[0.98] glow-red"
          >
            Lanjut ke Pembayaran
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </form>
      )}

      {/* ── Langkah 2: Pembayaran ── */}
      {step === 2 && (
        <div className="mt-8 space-y-5">
          <section className="rounded-2xl glass liquid-sheen p-5 md:p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <CreditCard className="h-5 w-5 text-brand" aria-hidden />
              Pilih Metode Pembayaran
            </h2>
            <div role="radiogroup" aria-label="Metode pembayaran" className="mt-4 space-y-3">
              {PAYMENT_METHODS.map((pm) => (
                <label
                  key={pm.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-xl p-4 ring-1 ring-inset transition-all",
                    payment === pm.value
                      ? "bg-brand/10 ring-brand/60"
                      : "bg-white/5 ring-white/10 hover:ring-white/25",
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.value}
                    checked={payment === pm.value}
                    onChange={() => setPayment(pm.value)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      payment === pm.value ? "bg-brand text-white" : "bg-white/8 text-muted-foreground",
                    )}
                  >
                    <pm.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{pm.label}</span>
                    <span className="block text-xs text-muted-foreground">{pm.description}</span>
                  </span>
                  <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300 ring-1 ring-inset ring-amber-400/30">
                    Simulasi
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      payment === pm.value ? "border-brand bg-brand" : "border-white/25",
                    )}
                  >
                    {payment === pm.value && <Check className="h-3 w-3 text-white" />}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-4">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-amber-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                <strong>Jujur soal arsitektur:</strong> pemrosesan pembayaran sungguhan
                (payment gateway, verifikasi, escrow) memerlukan backend tepercaya. Pada
                demo ini tidak ada dana yang tertagih dan status pesanan tidak
                diverifikasi server.
              </span>
            </p>
          </section>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl glass px-5 text-sm font-semibold transition-colors hover:text-brand"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Kembali
            </button>
            <button
              type="button"
              onClick={goPaymentNext}
              disabled={!payment}
              className={cn(
                "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all active:scale-[0.98]",
                payment
                  ? "bg-brand text-white hover:bg-brand-strong glow-red"
                  : "cursor-not-allowed bg-white/5 text-muted-foreground ring-1 ring-inset ring-white/10",
              )}
            >
              Tinjau Pesanan
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {/* ── Langkah 3: Tinjauan ── */}
      {step === 3 && (
        <div className="mt-8 space-y-5">
          <section className="rounded-2xl glass-strong liquid-sheen p-5 md:p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <ClipboardList className="h-5 w-5 text-brand" aria-hidden />
              Tinjau Pesanan
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <ReviewRow label="Akun" value={title} />
              <ReviewRow label="Game" value={gameName(item.game)} />
              <ReviewRow label="Nama pembeli" value={getValues("name")} />
              <ReviewRow label="WhatsApp" value={getValues("whatsapp")} />
              <ReviewRow label="Email" value={getValues("email")} />
              <ReviewRow label="Metode pembayaran" value={paymentLabel} />
            </dl>
            <dl className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Harga akun</dt>
                <dd className="text-foreground">{formatRupiah(item.price)}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>Biaya layanan</dt>
                <dd className="text-foreground">{formatRupiah(fee)}</dd>
              </div>
              <div className="flex justify-between pt-1 font-display text-lg font-bold">
                <dt>Total bayar</dt>
                <dd className="text-brand">{formatRupiah(total)}</dd>
              </div>
            </dl>
          </section>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl glass p-4">
            <Checkbox
              checked={agreed}
              onCheckedChange={(v) => {
                setAgreed(v === true);
                if (v) setAgreedError(false);
              }}
              aria-label="Saya mengerti ini adalah demo"
              className="mt-0.5"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              Saya paham bahwa ini adalah <strong className="text-foreground">build demo</strong>:
              tidak ada dana yang tertagih, pesanan tersimpan lokal di browser, dan
              penyelesaian transaksi nyata membutuhkan backend + payment gateway
              terverifikasi.
            </span>
          </label>
          {agreedError && <FieldError message="Centang konfirmasi terlebih dahulu" />}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl glass px-5 text-sm font-semibold transition-colors hover:text-brand"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Kembali
            </button>
            <button
              type="button"
              onClick={handleSubmit(placeOrder)}
              disabled={submitting}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition-all hover:bg-brand-strong active:scale-[0.98] glow-red disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span
                    aria-hidden
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  />
                  Memproses...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  Buat Pesanan
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Langkah 4: Selesai ── */}
      {step === 4 && placedOrderId && (
        <div className="mt-8">
          <section className="rounded-2xl glass-strong liquid-sheen p-6 text-center md:p-10">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl glass-red">
              <PartyPopper className="h-7 w-7 text-brand" aria-hidden />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold">Pesanan Dibuat</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Nomor pesanan <span className="font-mono font-semibold text-foreground">{placedOrderId}</span>
            </p>

            <dl className="mx-auto mt-6 max-w-sm space-y-2 rounded-xl bg-white/5 p-4 text-sm ring-1 ring-inset ring-white/10">
              <ReviewRow label="Akun" value={title} />
              <ReviewRow label="Total" value={formatRupiah(total)} />
              <ReviewRow label="Metode" value={paymentLabel} />
              <ReviewRow label="Status" value="Menunggu Pembayaran" />
            </dl>

            <div className="mx-auto mt-5 max-w-md rounded-xl border border-amber-400/25 bg-amber-400/5 p-4 text-left">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  Pesanan ini tersimpan di browser (localStorage) dan statusnya{" "}
                  <strong>belum diverifikasi server</strong>. Pembayaran nyata,
                  verifikasi otomatis, dan escrow memerlukan integrasi backend —
                  lihat README bagian “Integrasi Backend”.
                </span>
              </p>
            </div>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/profil?tab=pesanan"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-6 text-sm font-bold text-white transition-colors hover:bg-brand-strong"
              >
                Lihat Riwayat Pesanan
              </Link>
              <Link
                href="/katalog"
                className="inline-flex h-12 items-center justify-center rounded-xl glass px-6 text-sm font-semibold transition-colors hover:text-brand"
              >
                Lanjut Belanja
              </Link>
            </div>
          </section>
        </div>
      )}

      {/* Kartu kepercayaan */}
      {step < 4 && (
        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <BadgeCheck className="h-4 w-4 text-brand" aria-hidden />
          Dana ditahan escrow &amp; dirilis setelah akun diterima (fitur membutuhkan backend).
        </p>
      )}
    </div>
  );
}

function CheckoutImage({ src, alt }: { src: string; alt: string }) {
   
  return <img src={src} alt={alt} className="h-full w-full object-cover" />;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-center gap-1 text-xs font-medium text-brand">
      <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
      {message}
    </p>
  );
}
