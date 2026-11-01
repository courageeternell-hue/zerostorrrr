"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, Plus, User, type LucideIcon } from "lucide-react";
import { useFavorites } from "@/lib/store/favorites";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact: boolean;
  center?: boolean;
}

const ITEMS: NavItem[] = [
  { href: "/", label: "Beranda", icon: Home, exact: true },
  { href: "/kategori", label: "Kategori", icon: LayoutGrid, exact: false },
  { href: "/jual", label: "Jual", icon: Plus, exact: false, center: true },
  { href: "/favorit", label: "Favorit", icon: Heart, exact: false },
  { href: "/profil", label: "Profil", icon: User, exact: false },
];

/**
 * Navigasi bawah mobile — 5 menu, indikator aktif merah,
 * menghormati safe area perangkat (Android/iOS notch).
 */
export function BottomNav() {
  const pathname = usePathname();
  const mounted = useMounted();
  const favCount = useFavorites((s) => s.ids.length);

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
    >
      <div className="glass-strong border-x-0 border-b-0 px-2 pb-safe">
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            if (item.center) {
              return (
                <li key={item.href} className="flex items-start justify-center">
                  <Link
                    href={item.href}
                    aria-label="Jual akun"
                    aria-current={active ? "page" : undefined}
                    className="-mt-5 flex flex-col items-center gap-0.5 rounded-2xl focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl transition-all",
                        active
                          ? "bg-brand text-white glow-red"
                          : "bg-brand text-white shadow-lg shadow-brand/40",
                      )}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2.4} />
                    </span>
                    <span className="text-[11px] font-medium text-foreground/80">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-xl py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    active ? "text-brand" : "text-foreground/65 hover:text-foreground",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-0 h-[3px] w-7 rounded-full bg-brand transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="relative">
                    <Icon
                      className="h-[22px] w-[22px]"
                      strokeWidth={active ? 2.4 : 1.9}
                    />
                    {item.href === "/favorit" && mounted && favCount > 0 && (
                      <span
                        aria-hidden
                        className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white"
                      >
                        {favCount > 9 ? "9+" : favCount}
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
