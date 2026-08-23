"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  ShoppingBag, Sparkles, Star, ChevronRight, Heart, 
  ArrowRight, Truck, RotateCcw, Shield, Gem, Eye, Plus,
  Scissors, Award, Leaf
} from "lucide-react";

// ─── Clothing Category Slugs Set ──────────────────────────────────────────────

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

// Helper to format DB products for the UI cards
function formatDbProduct(p: any) {
  const coverImage = p.images?.find((img: any) => img.isCover)?.url || p.images?.[0]?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600";
  return {
    id: p.id,
    slug: p.slug,
    name: p.title,
    category: p.category?.name || "Clothing",
    price: p.sellingPrice,
    originalPrice: p.originalPrice || p.sellingPrice * 1.5,
    rating: p.rating || 4.8,
    image: coverImage,
    tag: p.badge || (p.isNewArrival ? "New" : undefined)
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClothingCategory {
  id: string;
  label: string;
  tag: string;
  image: string;
  description: string;
  badge?: string;
  textColor: string;
}

interface LookbookItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  tag: string;
  image: string;
  accent: string;
}

interface ProductCard {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  tag?: string;
}

interface SizeGuideEntry {
  size: string;
  chest: string;
  waist: string;
  hip: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAMILY_CATEGORIES = [
  {
    id: "salwar-suits",
    label: "Salwar Suits",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80",
    href: "/shop?category=salwar-kameez",
  },
  {
    id: "lehenga-choli",
    label: "Lehenga choli",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&auto=format&fit=crop&q=80",
    href: "/shop?category=lehenga-choli",
  },
  {
    id: "sarees",
    label: "Sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80",
    href: "/shop?category=saree",
  },
  {
    id: "kurtis",
    label: "Kurtis",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=300&auto=format&fit=crop&q=80",
    href: "/shop?category=kurti",
  },
  {
    id: "gowns-dresses",
    label: "Gowns & Dresses",
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=300&auto=format&fit=crop&q=80",
    href: "/shop?category=dress",
  },
  {
    id: "coord-sets",
    label: "Co-ord Sets",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop&q=80",
    href: "/shop?category=coord-set",
  },
  {
    id: "teen-girls",
    label: "Teen Girls",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&auto=format&fit=crop&q=80",
    href: "/shop?category=girls-clothing",
  },
  {
    id: "little-girls",
    label: "Little Girls",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80",
    href: "/shop?category=girls-clothing",
  },
];

const CLOTHING_CATEGORIES: ClothingCategory[] = [
  {
    id: "kurtas",
    label: "Kurtas & Suits",
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    description: "Elegant ethnic wear for every occasion",
    badge: "New",
    textColor: "text-[#C9748A]"
  },
  {
    id: "western",
    label: "Western Wear",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
    description: "Chic modern styles for the bold woman",
    textColor: "text-[#C9A96E]"
  },
  {
    id: "ethnic",
    label: "Sarees & Lehengas",
    tag: "Festive",
    image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=600&auto=format&fit=crop&q=80",
    description: "Timeless tradition, reimagined beautifully",
    badge: "Hot",
    textColor: "text-[#6B7280]"
  },
  {
    id: "casual",
    label: "Casual & Loungewear",
    tag: "Everyday",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    description: "Comfort that never compromises on style",
    textColor: "text-[#1A1A2E]"
  },
];

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: "1",
    title: "The Festive Edit",
    subtitle: "Diwali & Eid Collection",
    price: "Starting ₹999",
    tag: "Limited Collection",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    accent: "#b76e79"
  },
  {
    id: "2",
    title: "Everyday Chic",
    subtitle: "Office to Evening",
    price: "Starting ₹599",
    tag: "Popular Choice",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
    accent: "#b76e79"
  },
  {
    id: "3",
    title: "Weekend Luxe",
    subtitle: "Premium Casual Wear",
    price: "Starting ₹799",
    tag: "New Arrivals",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    accent: "#b76e79"
  },
];

