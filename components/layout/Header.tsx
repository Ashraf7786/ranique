"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { GoogleTranslate } from "./GoogleTranslate";

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function BagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" x2="21" y1="6" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" />
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// ─── Cart Badge ────────────────────────────────────────────────────────────────

function CartBadge({ count }: { count: number }) {
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const prevCount = useRef(count);

  // Only render after client hydration to avoid localStorage mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (count !== prevCount.current && count > 0) {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 450);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
  }, [count, mounted]);

  // Don't render on server or before hydration
  if (!mounted || count === 0) return null;

  return (
    <span
      className={cn(
        "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1",
        "bg-brand-rose text-white text-2xs font-bold rounded-full",
        "flex items-center justify-center",
        "transition-all",
        animating && "animate-badge-pop"
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/shop?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative flex items-center", className)}
    >
      <label htmlFor="header-search" className="sr-only">
        Search products
      </label>
      <SearchIcon className="absolute left-3.5 w-4 h-4 text-brand-slate pointer-events-none" />
      <input
        id="header-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search cosmetics, bangles, purses…"
        className={cn(
          "w-full pl-10 pr-4 h-10 rounded-full font-sans text-sm bg-brand-mist",
          "border transition-all duration-200",
          "placeholder:text-brand-slate text-brand-ink",
          "focus:outline-none",
          focused
            ? "border-brand-rose bg-white shadow-sm"
            : "border-brand-border"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-3.5 text-brand-slate hover:text-brand-rose transition-colors"
          aria-label="Clear search"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}

function MobileMenu({ isOpen, onClose, categories = [] }: { isOpen: boolean; onClose: () => void; categories?: any[] }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isNew = (dateString: string) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 14;
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-brand-ink/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-drawer animate-slide-up overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-brand-border">
          <span className="font-serif text-xl font-semibold text-brand-ink">
            Ranique
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-brand-mist"
          >
            <XIcon className="w-5 h-5 text-brand-slate" />
          </button>
        </div>
        <nav className="p-5 space-y-1">
          <div className="mb-4">
            <GoogleTranslate />
          </div>
          <Link href="/" onClick={onClose} className="flex items-center px-3 py-2.5 rounded-xl font-sans text-sm text-brand-ink hover:bg-brand-blush hover:text-brand-rose transition-colors">Home</Link>
          <Link href="/shop" onClick={onClose} className="flex items-center px-3 py-2.5 rounded-xl font-sans text-sm font-semibold text-brand-rose bg-brand-blush">Shop All</Link>
          
          <div className="pt-2 pb-1 px-3 text-xs font-semibold text-brand-slate uppercase tracking-wider">Categories</div>
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl font-sans text-sm text-brand-ink hover:bg-brand-mist transition-colors"
            >
              <span className="capitalize">{cat.name}</span>
              {isNew(cat.createdAt) && (
                <span className="text-[9px] font-bold bg-brand-rose text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">New</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export function Header({ categories = [] }: { categories?: any[] }) {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCartClick = useCallback(() => openCart(), [openCart]);

  return (
    <>
      <header
        className={cn(
           "sticky top-0 z-30 transition-all duration-300",
           scrolled
             ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-brand-border/60"
             : "bg-white border-b border-brand-border"
         )}
       >
         {/* Announcement Bar */}
         <div className="bg-brand-ink text-brand-rose py-2 flex items-center w-full overflow-hidden h-9 sm:h-10 border-b border-brand-rose/20">
           {React.createElement(
             'marquee' as any,
             { scrollamount: "6", className: "w-full text-xs sm:text-sm font-semibold tracking-wide flex items-center" },
             <>
               ✨ First 100 Customers: Use coupon <span className="font-bold underline decoration-white/30 underline-offset-2 text-white">RANIQUE100</span> for up to 25% OFF + FREE Shipping on orders above ₹499! ✨
             </>
           )}
         </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top row */}
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">

            {/* Left Section: Menu & Logo */}
            <div className="flex items-center">
              {/* Mobile hamburger */}
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden p-2 -ml-2 mr-1 rounded-full hover:bg-brand-mist transition-colors"
              >
                <MenuIcon className="w-5 h-5 text-brand-ink" />
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="shrink-0 flex items-center group transition-colors"
                aria-label="Ranique Home"
              >
                <div className="flex items-center group-hover:opacity-80 transition-opacity duration-300">
                  <Image src="/logo.svg" alt="Ranique Logo" width={130} height={40} className="w-[110px] sm:w-[130px] h-auto" priority />
                </div>
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-4 relative">
              <div className="group">
                <Link
                  href="/shop"
                  className="px-3 py-1.5 rounded-full text-sm font-sans font-medium text-brand-rose bg-brand-blush hover:opacity-90 transition-all duration-150 inline-flex items-center gap-1"
                >
                  Shop All
                  <svg className="w-3.5 h-3.5 text-brand-rose opacity-70 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </Link>
                
                {/* Mega Menu Dropdown */}
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white border border-brand-border shadow-xl rounded-2xl p-4 min-w-[320px]">
                    <div className="mb-3 px-3">
                      <p className="text-xs font-semibold text-brand-slate uppercase tracking-wider">All Categories</p>
                    </div>
                    <div className={cn("grid gap-1", categories.length > 5 ? "grid-cols-2 gap-x-4" : "grid-cols-1")}>
                      {categories.map((cat: any) => {
                        const isNew = Math.ceil(Math.abs(new Date().getTime() - new Date(cat.createdAt).getTime()) / (1000 * 60 * 60 * 24)) <= 14;
                        return (
                          <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-sans text-brand-ink hover:bg-brand-blush hover:text-brand-rose transition-colors"
                          >
                            <span className="capitalize truncate pr-2">{cat.name}</span>
                            {isNew && (
                              <span className="text-[9px] font-bold bg-brand-rose text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">New</span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {categories.slice(0, 4).map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="px-3 py-1.5 rounded-full text-sm font-sans text-brand-slate hover:text-brand-rose hover:bg-brand-blush transition-all duration-150 capitalize"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Search (Desktop) */}
            <SearchBar className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8" />

            {/* Right icons */}
            <div className="flex items-center gap-0">
              {/* Google Translate */}
              <div className="hidden sm:block mr-2">
                <GoogleTranslate />
              </div>

              {/* Wishlist */}
              <Link
                href={session ? "/account/wishlist" : "/wishlist"}
                id="header-wishlist-btn"
                aria-label="Wishlist"
                className="relative p-2 sm:p-2.5 rounded-full hover:bg-brand-blush transition-colors group"
              >
                <HeartIcon className="w-5 h-5 text-brand-slate group-hover:text-brand-rose transition-colors" />
              </Link>

              {/* Account / Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    if (session) {
                      setUserDropdownOpen(!userDropdownOpen);
                    } else {
                      router.push("/account");
                    }
                  }}
                  id="header-account-btn"
                  aria-label="Account"
                  className="relative p-2 sm:p-2.5 rounded-full hover:bg-brand-blush transition-colors group flex items-center outline-none"
                >
                  <UserIcon className="w-5 h-5 text-brand-slate group-hover:text-brand-rose transition-colors" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && session && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-sm font-semibold text-brand-ink truncate">{session.user?.name || (session.user as any)?.firstName || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>

                    {(session.user as any)?.role === "ADMIN" ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-mist hover:text-brand-rose transition-colors"
                        >
                          Admin Panel
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-mist hover:text-brand-rose transition-colors"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-mist hover:text-brand-rose transition-colors"
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-mist hover:text-brand-rose transition-colors"
                        >
                          Wishlist
                        </Link>
                      </>
                    )}
                    
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                id="header-cart-btn"
                onClick={handleCartClick}
                aria-label={mounted ? `Shopping bag, ${totalItems} items` : "Shopping bag"}
                className="relative p-2 sm:p-2.5 rounded-full hover:bg-brand-blush transition-colors group"
              >
                <BagIcon className="w-5 h-5 text-brand-slate group-hover:text-brand-rose transition-colors" />
                <CartBadge count={totalItems} />
              </button>
            </div>
          </div>

          {/* Mobile Search Row (Hidden on md and up) */}
          <div className="md:hidden pb-3">
            <SearchBar className="w-full" />
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
      />
    </>
  );
}
