"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

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

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/",           label: "Home" },
  { href: "/shop",       label: "Shop All" },
  { href: "/shop?category=cosmetics",    label: "Cosmetics" },
  { href: "/shop?category=accessories", label: "Accessories" },
  { href: "/shop?category=bangles",     label: "Bangles" },
  { href: "/shop?category=purses",      label: "Purses" },
];

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-brand-ink/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-drawer animate-slide-up">
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center px-3 py-2.5 rounded-xl font-sans text-sm text-brand-ink hover:bg-brand-blush hover:text-brand-rose transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        <div className="bg-brand-rose text-white overflow-hidden py-2 flex items-center">
          <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-medium font-sans w-full">
            Website is under development. You can check our Instagram and order through <a href="https://instagram.com/ranique.official" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-mist transition-colors">@ranique.official</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop / Tablet row */}
          <div className="flex items-center h-16 gap-4">
            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-full hover:bg-brand-mist transition-colors"
            >
              <MenuIcon className="w-5 h-5 text-brand-ink" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 mr-2 flex items-center group transition-colors"
              aria-label="Ranique Home"
            >
              <svg width="130" height="36" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-ink group-hover:text-brand-rose transition-colors duration-300">
                {/* R Monogram */}
                <path d="M14 6h16c7 0 12 4 12 11.5 0 5-3 9-8.5 10.5L43 38h-6.5l-8.5-9.5H19V38h-5V6zm5 4.5V24h10.5c5 0 7.5-2.5 7.5-6.5 0-4.5-3-6.5-8-6.5H19z" fill="currentColor"/>
                {/* anique text */}
                <text x="48" y="32" fontFamily="Georgia, serif" fontSize="26" fontWeight="600" fill="currentColor" letterSpacing="2">anique</text>
                {/* Decorative element on hover */}
                <circle cx="23" cy="22" r="20" stroke="#C9748A" strokeWidth="1.5" className="opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              </svg>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-2">
              {NAV_LINKS.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full text-sm font-sans text-brand-slate hover:text-brand-rose hover:bg-brand-blush transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search — grows to fill space */}
            <SearchBar className="flex-1 max-w-md mx-auto lg:mx-4" />

            {/* Right icons */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                id="header-wishlist-btn"
                aria-label="Wishlist"
                className="relative p-2.5 rounded-full hover:bg-brand-blush transition-colors group"
              >
                <HeartIcon className="w-5 h-5 text-brand-slate group-hover:text-brand-rose transition-colors" />
              </Link>

              {/* Account */}
              <button
                id="header-account-btn"
                aria-label="Account"
                className="relative p-2.5 rounded-full hover:bg-brand-blush transition-colors group"
              >
                <UserIcon className="w-5 h-5 text-brand-slate group-hover:text-brand-rose transition-colors" />
              </button>

              {/* Cart */}
              <button
                id="header-cart-btn"
                onClick={handleCartClick}
                aria-label={mounted ? `Shopping bag, ${totalItems} items` : "Shopping bag"}
                className="relative p-2.5 rounded-full hover:bg-brand-blush transition-colors group"
              >
                <BagIcon className="w-5 h-5 text-brand-slate group-hover:text-brand-rose transition-colors" />
                <CartBadge count={totalItems} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
