"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ─── SVG Icon Props ────────────────────────────────────────────────────────────

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

// ─── SVG Icon Components ───────────────────────────────────────────────────────

function IconShirt({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
    </svg>
  );
}
function IconDress({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C10 2 8 3 7 5L4 9h3l2 4-4 9h14l-4-9 2-4h3l-3-4c-1-2-3-3-5-3z"/>
    </svg>
  );
}
function IconScarf({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4c2 0 4 1.5 6 3 2-1.5 4-3 6-3"/>
      <path d="M6 4c-.5 4 1 8 2 12"/>
      <path d="M18 4c.5 4-1 8-2 12"/>
      <path d="M8 16c1.5 1 3.5 2 5 2s3.5-1 5-2"/>
    </svg>
  );
}
function IconHanger({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 19H3.62a1 1 0 01-.76-1.65L12 7"/>
      <path d="M12 7V4a2 2 0 014 0"/>
      <path d="M12 7a2 2 0 000 4"/>
    </svg>
  );
}
function IconSparkle({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  );
}
function IconArrow({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
function IconShield({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function IconLeaf({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 014 13V8a7 7 0 017 7v5z"/>
      <path d="M20 9a7 7 0 01-7 7"/>
      <path d="M11 20V13"/>
    </svg>
  );
}
function IconStar({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CLOTHING_CATEGORIES = [
  {
    id: "kurtas",
    label: "Kurtas & Suits",
    sublabel: "Ethnic Elegance",
    href: "/shop?category=kurtas",
    Icon: IconDress,
    gradient: "from-[#F7E8E8] via-[#F3DADA] to-[#EEC5CF]",
    iconColor: "#C9748A",
    accentBar: "#C9748A",
    badge: "Bestseller",
  },
  {
    id: "western",
    label: "Western Wear",
    sublabel: "Modern & Bold",
    href: "/shop?category=western",
    Icon: IconShirt,
    gradient: "from-[#F0DDB8] via-[#EDD5A0] to-[#E8D5A3]",
    iconColor: "#C9A96E",
    accentBar: "#C9A96E",
    badge: "Trending",
  },
  {
    id: "sarees",
    label: "Sarees & Lehengas",
    sublabel: "Timeless Heritage",
    href: "/shop?category=sarees",
    Icon: IconScarf,
    gradient: "from-[#E8EEF7] via-[#D8E5F3] to-[#C5D5EE]",
    iconColor: "#5B7BB8",
    accentBar: "#5B7BB8",
    badge: "Festive",
  },
  {
    id: "casual",
    label: "Casual & Co-ords",
    sublabel: "Effortless Style",
    href: "/shop?category=casual",
    Icon: IconHanger,
    gradient: "from-[#F0F0F0] via-[#E8E5E0] to-[#E0DDD5]",
    iconColor: "#6B7280",
    accentBar: "#6B7280",
  },
];

const USP_CARDS = [
  {
    Icon: IconShield,
    title: "Premium Fabric",
    desc: "Handpicked cottons, silks, and blends for lasting comfort and luxury feel.",
    color: "#C9748A",
    bg: "from-[#F7E8E8] to-[#EEC5CF]",
  },
  {
    Icon: IconStar,
    title: "Designed for You",
    desc: "Every cut tailored for the modern Indian woman's silhouette.",
    color: "#C9A96E",
    bg: "from-[#F0DDB8] to-[#E8D5A3]",
  },
  {
    Icon: IconLeaf,
    title: "Ethically Crafted",
    desc: "Sustainably sourced, fair-trade manufacturing we're proud of.",
    color: "#5B7BB8",
    bg: "from-[#E8EEF7] to-[#C5D5EE]",
  },
];

const LOOKBOOK = [
  {
    id: "lb1",
    title: "The Festive Edit",
    sub: "Diwali & Eid Picks",
    price: "From ₹999",
    dark: true,
    style: { background: "linear-gradient(145deg, #1A1A2E 0%, #2e1d40 60%, #1A1A2E 100%)" },
    accentColor: "#C9748A",
  },
  {
    id: "lb2",
    title: "Everyday Chic",
    sub: "Office to Evening",
    price: "From ₹599",
    dark: true,
    style: { background: "linear-gradient(145deg, #C9748A 0%, #b8607a 50%, #A85970 100%)" },
    accentColor: "#F7E8E8",
  },
  {
    id: "lb3",
    title: "Weekend Luxe",
    sub: "Premium Casuals",
    price: "From ₹799",
    dark: true,
    style: { background: "linear-gradient(145deg, #C9A96E 0%, #b8954d 50%, #a07d35 100%)" },
    accentColor: "#F7E8E8",
  },
];

const SIZE_GUIDE = [
  { size: "XS", chest: "32\"", waist: "25\"", hip: "35\"" },
  { size: "S",  chest: "34\"", waist: "27\"", hip: "37\"" },
  { size: "M",  chest: "36\"", waist: "29\"", hip: "39\"" },
  { size: "L",  chest: "38\"", waist: "31\"", hip: "41\"" },
  { size: "XL", chest: "40\"", waist: "33\"", hip: "43\"" },
  { size: "XXL",chest: "42\"", waist: "35\"", hip: "45\"" },
];

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedStat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const step = Math.ceil(target / (duration / 16));
          let cur = 0;
          const timer = setInterval(() => {
            cur += step;
            if (cur >= target) { setVal(target); clearInterval(timer); }
            else setVal(cur);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-serif text-3xl sm:text-4xl font-bold text-white">
        {val.toLocaleString("en-IN")}{suffix}
      </p>
      <p className="text-sm mt-1" style={{ color: "#C5D5EE" }}>{label}</p>
    </div>
  );
}

// ─── Main Section Component ────────────────────────────────────────────────────

export function ClothingSection() {
  const [sizeHover, setSizeHover] = useState<string | null>(null);

  return (
    <div className="overflow-hidden">

      {/* ── 1. HERO BANNER ─────────────────────────────────────────────────── */}
      <section
        aria-label="Ranique Clothing"
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #2a1730 40%, #1f1035 70%, #1A1A2E 100%)" }}
      >
        {/* Background glow blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[80px]"
            style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full opacity-[0.10] blur-[70px]"
            style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)" }} />
          <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full opacity-[0.12] blur-[70px]"
            style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text */}
            <div>
              {/* Label pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                style={{ borderColor: "rgba(201,116,138,0.4)", background: "rgba(201,116,138,0.10)" }}>
                <IconSparkle className="w-3.5 h-3.5" style={{ color: "#C9748A" } as React.CSSProperties} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#EEC5CF" }}>
                  Introducing Ranique Clothes
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                Dress Like{" "}
                <span className="relative inline-block">
                  <span style={{
                    background: "linear-gradient(135deg, #C9748A 0%, #C9A96E 60%, #EEC5CF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Royalty
                  </span>
                  {/* Underline accent */}
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full opacity-60"
                    style={{ background: "linear-gradient(90deg, #C9748A, #C9A96E)" }} />
                </span>
              </h2>

              <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "#C5D5EE" }}>
                Premium women's clothing crafted for the modern Indian woman — where timeless
                tradition meets contemporary elegance.
              </p>

              {/* Trust micro-badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["100% Authentic Fabric", "Easy 7-Day Returns", "Pan-India Delivery"].map(b => (
                  <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(255,255,255,0.07)", color: "#EEC5CF", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#C9748A" }} />
                    {b}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop?category=clothing"
                  id="clothing-section-shop-btn"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #C9748A 0%, #A85970 100%)", color: "white" }}
                >
                  <IconShirt className="w-4 h-4" />
                  Shop the Collection
                  <IconArrow className="w-4 h-4" />
                </Link>
                <a
                  href="#clothing-categories"
                  id="clothing-section-explore-btn"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm border transition-all duration-300 hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.25)", color: "white" }}
                >
                  Browse Categories
                </a>
              </div>
            </div>

            {/* Right: Stats + floating cards */}
            <div className="hidden lg:block relative">
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <AnimatedStat target={500}   suffix="+" label="Styles" />
                <AnimatedStat target={25}    suffix="+" label="Designers" />
                <AnimatedStat target={10000} suffix="+" label="Customers" />
              </div>

              {/* Floating glassmorphism cards */}
              <div className="relative h-64">
                {/* Card 1 */}
                <div className="absolute top-0 left-0 w-48 rounded-2xl p-4 shadow-2xl"
                  style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <IconDress className="w-8 h-8 mb-2" style={{ color: "#C9748A" } as React.CSSProperties} />
                  <p className="text-white font-semibold text-sm">Festive Edit</p>
                  <p className="text-xs mt-0.5" style={{ color: "#C5D5EE" }}>Diwali & Eid Collection</p>
                  <p className="text-xs font-bold mt-2" style={{ color: "#C9748A" }}>From ₹999</p>
                </div>
                {/* Card 2 */}
                <div className="absolute bottom-0 right-0 w-52 rounded-2xl p-4 shadow-2xl"
                  style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <IconShirt className="w-8 h-8 mb-2" style={{ color: "#C9A96E" } as React.CSSProperties} />
                  <p className="text-white font-semibold text-sm">Western Wear</p>
                  <p className="text-xs mt-0.5" style={{ color: "#C5D5EE" }}>Trending this season</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <IconStar key={i} className="w-3 h-3" style={{ color: "#C9A96E" } as React.CSSProperties} />
                    ))}
                    <span className="text-xs ml-1" style={{ color: "#C5D5EE" }}>(4.9)</span>
                  </div>
                </div>
                {/* Card 3: center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 rounded-2xl p-4 shadow-2xl"
                  style={{ background: "rgba(201,116,138,0.15)", backdropFilter: "blur(16px)", border: "1px solid rgba(201,116,138,0.3)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                    style={{ background: "linear-gradient(135deg, #C9748A, #A85970)" }}>
                    <IconSparkle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white font-bold text-sm">New Season</p>
                  <p className="text-xs mt-0.5" style={{ color: "#EEC5CF" }}>500+ Styles Added</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-14">
            <path d="M0 56V28C360 0 720 56 1080 28C1260 14 1380 0 1440 0V56H0Z" fill="#F5F5F7"/>
          </svg>
        </div>
      </section>

      {/* ── 2. CATEGORY GRID ───────────────────────────────────────────────── */}
      <section
        id="clothing-categories"
        aria-label="Clothing categories"
        className="bg-[#F5F5F7] py-16 sm:py-20 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#C9748A" }}>Browse</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">Shop by Category</h2>
            </div>
            <Link href="/shop?category=clothing"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: "#C9748A" }}>
              View All Clothing
              <IconArrow className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {CLOTHING_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                id={`clothing-cat-${cat.id}`}
                className={`group relative bg-gradient-to-br ${cat.gradient} rounded-2xl overflow-hidden flex flex-col p-6 sm:p-7 min-h-[200px] sm:min-h-[230px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                {/* Accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-all duration-300 group-hover:h-1"
                  style={{ background: cat.accentBar }} />

                {/* Badge */}
                {cat.badge && (
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ background: cat.accentBar }}>
                    {cat.badge}
                  </span>
                )}

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${cat.accentBar}18` }}>
                  <cat.Icon className="w-6 h-6" style={{ color: cat.iconColor } as React.CSSProperties} />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: cat.iconColor }}>
                  {cat.sublabel}
                </p>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A2E] leading-tight mb-1">
                  {cat.label}
                </h3>

                <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-bold transition-all duration-200 group-hover:gap-2.5"
                  style={{ color: cat.iconColor }}>
                  Shop Now
                  <IconArrow className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. EDITORIAL / LOOKBOOK ────────────────────────────────────────── */}
      <section aria-label="Clothing lookbook" className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#C9748A" }}>Editorials</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">
              The Lookbook
            </h2>
            <p className="text-sm text-[#6B7280] mt-2 max-w-sm mx-auto">
              Curated style edits for every woman and every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {LOOKBOOK.map((item, idx) => (
              <Link
                key={item.id}
                href="/shop?category=clothing"
                id={`lookbook-${item.id}`}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-end transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${idx === 0 ? "sm:row-span-2 min-h-[380px]" : "min-h-[175px]"}`}
                style={item.style}
              >
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

                {/* Glass icon top-right */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <IconHanger className="w-5 h-5 text-white" />
                </div>

                {/* Content at bottom */}
                <div className="relative z-10 p-5 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <p className="text-xs font-semibold mb-1" style={{ color: item.accentColor, opacity: 0.9 }}>
                    {item.sub}
                  </p>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-semibold text-white/90">{item.price}</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 group-hover:gap-2"
                      style={{ background: item.accentColor, color: "#1A1A2E" }}>
                      Shop
                      <IconArrow className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. USP STRIP ───────────────────────────────────────────────────── */}
      <section
        aria-label="Why choose Ranique Clothes"
        className="py-14 sm:py-16"
        style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #2a1730 60%, #1A1A2E 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Crafted With{" "}
              <span style={{
                background: "linear-gradient(135deg, #C9748A, #C9A96E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Care</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {USP_CARDS.map((card) => (
              <div
                key={card.title}
                className={`rounded-2xl p-6 bg-gradient-to-br ${card.bg} group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${card.color}20` }}>
                  <card.Icon className="w-5 h-5" style={{ color: card.color } as React.CSSProperties} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1A1A2E] mb-1.5">{card.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. SIZE GUIDE ──────────────────────────────────────────────────── */}
      <section aria-label="Clothing size guide" className="bg-[#F7E8E8] py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#C9748A" }}>Fit Guide</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A2E]">Find Your Size</h2>
              <p className="text-sm text-[#6B7280] mt-1">All measurements in inches</p>
            </div>
            <Link href="/shop?category=clothing"
              className="inline-flex items-center gap-1.5 text-sm font-bold transition-colors self-start sm:self-auto"
              style={{ color: "#C9748A" }}>
              Shop Now <IconArrow className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: "#E8DDD9" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #C9748A 0%, #A85970 100%)" }}>
                  {["Size", "Chest", "Waist", "Hip"].map(h => (
                    <th key={h} className="py-3.5 px-5 text-left font-bold text-white text-xs uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.map((row, i) => (
                  <tr
                    key={row.size}
                    onMouseEnter={() => setSizeHover(row.size)}
                    onMouseLeave={() => setSizeHover(null)}
                    className="border-b cursor-default transition-colors duration-150"
                    style={{
                      borderColor: "#E8DDD9",
                      background: sizeHover === row.size
                        ? "linear-gradient(90deg, #F7E8E8, #fdf4f4)"
                        : i % 2 === 0 ? "#ffffff" : "#fdf9f9",
                    }}
                  >
                    <td className="py-4 px-5 font-bold" style={{ color: "#C9748A" }}>{row.size}</td>
                    <td className="py-4 px-5 text-[#1A1A2E]">{row.chest}</td>
                    <td className="py-4 px-5 text-[#1A1A2E]">{row.waist}</td>
                    <td className="py-4 px-5 text-[#1A1A2E]">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA BANNER ────────────────────────────────────────────── */}
      <section
        aria-label="Shop Ranique Clothes CTA"
        className="py-16 sm:py-20"
        style={{ background: "linear-gradient(135deg, #F7E8E8 0%, #EEC5CF 40%, #F0DDB8 100%)" }}
      >
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md"
            style={{ background: "linear-gradient(135deg, #C9748A, #A85970)" }}>
            <IconDress className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-3">
            Your Style Awaits
          </h2>
          <p className="text-[#6B7280] text-sm sm:text-base mb-8 max-w-md mx-auto">
            Explore hundreds of styles curated just for you. New arrivals added every week — never miss a drop.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/shop?category=clothing"
              id="clothing-section-cta-btn"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm text-white transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #C9748A 0%, #A85970 100%)" }}
            >
              <IconShirt className="w-4 h-4" />
              Explore All Clothing
              <IconArrow className="w-4 h-4" />
            </Link>
            <Link
              href="/clothing"
              id="clothing-section-hub-btn"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm border-2 text-[#1A1A2E] transition-all duration-300 hover:bg-[#1A1A2E] hover:text-white"
              style={{ borderColor: "#1A1A2E" }}
            >
              View Clothing Hub
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
