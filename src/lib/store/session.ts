"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Sesi demo.
 *
 * ⚠️ HONESTY NOTE: ini BUKAN autentikasi sungguhan. Tidak ada token, tidak
 * ada validasi server, dan tidak boleh dianggap aman. Pada produksi gunakan
 * autentikasi backend (mis. Supabase Auth / NextAuth) dengan cookie httpOnly
 * dan otorisasi per halaman di sisi server.
 */
interface SessionState {
  signedIn: boolean;
  user: { name: string; email: string; handle: string };
  signIn: () => void;
  signOut: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      signedIn: true,
      user: { name: "Player Demo", email: "player.demo@zerostore.test", handle: "@playerdemo" },
      signIn: () => set({ signedIn: true }),
      signOut: () => set({ signedIn: false }),
    }),
    {
      name: "zerostore:session",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
