"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Favorit pengguna.
 *
 * DEMO: disimpan di localStorage browser — hanya berlaku di perangkat &
 * browser yang sama. Pada produksi, favorit harus disinkronkan ke backend
 * (mis. tabel `favorites` di Supabase) agar lintas perangkat.
 */
interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((i) => i !== id) : [...s.ids, id],
        })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((i) => i !== id) })),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
    }),
    {
      name: "zerostore:favorites",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
