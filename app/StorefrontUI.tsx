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
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] p-6 text-center">
      <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-3xl border border-brand-border">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-ink mb-6 font-semibold">
          Website Under Upgrades
        </h1>
        <p className="text-lg md:text-xl text-brand-slate mb-10 leading-relaxed">
          We are currently experiencing high traffic and are upgrading our servers to provide you with a faster, seamless shopping experience. We will be back online shortly!
        </p>
        
        <div className="bg-brand-rose/5 p-6 rounded-2xl border border-brand-rose/20">
          <p className="text-brand-ink font-medium mb-4 text-lg">
            In the meantime, you can easily place your orders on:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/919876543210" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#1ebd5a] transition shadow-md"
            >
              Order via WhatsApp
            </a>
            <a 
              href="https://instagram.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition shadow-md"
            >
              DM us on Instagram
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
