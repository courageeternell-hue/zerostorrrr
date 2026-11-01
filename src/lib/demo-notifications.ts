import type { AppNotification } from "@/lib/types";

/**
 * ⚠️ NOTIFIKASI DEMO — bukan data dari server.
 * Status baca/belum-baca disimpan lokal via `src/lib/store/notifications.ts`.
 * Produksi: notifikasi dibuat oleh backend saat ada event (pesanan baru,
 * listing disetujui, dsb.) dan dikirim via polling/websocket/push.
 */
function hoursAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-001",
    category: "transaksi",
    title: "Pembayaran menunggu verifikasi",
    body: "Pesanan untuk akun “Akun FF Sultan — Bundle Chrono & 32 Skin Epik” sedang menunggu verifikasi pembayaran. Data demo — bukan transaksi sungguhan.",
    time: hoursAgo(2),
    read: false,
  },
  {
    id: "ntf-002",
    category: "listing",
    title: "Listing kamu tayang di katalog",
    body: "Selamat! Listing demo kamu telah disetujui moderator dan kini tampil di katalog pencarian.",
    time: hoursAgo(6),
    read: false,
  },
  {
    id: "ntf-003",
    category: "promosi",
    title: "Diskon biaya layanan akhir pekan",
    body: "Nikmati potongan biaya layanan 50% untuk transaksi akun Mobile Legends pada akhir pekan ini. S&K berlaku. (Demo)",
    time: hoursAgo(26),
    read: false,
  },
  {
    id: "ntf-004",
    category: "transaksi",
    title: "Dana escrow dirilis ke penjual",
    body: "Transaksi “Akun Roblox Aged 2017 + 12.500 Robux” telah selesai. Dana telah dirilis ke penjual. (Data demo)",
    time: hoursAgo(50),
    read: true,
  },
  {
    id: "ntf-005",
    category: "sistem",
    title: "Selamat datang di ZERO STORE",
    body: "Terima kasih telah bergabung! Lengkapi profil untuk mulai jual beli akun game dengan aman.",
    time: hoursAgo(74),
    read: true,
  },
  {
    id: "ntf-006",
    category: "listing",
    title: "Panduan foto listing baru",
    body: "Gunakan 3–5 foto asli akun (bukan hasil screenshot orang lain) agar listing kamu lebih cepat disetujui.",
    time: hoursAgo(96),
    read: true,
  },
  {
    id: "ntf-007",
    category: "sistem",
    title: "Pembaruan keamanan akun",
    body: "Kami menambahkan verifikasi dua langkah opsional untuk melindungi akun ZERO STORE kamu. (Fitur butuh backend — saat ini demo)",
    time: hoursAgo(120),
    read: true,
  },
  {
    id: "ntf-008",
    category: "transaksi",
    title: "Penawaran balas diterima",
    body: "Penjual memberi respons pada penawaran akun “Akun PUBGM Conqueror — Mythic Fashion x21”. Cek halaman pesanan. (Demo)",
    time: hoursAgo(150),
    read: true,
  },
];

export const NOTIFICATION_CATEGORIES = [
  { value: "semua", label: "Semua" },
  { value: "transaksi", label: "Transaksi" },
  { value: "listing", label: "Listing" },
  { value: "sistem", label: "Sistem" },
  { value: "promosi", label: "Promosi" },
] as const;
