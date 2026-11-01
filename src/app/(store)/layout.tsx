import { SiteHeader } from "@/components/layout/site-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * Kerangka halaman toko: header sticky, konten, footer sticky-bottom,
 * dan bottom navigation mobile (dengan padding agar tidak menutupi konten).
 */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-28 md:pb-0">{children}</main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
