/**
 * ZERO STORE — tipe data inti.
 *
 * CATATAN ARSITEKTUR (frontend ↔ backend):
 * Seluruh tipe di file ini dirancang agar kompatibel dengan skema database
 * yang akan datang (mis. Supabase/PostgreSQL). Saat backend tersedia,
 * fungsi di `src/lib/listings.ts` tinggal diganti fetch ke API/DB dengan
 * bentuk data yang sama — komponen UI tidak perlu berubah.
 */

export type GameSlug =
  | "free-fire"
  | "mobile-legends"
  | "pubg-mobile"
  | "roblox"
  | "genshin-impact"
  | "lainnya";

export interface GameCategory {
  slug: GameSlug;
  name: string;
  tagline: string;
  image: string;
  /** Kategori non-aktif disembunyikan dari navigasi (kontrol admin di masa depan). */
  active: boolean;
}

export interface Seller {
  id: string;
  name: string;
  /** Tanggal bergabung (ISO). */
  joinedAt: string;
  /** Rating 0–5. */
  rating: number;
  totalSales: number;
  /** Status verifikasi KYC — pada produksi diverifikasi server/admin. */
  verified: boolean;
  /** Estimasi waktu respons dalam menit. */
  responseMinutes: number;
}

export type ListingStatus = "tersedia" | "terjual";

export interface Listing {
  id: string;
  title: string;
  game: GameSlug;
  /** Harga dalam Rupiah (integer). */
  price: number;
  description: string;
  images: string[];
  level?: number;
  rank?: string;
  server?: string;
  skinCount?: number;
  heroCount?: number;
  /** Chip ringkas: item penting yang dimiliki akun. */
  highlights: string[];
  /** Status binding akun, mis. "Full akses email jual". */
  binding?: string;
  createdAt: string;
  featured?: boolean;
  status: ListingStatus;
  views: number;
  seller: Seller;
}

export type NotificationCategory = "transaksi" | "listing" | "sistem" | "promosi";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  /** ISO timestamp. */
  time: string;
  read: boolean;
}

export type OrderStatus =
  | "menunggu_pembayaran"
  | "menunggu_verifikasi"
  | "diproses"
  | "selesai"
  | "gagal";

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  game: GameSlug;
  price: number;
  fee: number;
  total: number;
  buyer: {
    name: string;
    whatsapp: string;
    email: string;
  };
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

export type UserListingStatus = "draft" | "menunggu_review" | "tayang" | "ditolak";

/** Listing yang dibuat pengguna melalui form Jual Akun (disimpan lokal saat demo). */
export interface UserListing {
  id: string;
  game: GameSlug;
  title: string;
  price: number;
  description: string;
  level?: string;
  rank?: string;
  server?: string;
  skinCount?: number;
  heroCount?: number;
  highlights: string[];
  /**
   * Referensi gambar. DEMO: berupa data-URL sementara di browser.
   * Produksi: upload permanen harus melalui backend/object storage.
   */
  imagePreviews: string[];
  imagesPersisted: boolean;
  status: UserListingStatus;
  createdAt: string;
  updatedAt: string;
}