const MOCK_PRODUCTS: ProductCard[] = [
  {
    id: "p1",
    name: "Classic Silk Anarkali Suit Set",
    category: "Kurtas & Suits",
    price: 1899,
    originalPrice: 2999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    tag: "Best Seller"
  },
  {
    id: "p2",
    name: "Pastel Mint Floral Chiffon Lehenga",
    category: "Sarees & Lehengas",
    price: 2499,
    originalPrice: 3999,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    tag: "Trending"
  },
  {
    id: "p3",
    name: "Tailored Premium Linen Co-ord Set",
    category: "Western Wear",
    price: 1299,
    originalPrice: 1999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
    tag: "New"
  },
  {
    id: "p4",
    name: "Luxe Cotton Ribbed Loungewear Set",
    category: "Casual & Loungewear",
    price: 999,
    originalPrice: 1499,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
  }
];

const SIZE_GUIDE: SizeGuideEntry[] = [
  { size: "XS", chest: "32\"", waist: "25\"", hip: "35\"" },
  { size: "S",  chest: "34\"", waist: "27\"", hip: "37\"" },
  { size: "M",  chest: "36\"", waist: "29\"", hip: "39\"" },
  { size: "L",  chest: "38\"", waist: "31\"", hip: "41\"" },
  { size: "XL", chest: "40\"", waist: "33\"", hip: "43\"" },
  { size: "XXL",chest: "42\"", waist: "35\"", hip: "45\"" },
];

