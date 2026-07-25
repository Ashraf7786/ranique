"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const WA_NUMBER = "919288467633";
const WA_MESSAGE = encodeURIComponent(
  "Hii Ranique! 🌸 I'd love to place an order. Can you help me?"
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  // Don't show on admin or staff panels
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/staff")) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-2xl border-t border-white/30 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-[60] pb-safe">
      <div className="flex items-center justify-around h-[68px] px-2 relative">
        
        {/* Home */}
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all ${pathname === '/' ? 'text-brand-rose scale-105' : 'text-gray-500 hover:text-brand-rose/80'}`}
        >
          <Home className={`w-5 h-5 ${pathname === '/' ? 'fill-brand-rose/10 stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold">Home</span>
        </Link>

        {/* WhatsApp */}
        <a 
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-brand-rose/10 text-brand-rose group-active:scale-95 transition-transform shadow-sm border border-brand-rose/20">
            <MessageCircle className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <span className="text-[10px] font-semibold text-brand-rose">Chat</span>
        </a>

        {/* Dashboard/Account */}
        <Link 
          href="/account" 
          className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all ${pathname?.startsWith('/account') ? 'text-brand-rose scale-105' : 'text-gray-500 hover:text-brand-rose/80'}`}
        >
          <User className={`w-5 h-5 ${pathname?.startsWith('/account') ? 'fill-brand-rose/10 stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold">Account</span>
        </Link>

        {/* Cart */}
        <button 
          onClick={openCart}
          className="relative flex flex-col items-center justify-center w-full h-full gap-1.5 text-gray-500 hover:text-brand-rose/80 transition-all focus:outline-none active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-rose text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-white">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">Cart</span>
        </button>

      </div>
    </div>
  );
}
