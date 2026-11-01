import type { Metadata } from "next";
import { Store } from "lucide-react";
import { SellForm } from "@/components/store/sell-form";

export const metadata: Metadata = {
  title: "Jual Akun",
  description:
    "Pasang listing akun game-mu di ZERO STORE: gratis, cepat, dan dijelaskan dengan jujur dari awal hingga akhir.",
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-7">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-brand" aria-hidden />
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Jual Akun Game
          </h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Isi detail akunmu dengan jujur dan lengkap. Listing berkualitas dengan foto
          asli dan deskripsi jelas terjual lebih cepat.
        </p>
      </div>
      <SellForm />
    </div>
  );
}