const STYLE_TAGS = [
  "Ethnic", "Casual", "Formal", "Party Wear", "Summer",
  "Winter", "Festive", "Daily Wear", "Bridal", "Western",
];

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <>{count.toLocaleString("en-IN")}{suffix}</>;
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const [activeTag, setActiveTag] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTag(prev => (prev + 1) % STYLE_TAGS.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="clothing-hero"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#FAF8F5] pt-12"
    >
      {/* Delicate background blur blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-10 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #F7E8E8 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-35 blur-3xl"
          style={{ background: "radial-gradient(circle, #EEC5CF 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Elegant eyebrow tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#b76e79]/20 bg-[#b76e79]/5">
              <Sparkles className="w-3.5 h-3.5 text-[#b76e79]" />
              <span className="text-xs font-bold tracking-widest text-[#b76e79] uppercase">
                RANiQUE ATELiER
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A2E] leading-[1.12]">
              The Art of <br />
              <span className="italic font-normal text-[#b76e79]">Modern Indian</span> <br />
              Dressing.
            </h1>

            {/* Subtext description */}
            <p className="text-gray-600 text-base sm:text-lg max-w-xl leading-relaxed">
              Discover curated luxury apparel crafted for the contemporary woman. Silhouettes where rich Indian heritage seamlessly blends with global fashion trends.
            </p>

            {/* Active style tagline */}
            <div className="flex items-center gap-2 text-sm text-[#b76e79] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b76e79] animate-pulse" />
              <span>Perfect for: <strong className="underline decoration-1">{STYLE_TAGS[activeTag]}</strong></span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/shop?category=clothing"
                id="clothing-hero-shop-btn"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm text-white bg-brand-ink hover:bg-gray-800 transition-all duration-300 shadow-lg active:scale-95"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                Shop The Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#categories"
                id="clothing-hero-explore-btn"
                className="inline-flex items-center gap-1 px-8 py-4 rounded-full font-bold text-sm text-[#1A1A2E] border border-gray-300 hover:border-brand-ink transition-colors active:scale-95"
              >
                Explore Categories
              </Link>
            </div>

            {/* Counters */}
            <div className="pt-8 border-t border-gray-200/80 grid grid-cols-3 gap-6 max-w-md">
              {[
                { value: 500, suffix: "+", label: "Unique Silhouettes" },
                { value: 25, suffix: "+", label: "Artisans" },
                { value: 10000, suffix: "+", label: "Happy Customers" },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="font-serif text-2xl font-bold text-[#1A1A2E]">
                    <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-2xs uppercase font-bold tracking-wider text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Right Image Grid Column */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            
            {/* Background luxury frame */}
            <div className="absolute inset-0 bg-[#e8ddd9]/20 rounded-3xl -rotate-2 transform scale-95 pointer-events-none" />

            {/* Overlapping grid */}
            <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=85" 
                alt="Ranique Fashion Model" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay card */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-2xs uppercase tracking-widest text-gray-400 font-bold">Latest Drop</p>
                  <h4 className="font-serif text-sm font-bold text-[#1A1A2E] mt-0.5">The Chiffon Silk Series</h4>
                </div>
                <Link 
                  href="/shop?category=clothing"
                  className="w-9 h-9 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white hover:bg-[#b76e79] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Overlay secondary thumbnail */}
            <div className="absolute -bottom-8 -left-8 w-36 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden sm:block">
              <img 
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80" 
                alt="Detail Cut" 
                className="w-full h-full object-cover"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const items = [
    { icon: <Truck className="w-5 h-5 text-[#b76e79]" />, label: "Free Shipping", desc: "Above ₹999 across India" },
    { icon: <RotateCcw className="w-5 h-5 text-[#b76e79]" />, label: "Easy Returns", desc: "7-day hassle-free returns" },
    { icon: <Shield className="w-5 h-5 text-[#b76e79]" />, label: "100% Quality Fabric", desc: "Ethically sourced cottons & silks" },
    { icon: <Gem className="w-5 h-5 text-[#b76e79]" />, label: "Artisanal Details", desc: "Designed for premium fit" },
  ];

  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-xs sm:text-sm text-[#1A1A2E]">{item.label}</p>
                <p className="text-2xs text-gray-500 mt-0.5 hidden sm:block">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Family Categories Section ─────────────────────────────────────────────────

// ─── Family Categories Section ─────────────────────────────────────────────────

interface FamilyCategoriesSectionProps {
  categories: any[];
}

function FamilyCategoriesSection({ categories }: FamilyCategoriesSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide effect when there are > 7 categories
  useEffect(() => {
    if (categories.length <= 7 || isHovered) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const itemWidth = 114; // width (90px) + gap (24px)
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: itemWidth, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [categories.length, isHovered]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 240;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-12 border-b border-gray-100 relative group/family-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Left Scroll Button */}
        {categories.length > 7 && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-12 z-10 p-1.5 rounded-full bg-white/90 shadow-md border border-gray-150 text-gray-700 hover:text-[#b76e79] opacity-0 group-hover/family-section:opacity-100 transition-opacity hidden md:flex items-center justify-center focus:outline-none"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Horizontal scrollable row of categories */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center gap-6 overflow-x-auto pb-4 scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 ${
            categories.length > 7 ? "justify-start" : "justify-start md:justify-center"
          }`}
        >
          {categories.length === 0 ? (
            <p className="w-full text-center text-gray-500 py-4 text-xs font-medium">No family categories available</p>
          ) : (
            categories.map((cat) => {
              const linkHref = cat.href || `/shop?category=${cat.slug}`;
              const imageSrc = cat.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300";

              return (
                <Link
                  key={cat.id}
                  href={linkHref}
                  className="flex flex-col items-center min-w-[90px] group text-center shrink-0 cursor-pointer"
                >
                  {/* Circular Avatar Container */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#b76e79] group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <img
                      src={imageSrc}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  
                  {/* Label */}
                  <span className="mt-3 text-xs sm:text-sm font-medium text-gray-700 group-hover:text-[#b76e79] group-hover:font-semibold transition-colors duration-200">
                    {cat.name}
                  </span>
                </Link>
              );
            })
          )}
        </div>

        {/* Right Scroll Button */}
        {categories.length > 7 && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-12 z-10 p-1.5 rounded-full bg-white/90 shadow-md border border-gray-150 text-gray-700 hover:text-[#b76e79] opacity-0 group-hover/family-section:opacity-100 transition-opacity hidden md:flex items-center justify-center focus:outline-none"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Section title below the categories */}
        <div className="text-center mt-8">
          <h2 className="font-sans text-base sm:text-lg font-bold tracking-[0.2em] text-[#1A1A2E] uppercase">
            FOR EVERY MEMBER OF THE FAMILY
          </h2>
          <div className="h-[2px] w-12 bg-[#b76e79] mx-auto mt-3" />
        </div>

      </div>
    </section>
  );
}


// ─── Category Grid ────────────────────────────────────────────────────────────

interface CategoryGridProps {
  categories: any[];
}

function CategoryGrid({ categories }: CategoryGridProps) {
  // Show up to the first 4 visible categories for the grid
  const displayCategories = categories.slice(0, 4);

  return (
    <section id="categories" className="bg-[#FAF8F5] py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-bold tracking-widest uppercase text-[#b76e79]">THE COLLECTION</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">Shop By Category</h2>
          <div className="h-0.5 w-12 bg-[#b76e79] mx-auto my-3" />
          <p className="text-gray-500 text-sm">
            Discover a range of tailored fits from elegant Indian ethnics to clean contemporary westerns.
          </p>
        </div>

        {displayCategories.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-sm font-medium">No collections available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map((cat, idx) => {
              const linkHref = cat.href || `/shop?category=${cat.slug}`;
              const imageSrc = cat.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600";
              const tagText = `${cat.name.toUpperCase()} EDIT`;
              const badgeText = idx === 0 ? "New" : idx === 1 ? "Hot" : undefined;

              return (
                <Link
                  key={cat.id}
                  href={linkHref}
                  id={`clothing-cat-${cat.slug}`}
                  className="group relative h-[360px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image background */}
                  <img 
                    src={imageSrc} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge */}
                  {badgeText && (
                    <span className="absolute top-4 right-4 text-[9px] font-bold bg-[#FAF8F5] text-[#1A1A2E] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      {badgeText}
                    </span>
                  )}

                  {/* Text content card on top of image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col h-1/2 justify-end text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#EEC5CF] mb-1">
                      {tagText}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white mb-2 leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed line-clamp-2 mb-4">
                      {cat.description || "Explore curated styling collections created for special events and everyday premium luxury."}
                    </p>
                    <span className="text-xs font-bold text-white flex items-center gap-1 group-hover:underline">
                      Shop collection
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Product Card Item Component ──────────────────────────────────────────────

function ProductItemCard({ prod }: { prod: any }) {
  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-3xl p-3 hover:shadow-lg transition-all duration-300">
      
      {/* Image Frame */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50">
        <img 
          src={prod.image} 
          alt={prod.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {prod.tag && (
          <span className="absolute top-3 left-3 text-[9px] font-bold bg-[#1A1A2E] text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
            {prod.tag}
          </span>
        )}

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button className="p-3 bg-white rounded-full text-brand-ink hover:bg-[#b76e79] hover:text-white shadow-md transition-colors active:scale-95">
            <Heart className="w-4 h-4" />
          </button>
          <Link href={`/product/${prod.slug || prod.id}`} className="p-3 bg-white rounded-full text-brand-ink hover:bg-[#b76e79] hover:text-white shadow-md transition-colors active:scale-95">
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Text Meta Info */}
      <div className="p-3 text-left flex-1 flex flex-col justify-between">
        <div>
          <p className="text-3xs uppercase tracking-wider text-gray-400 font-bold">{prod.category}</p>
          <h3 className="text-sm font-semibold text-[#1A1A2E] mt-1 group-hover:text-[#b76e79] transition-colors line-clamp-1">
            {prod.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3.5 h-3.5 fill-[#b76e79] stroke-[#b76e79]" />
            <span className="text-xs text-gray-600 font-bold">{prod.rating}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-gray-50">
          <span className="text-sm font-bold text-[#1A1A2E]">₹{prod.price.toLocaleString()}</span>
          {prod.originalPrice > prod.price && (
            <span className="text-2xs text-gray-400 line-through">₹{prod.originalPrice.toLocaleString()}</span>
          )}
          
          <Link 
            href={`/product/${prod.slug || prod.id}`}
            className="ml-auto w-7 h-7 rounded-full bg-gray-50 hover:bg-[#b76e79] hover:text-white flex items-center justify-center text-gray-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}

// ─── Trending / Featured Products Section ──────────────────────────────────────

function TrendingSection({ products }: { products: any[] }) {
  const displayProducts = products.length > 0 ? products.slice(0, 4) : MOCK_PRODUCTS;

  return (
    <section className="bg-white py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-12">
          <div className="text-left space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase text-[#b76e79]">BEST SELLERS</p>
            <h2 className="font-serif text-3xl font-bold text-[#1A1A2E]">Trending Styles</h2>
          </div>
          <Link 
            href="/shop?category=clothing"
            className="text-sm font-bold text-[#b76e79] hover:text-[#1A1A2E] flex items-center gap-1 group"
          >
            Explore all items
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((prod) => (
            <ProductItemCard key={prod.id} prod={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── New Arrivals Section ─────────────────────────────────────────────────────

function NewArrivalsSection({ products }: { products: any[] }) {
  // Filter where isNewArrival or newest, take top 4
  const displayProducts = products.length > 0 
    ? products.filter((p: any) => p.tag === 'New' || p.isNewArrival).slice(0, 4)
    : MOCK_PRODUCTS.slice(0, 4);

  return (
    <section className="bg-[#FAF8F5] py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-12">
          <div className="text-left space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase text-[#b76e79]">JUST IN</p>
            <h2 className="font-serif text-3xl font-bold text-[#1A1A2E]">New Arrivals</h2>
          </div>
          <Link 
            href="/shop?category=clothing"
            className="text-sm font-bold text-[#b76e79] hover:text-[#1A1A2E] flex items-center gap-1 group"
          >
            See what's new
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((prod) => (
            <ProductItemCard key={prod.id} prod={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Recently Viewed Section (Clothes Only) ───────────────────────────────────

function RecentlyViewedSection() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    async function fetchRecentlyViewed() {
      try {
        const res = await fetch("/api/recently-viewed");
        const data = await res.json();
        if (data.products) {
          // Filter to only include clothing products
          const clothes = data.products
            .filter((p: any) => {
              const catSlug = p.category || '';
              return CLOTHING_SLUGS.has(catSlug) || p.categoryId === 'womens-clothing';
            })
            .map((p: any) => formatDbProduct(p));
          setProducts(clothes);
        }
      } catch (error) {
        console.error("Failed to fetch recently viewed clothes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentlyViewed();
  }, [session]);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-12">
          <div className="text-left space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase text-[#b76e79]">YOUR HISTORY</p>
            <h2 className="font-serif text-3xl font-bold text-[#1A1A2E]">Recently Viewed</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductItemCard key={prod.id} prod={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Lookbook / Editorial Section ─────────────────────────────────────────────

function LookbookSection() {
  return (
    <section id="lookbook" className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-bold tracking-widest uppercase text-[#b76e79]">INSPIRATION</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">The Atelier Lookbook</h2>
          <div className="h-0.5 w-12 bg-[#b76e79] mx-auto my-3" />
          <p className="text-gray-500 text-sm">Explore editorial styling collections created for special events and everyday premium luxury.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LOOKBOOK_ITEMS.map((item) => (
            <div
              key={item.id}
              id={`lookbook-card-${item.id}`}
              className="relative rounded-3xl overflow-hidden group h-[400px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Cover model image */}
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Shimmer gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Top badges */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white border border-white/20"
                  style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
                >
                  {item.tag}
                </span>
              </div>

              {/* Wishlist action */}
              <button
                className="absolute top-4 right-4 z-10 p-2 rounded-full text-white border border-white/20 transition-all duration-200 hover:scale-110"
                style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <p className="text-xs font-semibold mb-1" style={{ color: '#EEC5CF' }}>
                  {item.subtitle}
                </p>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                  {item.title}
                </h3>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <span className="text-sm font-semibold text-white/95">{item.price}</span>
                  <Link
                    href="/shop?category=clothing"
                    className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full text-xs font-bold text-[#1A1A2E] bg-white hover:bg-[#b76e79] hover:text-white transition-colors"
                  >
                    Shop Edit
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Style Filter Tags ─────────────────────────────────────────────────────────

function StyleFilterSection() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (tag: string) => {
    setSelected(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <section className="py-16 bg-[#FAF8F5] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-left space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
              Shop By Occasion
            </h2>
            <p className="text-xs text-gray-500">Filter and discover apparel tailored for specific styling rules.</p>
          </div>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-xs text-[#b76e79] font-bold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {STYLE_TAGS.map(tag => (
            <button
              key={tag}
              id={`style-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => toggle(tag)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                selected.includes(tag)
                  ? "bg-[#1A1A2E] text-white border-[#1A1A2E] shadow-md scale-105"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#b76e79] hover:text-[#b76e79]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Link
              href={`/shop?category=clothing&tags=${selected.join(',')}`}
              id="style-filter-shop-btn"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-brand-ink hover:bg-gray-800 transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop Selected ({selected.length})
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Size Guide ────────────────────────────────────────────────────────────────

function SizeGuideSection() {
  return (
    <section id="size-guide" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-bold tracking-widest uppercase text-[#b76e79]">MEASUREMENT GUIDE</p>
          <h2 className="font-serif text-3xl font-bold text-[#1A1A2E]">Atelier Size Guide</h2>
          <div className="h-0.5 w-12 bg-[#b76e79] mx-auto my-3" />
          <p className="text-gray-500 text-sm">Compare body measurements to find your perfect luxury fit (inches).</p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-gray-100">
                {["Size", "Chest", "Waist", "Hip"].map(h => (
                  <th key={h} className="py-4 px-6 text-left font-bold text-[#1A1A2E] text-2xs uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row, i) => (
                <tr
                  key={row.size}
                  className={`border-b border-gray-100 transition-colors hover:bg-[#FAF8F5]/80 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#FAF8F5]/30"
                  }`}
                >
                  <td className="py-4 px-6 font-bold text-[#b76e79] text-xs">{row.size}</td>
                  <td className="py-4 px-6 text-gray-700 text-xs font-medium">{row.chest}</td>
                  <td className="py-4 px-6 text-gray-700 text-xs font-medium">{row.waist}</td>
                  <td className="py-4 px-6 text-gray-700 text-xs font-medium">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Why Ranique Clothes ───────────────────────────────────────────────────────

function WhyUsSection() {
  const points = [
    {
      icon: <Scissors className="w-5 h-5 text-[#EEC5CF]" />,
      title: "Tailored For Indian Bodies",
      desc: "Silhouettes, waistlines, and sleeve cuts designed precisely to flatter the natural proportions of Indian women.",
    },
    {
      icon: <Award className="w-5 h-5 text-[#EEC5CF]" />,
      title: "Handpicked Premium Fabric",
      desc: "Pure cottons, breathable linens, and rich organic silks selected to keep you fresh and elegant all day long.",
    },
    {
      icon: <Gem className="w-5 h-5 text-[#EEC5CF]" />,
      title: "Limited Atelier Collections",
      desc: "We create in low-volume batches. Each dress has minor variations, making your look completely exclusive.",
    },
    {
      icon: <Leaf className="w-5 h-5 text-[#EEC5CF]" />,
      title: "Sustainably Crafted",
      desc: "100% fair wages for our master artisans and weavers. Handloomed fabrics that preserve heritage craftsmanship.",
    },
  ];

  return (
    <section className="py-24 bg-brand-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <p className="text-xs font-bold tracking-widest uppercase text-[#EEC5CF]">OUR VALUES</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Fashion With a Purpose
          </h2>
          <div className="h-0.5 w-12 bg-[#EEC5CF] mx-auto my-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, i) => (
            <div
              key={i}
              className="rounded-3xl p-7 border border-white/10 hover:border-[#EEC5CF]/30 transition-all duration-300 bg-white/[0.02] flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  {p.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-3">{p.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Banner ─────────────────────────────────────────────────────────

function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-24 bg-[#FAF8F5] border-t border-gray-100 relative overflow-hidden">
      {/* Abstract light graphic background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-[#b76e79]/10" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-[#b76e79]/5" />
      </div>

      <div className="max-w-2xl mx-auto px-4 text-center space-y-6 relative z-10">
        <Sparkles className="w-5 h-5 text-[#b76e79] mx-auto" />
        
        <div className="space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E] tracking-tight">
            Be the First to Know
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            Subscribe to get early access to our seasonal capsule collections, limited-run drops, and exclusive invitations.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
            <input
              type="email"
              id="clothing-newsletter-email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-4 rounded-full border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#b76e79] focus:ring-1 focus:ring-[#b76e79]/30 bg-white transition-all shadow-sm"
            />
            <button
              type="submit"
              id="clothing-newsletter-submit"
              className="px-8 py-4 rounded-full font-bold text-xs text-white bg-[#1A1A2E] hover:bg-[#b76e79] transition-all duration-300 shadow-md uppercase tracking-widest"
            >
              Subscribe
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[#b76e79] font-bold text-sm animate-in zoom-in duration-300 pt-2">
            <Star className="w-4 h-4 fill-[#b76e79] stroke-[#b76e79]" />
            You have successfully joined the Ranique List 💕
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClothingPage() {
  const [clothingProducts, setClothingProducts] = useState<any[]>([]);
  const [clothingCategories, setClothingCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchClothingData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products?status=PUBLISHED"),
          fetch("/api/categories?storeType=CLOTHING&visible=true")
        ]);

        if (prodRes.ok) {
          const data = await prodRes.json();
          if (Array.isArray(data)) {
            // Filter to select clothing categories only
            const clothes = data
              .filter((p: any) => {
                const catSlug = p.category?.slug || '';
                return CLOTHING_SLUGS.has(catSlug) || p.category?.parentId != null;
              })
              .map((p: any) => formatDbProduct(p));
            setClothingProducts(clothes);
          }
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData)) {
            setClothingCategories(catData.sort((a: any, b: any) => a.sortOrder - b.sortOrder));
          }
        }
      } catch (err) {
        console.error("Failed to load clothing page data:", err);
      }
    }
    fetchClothingData();
  }, []);

  return (
    <main className="bg-[#FAF8F5]">
      <HeroSection />
      <TrustBar />
      <FamilyCategoriesSection categories={clothingCategories} />
      <CategoryGrid categories={clothingCategories} />
      <TrendingSection products={clothingProducts} />
      <NewArrivalsSection products={clothingProducts} />
      <RecentlyViewedSection />
      <LookbookSection />
      <StyleFilterSection />
      <WhyUsSection />
      <SizeGuideSection />
      <NewsletterBanner />

      {/* Footer CTA */}
      <section className="py-24 text-center bg-white border-t border-gray-100 relative overflow-hidden">
        {/* Soft elegant blur background */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 rounded-full bg-[#FAF8F5] blur-3xl" />
          <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-96 h-96 rounded-full bg-[#F7E8E8] blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto px-4 space-y-6 relative z-10">
          <h2 className="font-serif text-4xl font-bold text-[#1A1A2E] tracking-tight">
            Your Style Awaits
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
            Discover a curation of timeless premium drapes and ready-to-wear tailored for standard proportions.
          </p>
          <div className="pt-4">
            <Link
              href="/shop?category=clothing"
              id="clothing-footer-cta"
              className="group inline-flex items-center gap-3 px-10 py-4.5 rounded-full font-bold text-xs text-white bg-[#1A1A2E] hover:bg-[#b76e79] transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 uppercase tracking-widest"
            >
              <ShoppingBag className="w-5 h-5" />
              Explore All Clothing
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
