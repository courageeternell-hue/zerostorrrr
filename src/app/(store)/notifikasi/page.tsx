"use client";

import { useMemo, useState } from "react";
import { Bell, BellRing, CheckCheck, Gamepad2, Megaphone, PackageSearch, Settings2 } from "lucide-react";
import { EmptyState } from "@/components/store/empty-state";
import { DemoBadge } from "@/components/store/badges";
import { DEMO_NOTIFICATIONS, NOTIFICATION_CATEGORIES } from "@/lib/demo-notifications";
import { useNotifications } from "@/lib/store/notifications";
import { useMounted } from "@/hooks/use-mounted";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NotificationCategory } from "@/lib/types";

const CATEGORY_ICONS: Record<NotificationCategory, typeof Bell> = {
  transaksi: PackageSearch,
  listing: Gamepad2,
  sistem: Settings2,
  promosi: Megaphone,
};

type Filter = NotificationCategory | "semua";

export default function NotificationsPage() {
  const mounted = useMounted();
  const [filter, setFilter] = useState<Filter>("semua");
  const readIds = useNotifications((s) => s.readIds);
  const markRead = useNotifications((s) => s.markRead);
  const markAllRead = useNotifications((s) => s.markAllRead);

  const notifications = useMemo(
    () =>
      DEMO_NOTIFICATIONS.map((n) => ({ ...n, read: n.read || readIds.includes(n.id) })).sort(
        (a, b) => b.time.localeCompare(a.time),
      ),
    [readIds],
  );

  const filtered = filter === "semua" ? notifications : notifications.filter((n) => n.category === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const allIds = notifications.map((n) => n.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-brand" aria-hidden />
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Notifikasi
            </h1>
            {mounted && unreadCount > 0 && (
              <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white glow-red">
                {unreadCount} baru
              </span>
            )}
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            Pusat aktivitas transaksi, listing, dan sistem.
            <DemoBadge />
          </p>
        </div>

        {mounted && unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllRead(allIds)}
            className="inline-flex h-10 items-center gap-2 rounded-xl glass px-4 text-sm font-medium transition-colors hover:text-brand"
          >
            <CheckCheck className="h-4 w-4" aria-hidden />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Filter kategori */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter notifikasi">
        {NOTIFICATION_CATEGORIES.map((c) => {
          const active = filter === c.value;
          return (
            <button
              key={c.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(c.value as Filter)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95",
                active
                  ? "bg-brand text-white glow-red"
                  : "glass text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
              {c.value !== "semua" && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {notifications.filter((n) => n.category === c.value).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Daftar notifikasi */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Tidak ada notifikasi"
          description="Notifikasi untuk kategori ini akan muncul di sini saat ada aktivitas baru."
          className="mt-6"
        />
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((n) => {
            const Icon = CATEGORY_ICONS[n.category];
            const unread = !n.read;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  aria-label={
                    unread ? `Tandai notifikasi dibaca: ${n.title}` : `Notifikasi: ${n.title}`
                  }
                  className={cn(
                    "group flex w-full items-start gap-3.5 rounded-2xl p-4 text-left transition-all active:scale-[0.99] md:p-5",
                    unread ? "glass-strong liquid-sheen" : "glass opacity-75 hover:opacity-100",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      unread ? "glass-red text-brand" : "bg-white/5 text-muted-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={cn("text-sm", unread ? "font-bold text-foreground" : "font-medium")}>
                        {n.title}
                      </span>
                      {unread && (
                        <span
                          aria-label="Belum dibaca"
                          className="h-2 w-2 shrink-0 rounded-full bg-brand glow-red"
                        />
                      )}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      {n.body}
                    </span>
                    <span className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground/70">
                      <span className="rounded-full bg-white/5 px-2 py-0.5 capitalize">
                        {n.category}
                      </span>
                      {timeAgo(n.time)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-8 rounded-2xl glass px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Demo:</strong> isi notifikasi di atas adalah
        data contoh; status baca/belum-baca disimpan di browser. Notifikasi nyata dibuat
        oleh backend saat ada event (pesanan, listing disetujui, dsb.) — lihat README.
      </p>
    </div>
  );
}
