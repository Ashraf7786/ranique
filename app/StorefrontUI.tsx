"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";
import { WelcomePopup } from "@/components/ui/WelcomePopup";

export function StorefrontUI({ children, categories, announcement }: { children: React.ReactNode, categories?: any[], announcement?: any }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/admin") || pathname?.startsWith("/staff");

  if (isPortal) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <div className="print:hidden">
        <React.Suspense fallback={<div className="h-16 w-full bg-white border-b border-brand-border" />}>
          <Header categories={categories} announcement={announcement} />
        </React.Suspense>
      </div>
      <main id="main-content" className="min-h-screen pb-16 md:pb-0">
        {children}
      </main>
      <div className="print:hidden">
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
        <MobileBottomNav />
        <WelcomePopup />
      </div>
    </>
  );
}
