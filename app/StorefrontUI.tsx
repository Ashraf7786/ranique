"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MobileSnackbar } from "@/components/ui/MobileSnackbar";

export function StorefrontUI({ children, categories }: { children: React.ReactNode, categories?: any[] }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/admin") || pathname?.startsWith("/staff");

  if (isPortal) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Header categories={categories} />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
      <MobileSnackbar />
    </>
  );
}
