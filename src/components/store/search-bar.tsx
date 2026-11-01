"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  variant?: "header" | "hero";
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

/** Kolom pencarian akun game — mengarah ke /cari?q=... */
export function SearchBar({
  variant = "header",
  placeholder = "Cari akun game, skin, atau rank...",
  className,
  autoFocus,
  onSubmitted,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    onSubmitted?.();
    router.push(q ? `/cari?q=${encodeURIComponent(q)}` : "/katalog");
  }

  const isHero = variant === "hero";

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn(
        "relative flex items-center",
        isHero ? "h-12 md:h-14" : "h-10",
        "rounded-full glass px-4",
        isHero && "px-5 shadow-lg shadow-black/40",
        className,
      )}
    >
      <Search
        aria-hidden
        className={cn("shrink-0 text-muted-foreground", isHero ? "h-5 w-5" : "h-4 w-4")}
      />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Cari akun game"
        className={cn(
          "w-full bg-transparent outline-none placeholder:text-muted-foreground/70",
          isHero ? "px-3 text-base" : "px-2.5 text-sm",
          "[&::-webkit-search-cancel-button]:hidden",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            inputRef.current?.focus();
          }}
          aria-label="Hapus teks pencarian"
          className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isHero && (
        <button
          type="submit"
          className="ml-2 shrink-0 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-strong active:scale-[0.97]"
        >
          Cari
        </button>
      )}
    </form>
  );
}
