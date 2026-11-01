import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Console",
  description: "Dashboard admin ZERO STORE.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !admin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-strong border-x-0 border-t-0">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-8 w-8" />
            <div>
              <p className="font-display text-base font-bold leading-tight tracking-wide">
                ZERO<span className="text-brand">STORE</span>
              </p>
              <p className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                <LayoutDashboard className="h-3 w-3" aria-hidden />
                Admin Console
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex h-9 items-center gap-1.5 rounded-full glass px-4 text-sm font-medium transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Kembali ke Toko</span>
            <span className="sm:hidden">Toko</span>
          </Link>
        </div>
      </header>

      <main className="pb-20">{children}</main>
    </div>
  );
}
