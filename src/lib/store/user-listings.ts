"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserListing } from "@/lib/types";

type NewUserListing = Omit<UserListing, "id" | "createdAt" | "updatedAt">;

/**
 * Listing milik pengguna (form Jual Akun): draft & pengajuan.
 * DEMO: disimpan di localStorage. Produksi: disimpan di database via API
 * server, dan gambar diunggah ke object storage — bukan di browser.
 */
interface UserListingsState {
  listings: UserListing[];
  add: (listing: NewUserListing) => UserListing;
  remove: (id: string) => void;
  updateStatus: (id: string, status: UserListing["status"]) => void;
  clear: () => void;
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useUserListings = create<UserListingsState>()(
  persist(
    (set, get) => ({
      listings: [],
      add: (data) => {
        const now = new Date().toISOString();
        const listing: UserListing = { ...data, id: genId("usr"), createdAt: now, updatedAt: now };
        set((s) => ({ listings: [listing, ...s.listings] }));
        return listing;
      },
      remove: (id) => set((s) => ({ listings: s.listings.filter((l) => l.id !== id) })),
      updateStatus: (id, status) =>
        set((s) => ({
          listings: s.listings.map((l) =>
            l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l,
          ),
        })),
      clear: () => set({ listings: [] }),
    }),
    {
      name: "zerostore:user-listings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export { genId };
