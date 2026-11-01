"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Order } from "@/lib/types";

/**
 * Pesanan lokal (alur checkout demo).
 *
 * ⚠️ HONESTY NOTE: pesanan di sini HANYA tersimpan di browser dan TIDAK
 * berarti transaksi sungguhan. Pembayaran, verifikasi, dan pengelolaan
 * pesanan wajib dilakukan di backend tepercaya (payment gateway + server).
 * Status dari browser tidak boleh dianggap bukti pembayaran.
 */
interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  clear: () => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      clear: () => set({ orders: [] }),
    }),
    {
      name: "zerostore:orders",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
