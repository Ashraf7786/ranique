import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
import { CartProvider } from "@/components/providers/CartProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { StorefrontUI } from "./StorefrontUI";
import { getCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: {
    default: "Ranique — Premium Ladies' Boutique",
    template: "%s | Ranique",
  },
  description:
    "Discover curated premium cosmetics, accessories, bangles, and purses. Ranique — elegance crafted for the modern woman.",
  keywords: ["premium cosmetics", "designer bangles", "premium purses", "women accessories", "Ranique"],
  openGraph: {
    title: "Ranique — Premium Ladies' Boutique",
    description: "Curated premium for the modern woman.",
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ranique.in'),
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`antialiased ${jakarta.variable} overflow-x-hidden w-full`}>
        <GlobalLoader />
        <AuthProvider>
          <CartProvider>
            {/* Skip to content */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-rose focus:text-white focus:rounded-full focus:text-sm"
            >
              Skip to content
            </a>

            <StorefrontUI categories={categories}>
              {children}
            </StorefrontUI>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
