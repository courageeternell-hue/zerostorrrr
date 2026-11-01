import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZERO STORE — Marketplace Jual Beli Akun Game",
    template: "%s | ZERO STORE",
  },
  description:
    "ZERO STORE adalah marketplace premium untuk jual beli akun game: Free Fire, Mobile Legends, PUBG Mobile, Roblox, Genshin Impact, dan lainnya. Cari, favoritkan, dan checkout akun impianmu.",
  keywords: [
    "jual akun game",
    "beli akun game",
    "marketplace akun game",
    "ZERO STORE",
    "akun Free Fire",
    "akun Mobile Legends",
  ],
  applicationName: "ZERO STORE",
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "ZERO STORE — Marketplace Jual Beli Akun Game",
    description:
      "Temukan akun game impianmu. Marketplace gaming premium dengan UI glassmorphism gelap.",
    siteName: "ZERO STORE",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(16,16,22,0.92)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              color: "#f4f4f6",
            },
          }}
        />
      </body>
    </html>
  );
}
