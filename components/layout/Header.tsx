"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { GoogleTranslate } from "./GoogleTranslate";

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11v14" /><path d="M16 3h4l2 4v8h-2" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}


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

function MobileMenu({ isOpen, onClose, categories = [], isClothingContext }: { isOpen: boolean; onClose: () => void; categories?: any[], isClothingContext?: boolean }) {
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
          {isClothingContext ? (
            <Link
              href="/shop"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full font-sans text-xs font-bold uppercase tracking-wider border border-gray-200 text-gray-700 hover:border-[#b76e79] hover:text-[#b76e79] transition-all"
            >
              <ShoppingBagIcon className="w-4 h-4" />
              Ranique Store
            </Link>
          ) : (
            <Link
              href="/clothing"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full font-sans text-xs font-bold uppercase tracking-wider border border-gray-200 text-gray-700 hover:border-[#b76e79] hover:text-[#b76e79] transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
              </svg>
              Clothing Hub
            </Link>
          )}
          
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

export function Header({ categories = [], announcement }: { categories?: any[], announcement?: any }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get('category');
  
  const CLOTHING_SLUGS = new Set([
    'kurti','kurti-set','suit','salwar-kameez','sharara','gharara',
    'lehenga','lehenga-choli','saree','readymade-saree','anarkali',
    'palazzo-set','patiala-suit','churidar-suit','dupatta',
    'top','dress','coord-set','jumpsuit','jeans-trousers','skirt',
    'shorts','blazer-jacket','casual-wear','loungewear','night-suit',
    'track-suit','sweater-cardigan','winter-suit',
    'bridal-wear','party-wear','festive-wear','wedding-guest',
    'womens-clothing'
  ]);

  const isClothingContext = pathname?.startsWith('/clothing') || (currentCategory && CLOTHING_SLUGS.has(currentCategory));

  const storeCategories = categories.filter((c: any) => !CLOTHING_SLUGS.has(c.slug));
  const clothingCategories = categories.filter((c: any) => CLOTHING_SLUGS.has(c.slug));

  const displayCategories = isClothingContext ? clothingCategories : storeCategories;

  const { items, openCart, totalItems } = useCart();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        {/* Announcement Bar — CSS Marquee Ticker */}
        {announcement && announcement.isActive && (
          <div className="relative bg-gradient-to-r from-brand-rose via-[#be5c75] to-brand-rose text-white overflow-hidden h-9 sm:h-10 border-b border-[#a84f68] shadow-sm animate-ticker-in">
            {/* Live dot */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 badge-blink shrink-0" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-200 hidden sm:inline">Live</span>
            </div>

            {/* CSS Marquee — SVG icons only */}
            <div className="marquee-wrapper h-full items-center flex pl-14 sm:pl-20 pr-16">
              <div className="marquee-track items-center">
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex items-center">
                    {[
                      { Icon: ShoppingBagIcon, text: announcement.text },
                      { Icon: TruckIcon,       text: "Free Shipping on Orders above 999" },
                      { Icon: StarIcon,        text: "New Arrivals Every Week" },
                      { Icon: ShieldIcon,      text: "Premium Quality Guaranteed" },
                      { Icon: PackageIcon,     text: "COD Available Pan-India" },
                    ].map(({ Icon, text }, i) => (
                      <span key={i} className="flex items-center gap-2 px-5 text-xs sm:text-sm font-medium whitespace-nowrap">
                        <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span dangerouslySetInnerHTML={{ __html: text }} />
                        <span className="w-px h-3 bg-white/30 shrink-0" />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Blinking SALE badge */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none hidden sm:flex items-center">
              <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-black rounded tracking-widest uppercase badge-blink">SALE</span>
            </div>
          </div>
        )}
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
                href={isClothingContext ? "/clothing" : "/"}
                className="shrink-0 flex items-center group transition-colors"
                aria-label="Ranique Home"
              >
                <div className="flex items-center group-hover:opacity-80 transition-opacity duration-300">
                  <Image src="/logo.svg" alt="Ranique Logo" width={130} height={40} className="w-[110px] sm:w-[130px] h-auto" priority />
                </div>
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-2 ml-6 relative">
              {/* Clothing Hub / Store Hub Link */}
              {isClothingContext ? (
                <Link
                  href="/shop"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 inline-flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:border-[#b76e79] hover:text-[#b76e79]"
                >
                  <ShoppingBagIcon className="w-3.5 h-3.5" />
                  Ranique Store
                </Link>
              ) : (
                <Link
                  href="/clothing"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 inline-flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:border-[#b76e79] hover:text-[#b76e79]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
                  </svg>
                  Clothing Hub
                </Link>
              )}

              <div className="group relative">
                <Link
                  href="/shop"
                  className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#b76e79] hover:bg-gray-50 transition-all duration-150 inline-flex items-center gap-1"
                >
                  Shop All
                  <svg className="w-3 h-3 text-gray-400 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </Link>
                
                {/* Mega Menu Dropdown */}
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white border border-brand-border shadow-xl rounded-2xl p-4 min-w-[320px] max-w-[80vw] max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="mb-3 px-3">
                      <p className="text-xs font-semibold text-brand-slate uppercase tracking-wider">{isClothingContext ? "Clothing Categories" : "Store Categories"}</p>
                    </div>
                    <div className={cn("grid gap-1", displayCategories.length > 10 ? "grid-cols-2 gap-x-4" : "grid-cols-1")}>
                      {displayCategories.map((cat: any) => {
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

              {displayCategories.slice(0, 5).map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#b76e79] transition-all duration-150 capitalize"
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
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-brand-border rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-brand-border mb-1">
                      <p className="text-sm font-semibold text-brand-ink truncate">{session.user?.name || (session.user as any)?.firstName || "User"}</p>
                      <p className="text-xs text-brand-slate truncate">{session.user?.email}</p>
                    </div>

                    {(session.user as any)?.role === "ADMIN" ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-brand-ink hover:bg-brand-mist transition-colors"
                        >
                          Admin Panel
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-brand-ink hover:bg-brand-mist transition-colors"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-brand-ink hover:bg-brand-mist transition-colors"
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-brand-ink hover:bg-brand-mist transition-colors"
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
                      className="block w-full text-left px-4 py-2 text-sm text-brand-rose hover:bg-brand-blush transition-colors border-t border-brand-border mt-1"
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
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} categories={displayCategories} isClothingContext={!!isClothingContext} />
    </>
  );
}
