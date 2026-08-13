"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles, Star, ChevronRight, Heart, ArrowRight, Truck, RotateCcw, Shield, Gem } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClothingCategory {
  id: string;
  label: string;
  tag: string;
  gradient: string;
  textColor: string;
  image: string;
  description: string;
  badge?: string;
}

interface LookbookItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  tag: string;
  gradient: string;
  accent: string;
}

interface SizeGuideEntry {
  size: string;
  chest: string;
  waist: string;
  hip: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CLOTHING_CATEGORIES: ClothingCategory[] = [
  {
    id: "kurtas",
    label: "Kurtas & Suits",
    tag: "Bestseller",
    gradient: "from-[#F7E8E8] to-[#EEC5CF]",
    textColor: "text-[#C9748A]",
    image: "👗",
    description: "Elegant ethnic wear for every occasion",
    badge: "New",
  },
  {
    id: "western",
    label: "Western Wear",
    tag: "Trending",
    gradient: "from-[#F0DDB8] to-[#E8D5A3]",
    textColor: "text-[#C9A96E]",
    image: "👚",
    description: "Chic modern styles for the bold woman",
  },
  {
    id: "ethnic",
    label: "Sarees & Lehengas",
    tag: "Festive",
    gradient: "from-[#E8EEF7] to-[#C5D5EE]",
    textColor: "text-[#6B7280]",
    image: "🥻",
    description: "Timeless tradition, reimagined beautifully",
    badge: "Hot",
  },
  {
    id: "casual",
    label: "Casual & Loungewear",
    tag: "Everyday",
    gradient: "from-[#F5F5F7] to-[#E8DDD9]",
    textColor: "text-[#1A1A2E]",
    image: "🩱",
    description: "Comfort that never compromises on style",
  },
];

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: "1",
    title: "The Festive Edit",
    subtitle: "Diwali & Eid Collection",
    price: "Starting ₹999",
    tag: "Limited",
    gradient: "from-[#1A1A2E] via-[#2d2d4a] to-[#1A1A2E]",
    accent: "#C9748A",
  },
  {
    id: "2",
    title: "Everyday Chic",
    subtitle: "Office to Evening",
    price: "Starting ₹599",
    tag: "Popular",
    gradient: "from-[#C9748A] via-[#be5c75] to-[#A85970]",
    accent: "#F7E8E8",
  },
  {
    id: "3",
    title: "Weekend Luxe",
    subtitle: "Premium Casual Wear",
    price: "Starting ₹799",
    tag: "New",
    gradient: "from-[#C9A96E] via-[#b8954d] to-[#a07d35]",
    accent: "#F7E8E8",
  },
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
      className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #2d1d35 40%, #1a1230 70%, #1A1A2E 100%)",
      }}
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-24 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }}
        />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-40"
            style={{
              background: i % 2 === 0 ? "#C9748A" : "#C9A96E",
              top: `${10 + i * 7}%`,
              left: `${5 + i * 8}%`,
              animation: `float-particle ${3 + (i % 3)}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-[#C9748A]/40 bg-[#C9748A]/10 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-[#C9748A]" />
          <span className="text-sm font-semibold text-[#EEC5CF] tracking-wide uppercase">
            Introducing Ranique Clothes
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
          Dress Like{" "}
          <span
            className="relative inline-block"
            style={{
              background: "linear-gradient(135deg, #C9748A 0%, #C9A96E 50%, #EEC5CF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Royalty
          </span>
        </h1>

        <p className="text-[#C5D5EE] text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
          Premium women's clothing crafted for the modern Indian woman — where tradition
          meets contemporary elegance.
        </p>

        {/* Rotating style tag */}
        <div className="h-9 flex items-center justify-center mb-10">
          <span className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-sm transition-all duration-500">
            <span className="w-2 h-2 rounded-full bg-[#C9748A] animate-pulse" />
            {STYLE_TAGS[activeTag]}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop?category=clothing"
            id="clothing-hero-shop-btn"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base text-[#1A1A2E] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #C9748A 0%, #C9A96E 100%)",
            }}
          >
            <ShoppingBag className="w-5 h-5" />
            Shop the Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#categories"
            id="clothing-hero-explore-btn"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-white border border-white/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            Explore Categories
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto sm:max-w-md">
          {[
            { value: 500, suffix: "+", label: "Styles" },
            { value: 25, suffix: "+", label: "Designers" },
            { value: 10000, suffix: "+", label: "Happy Customers" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-[#C5D5EE] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-14">
          <path d="M0 60V30C360 0 720 60 1080 30C1260 15 1380 0 1440 0V60H0Z" fill="#F5F5F7" />
        </svg>
      </div>
    </section>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const items = [
    { icon: <Truck className="w-5 h-5 text-[#C9748A]" />, label: "Free Shipping", desc: "On orders above ₹999" },
    { icon: <RotateCcw className="w-5 h-5 text-[#C9748A]" />, label: "Easy Returns", desc: "7-day hassle-free returns" },
    { icon: <Shield className="w-5 h-5 text-[#C9748A]" />, label: "Authentic Fabric", desc: "100% quality assured" },
    { icon: <Gem className="w-5 h-5 text-[#C9748A]" />, label: "Premium Craftsmanship", desc: "Made with love" },
  ];

  return (
    <section className="bg-white border-b border-[#E8DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-2">
              <div className="shrink-0">{item.icon}</div>
              <div>
                <p className="font-sans font-semibold text-xs sm:text-sm text-[#1A1A2E]">{item.label}</p>
                <p className="text-xs text-[#6B7280] hidden sm:block">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Category Grid ────────────────────────────────────────────────────────────

function CategoryGrid() {
  return (
    <section id="categories" className="bg-[#F5F5F7] py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#C9748A] mb-2">Browse</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">Shop by Category</h2>
          <p className="text-[#6B7280] mt-2 max-w-md mx-auto text-sm">
            From timeless ethnics to bold westerns — find your perfect style.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CLOTHING_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              id={`clothing-cat-${cat.id}`}
              className={`
                group relative bg-gradient-to-br ${cat.gradient} 
                rounded-2xl p-6 sm:p-7 hover:shadow-lg transition-all duration-300
                flex flex-col gap-2 min-h-[170px] sm:min-h-[200px] overflow-hidden
              `}
            >
              {/* Badge */}
              {cat.badge && (
                <span className="absolute top-3 right-3 text-[9px] font-bold bg-[#1A1A2E] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {cat.badge}
                </span>
              )}

              <span className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">
                {cat.image}
              </span>

              <span className={`text-[10px] font-bold uppercase tracking-widest ${cat.textColor}`}>
                {cat.tag}
              </span>

              <h3 className={`font-serif text-lg sm:text-xl font-bold text-[#1A1A2E] leading-tight`}>
                {cat.label}
              </h3>

              <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                {cat.description}
              </p>

              <span className={`mt-auto text-xs font-semibold ${cat.textColor} flex items-center gap-1`}>
                Shop now
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Lookbook / Editorial Section ─────────────────────────────────────────────

function LookbookSection() {
  return (
    <section id="lookbook" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#C9748A] mb-2">Editorials</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">The Lookbook</h2>
          <p className="text-[#6B7280] mt-2 text-sm">Curated edits for every woman, every occasion</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {LOOKBOOK_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              id={`lookbook-card-${item.id}`}
              className={`
                relative rounded-3xl overflow-hidden group cursor-pointer
                ${idx === 0 ? "sm:row-span-2 min-h-[380px]" : "min-h-[180px]"}
              `}
              style={{ background: `linear-gradient(160deg, ${item.gradient})` }}
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/30"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
                >
                  {item.tag}
                </span>
              </div>

              {/* Wishlist button */}
              <button
                className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4 text-white" />
              </button>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-xs font-medium mb-1" style={{ color: item.accent, opacity: 0.9 }}>
                  {item.subtitle}
                </p>
                <h3 className="font-serif text-xl font-bold text-white leading-tight">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-semibold text-white/90">{item.price}</span>
                  <Link
                    href="/shop?category=clothing"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
                    style={{ background: item.accent, color: "#1A1A2E" }}
                  >
                    Shop Edit
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Hover shimmer overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-white pointer-events-none" />
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
    <section className="py-10 bg-[#F7E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#1A1A2E]">
            Shop by Occasion
          </h2>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-sm text-[#C9748A] font-medium hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {STYLE_TAGS.map(tag => (
            <button
              key={tag}
              id={`style-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => toggle(tag)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                selected.includes(tag)
                  ? "bg-[#C9748A] text-white border-[#C9748A] shadow-md scale-105"
                  : "bg-white text-[#1A1A2E] border-[#E8DDD9] hover:border-[#C9748A] hover:text-[#C9748A]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="mt-6 text-center">
            <Link
              href={`/shop?category=clothing&tags=${selected.join(',')}`}
              id="style-filter-shop-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105 shadow-md"
              style={{ background: "linear-gradient(135deg, #C9748A 0%, #C9A96E 100%)" }}
            >
              <ShoppingBag className="w-4 h-4" />
              Shop {selected.join(", ")}
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
    <section id="size-guide" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#C9748A] mb-2">Fit Guide</p>
          <h2 className="font-serif text-3xl font-bold text-[#1A1A2E]">Find Your Size</h2>
          <p className="text-[#6B7280] mt-2 text-sm">All measurements are in inches.</p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#E8DDD9] shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #C9748A 0%, #A85970 100%)" }}>
                {["Size", "Chest", "Waist", "Hip"].map(h => (
                  <th key={h} className="py-3 px-4 text-left font-bold text-white text-xs uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row, i) => (
                <tr
                  key={row.size}
                  className={`border-b border-[#E8DDD9] transition-colors hover:bg-[#F7E8E8]/60 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F5F5F7]"
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-[#C9748A]">{row.size}</td>
                  <td className="py-3.5 px-4 text-[#1A1A2E]">{row.chest}</td>
                  <td className="py-3.5 px-4 text-[#1A1A2E]">{row.waist}</td>
                  <td className="py-3.5 px-4 text-[#1A1A2E]">{row.hip}</td>
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
      emoji: "🌸",
      title: "Designed for Indian Women",
      desc: "Every silhouette, every cut, every drape is crafted keeping the Indian body type and aesthetic in mind.",
    },
    {
      emoji: "✨",
      title: "Premium Fabrics",
      desc: "From airy cottons to luxurious silks — we source only the finest materials to ensure comfort and elegance.",
    },
    {
      emoji: "💎",
      title: "Exclusive Designs",
      desc: "Our collections are limited-edition, so you'll always stand out from the crowd.",
    },
    {
      emoji: "♻️",
      title: "Sustainably Crafted",
      desc: "We partner with ethical manufacturers who share our commitment to fair wages and eco-friendly practices.",
    },
  ];

  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #2d1d35 50%, #1A1A2E 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#C9748A] mb-2">Why Ranique Clothes?</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Fashion With a{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C9748A 0%, #C9A96E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Purpose
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {points.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border border-white/10 hover:border-[#C9748A]/40 transition-all duration-300 group"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
            >
              <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                {p.emoji}
              </span>
              <h3 className="font-serif text-lg font-bold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-[#C5D5EE] leading-relaxed">{p.desc}</p>
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
    <section className="py-16 bg-[#F7E8E8]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <Sparkles className="w-8 h-8 text-[#C9748A] mx-auto mb-4" />
        <h2 className="font-serif text-3xl font-bold text-[#1A1A2E] mb-2">
          Be the First to Know
        </h2>
        <p className="text-[#6B7280] text-sm mb-6">
          Subscribe to get early access to new arrivals, exclusive drops, and styling tips delivered to your inbox.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              id="clothing-newsletter-email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-full border border-[#E8DDD9] text-sm text-[#1A1A2E] placeholder:text-[#6B7280] outline-none focus:border-[#C9748A] focus:ring-2 focus:ring-[#C9748A]/20 bg-white transition-all"
            />
            <button
              type="submit"
              id="clothing-newsletter-submit"
              className="px-6 py-3 rounded-full font-bold text-sm text-white transition-all hover:scale-105 shadow-md whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #C9748A 0%, #A85970 100%)" }}
            >
              Subscribe
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[#C9748A] font-semibold">
            <Star className="w-5 h-5 fill-[#C9748A]" />
            Thank you! You're now on the list 💕
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClothingPage() {
  return (
    <main>
      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0px) scale(1); opacity: 0.4; }
          100% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
      `}</style>

      <HeroSection />
      <TrustBar />
      <CategoryGrid />
      <LookbookSection />
      <StyleFilterSection />
      <WhyUsSection />
      <SizeGuideSection />
      <NewsletterBanner />

      {/* Footer CTA */}
      <section
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #F7E8E8 0%, #EEC5CF 50%, #F7E8E8 100%)" }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-[#1A1A2E] mb-3">
            Your Style Awaits
          </h2>
          <p className="text-[#6B7280] text-sm mb-8">
            Explore hundreds of styles curated just for you. New arrivals every week.
          </p>
          <Link
            href="/shop?category=clothing"
            id="clothing-footer-cta"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base text-white transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #C9748A 0%, #A85970 100%)" }}
          >
            <ShoppingBag className="w-5 h-5" />
            Explore All Clothing
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
