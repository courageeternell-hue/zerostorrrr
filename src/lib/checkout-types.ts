import type { Order } from "@/lib/types";

export type { Order };

/** Metode pembayaran yang tersedia pada alur checkout demo. */
export type PaymentMethodValue = "transfer_bank" | "ewallet" | "qris";
