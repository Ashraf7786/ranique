import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/providers/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "Ranique — Luxury Ladies' Boutique",
    template: "%s | Ranique",
  },
  description:
    "Discover curated luxury cosmetics, accessories, bangles, and purses. Ranique — elegance crafted for the modern woman.",
  keywords: ["luxury cosmetics", "designer bangles", "luxury purses", "women accessories", "Ranique"],
  openGraph: {
    title: "Ranique — Luxury Ladies' Boutique",
    description: "Curated luxury for the modern woman.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <CartProvider>
          {/* Skip to content */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-rose focus:text-white focus:rounded-full focus:text-sm"
          >
            Skip to content
          </a>

          <Header />

          <main id="main-content" className="min-h-screen">
            {children}
          </main>

          <Footer />

          {/* Global cart drawer */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
