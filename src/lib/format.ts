import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { id as localeID } from "date-fns/locale";

/** Format harga Indonesia: 250000 -> "Rp250.000" */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format angka ringkas: 1250 -> "1,2 rb" (untuk jumlah penjualan, views). */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** "3 jam lalu", "2 hari lalu" — aman untuk SSR jika input ISO konsisten. */
export function timeAgo(iso: string): string {
  try {
    return formatDistanceToNowStrict(parseISO(iso), { addSuffix: true, locale: localeID });
  } catch {
    return "";
  }
}

/** Format tanggal Indonesia: 12 Mei 2025 */
export function formatDateID(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(parseISO(iso));
  } catch {
    return "";
  }
}

/** Biaya layanan marketplace demo: 2.5%, minimum Rp5.000. */
export function serviceFee(price: number): number {
  return Math.max(5000, Math.round(price * 0.025));
}

/** Inisial avatar: "Rizky Pratama" -> "RP" */
export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
