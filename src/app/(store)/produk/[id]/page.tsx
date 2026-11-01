import type { Metadata } from "next";
import { ProductView } from "@/components/store/product-view";
import { getListingById } from "@/lib/listings";
import { gameName } from "@/lib/games";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: "Listing tidak ditemukan" };
  return {
    title: listing.title,
    description: `${listing.title} — akun ${gameName(listing.game)} seharga ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(listing.price)} di ZERO STORE.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductView id={id} />;
}
