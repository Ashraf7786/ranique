"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MobileSnackbar } from "@/components/ui/MobileSnackbar";

export function StorefrontUI({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Header />
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
