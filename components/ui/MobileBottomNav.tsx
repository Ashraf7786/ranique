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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] pb-safe">
      <div className="flex items-center justify-around h-16">
        
        {/* Home */}
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/' ? 'text-brand-rose' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* WhatsApp */}
        <a 
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-[#25D366]"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>

        {/* Dashboard/Account */}
        <Link 
          href="/account" 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname?.startsWith('/account') ? 'text-brand-rose' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Account</span>
        </Link>

        {/* Cart */}
        <button 
          onClick={openCart}
          className="relative flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand-rose text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </button>

      </div>
    </div>
  );
}
