import Link from "next/link";
import type { OrderStatus, UserListingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const ORDER_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  menunggu_pembayaran: { label: "Menunggu Pembayaran", className: "bg-amber-400/10 text-amber-300 ring-amber-400/30" },
  menunggu_verifikasi: { label: "Menunggu Verifikasi", className: "bg-amber-400/10 text-amber-300 ring-amber-400/30" },
  diproses: { label: "Diproses", className: "bg-white/10 text-foreground ring-white/25" },
  selesai: { label: "Selesai", className: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30" },
  gagal: { label: "Gagal", className: "bg-brand/10 text-brand ring-brand/40" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = ORDER_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}

const USER_LISTING_STYLES: Record<UserListingStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-white/10 text-foreground/80 ring-white/20" },
  menunggu_review: { label: "Menunggu Review", className: "bg-amber-400/10 text-amber-300 ring-amber-400/30" },
  tayang: { label: "Tayang", className: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30" },
  ditolak: { label: "Ditolak", className: "bg-brand/10 text-brand ring-brand/40" },
};

export function UserListingStatusBadge({ status }: { status: UserListingStatus }) {
  const s = USER_LISTING_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-white/15",
        className,
      )}
    >
      Demo
    </span>
  );
}

export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-all hover:bg-brand-strong active:scale-[0.98] glow-red focus-visible:outline-2 focus-visible:outline-ring",
        className,
      )}
    >
      {children}
    </Link>
  );
}
