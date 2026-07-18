"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";

export function StorefrontUI({ children, categories, announcement }: { children: React.ReactNode, categories?: any[], announcement?: any }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/admin") || pathname?.startsWith("/staff");

  if (isPortal) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Header categories={categories} announcement={announcement} />
      <main id="main-content" className="min-h-screen pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
      <MobileBottomNav />
    </>
  );
}
