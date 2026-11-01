import type { Metadata } from "next";
import { CheckoutView } from "@/components/store/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Selesaikan pembelian akun game dengan aman di ZERO STORE.",
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CheckoutView id={id} />;
}
