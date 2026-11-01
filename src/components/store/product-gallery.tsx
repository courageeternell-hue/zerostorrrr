"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Galeri gambar produk: gambar utama + thumbnail yang bisa diklik. */
export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl glass">
        <Image
          key={current}
          src={current}
          alt={`Galeri akun: ${title} (gambar ${active + 1})`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {active + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3" role="tablist" aria-label="Pilih gambar">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Lihat gambar ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/3] w-20 overflow-hidden rounded-xl ring-1 transition-all md:w-24",
                i === active
                  ? "ring-2 ring-brand"
                  : "opacity-60 ring-white/15 hover:opacity-100",
              )}
            >
              <Image src={img} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
