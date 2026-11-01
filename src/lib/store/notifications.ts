"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Status baca notifikasi (id) + notifikasi tambahan buatan lokal.
 * DEMO: tersimpan di localStorage. Produksi: status baca dikelola backend
 * per pengguna.
 */
interface NotificationsState {
  readIds: string[];
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  markUnread: (id: string) => void;
}

export const useNotifications = create<NotificationsState>()(
  persist(
    (set) => ({
      readIds: [],
      markRead: (id) =>
        set((s) => ({ readIds: s.readIds.includes(id) ? s.readIds : [...s.readIds, id] })),
      markAllRead: (ids) => set({ readIds: ids }),
      markUnread: (id) => set((s) => ({ readIds: s.readIds.filter((i) => i !== id) })),
    }),
    {
      name: "zerostore:notifications",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
