"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles, Gem, Disc3, ShoppingBag, Package,
  Shirt, ChevronRight, ChevronDown, Star,
  Layers, Wind, Sun, Flower2, Crown, Heart,
} from "lucide-react";

// ─── Inline SVG Icons for Clothing ────────────────────────────────────────────

function IconDress({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C10 2 8 3 7 5L4 9h3l2 4-4 9h14l-4-9 2-4h3l-3-4c-1-2-3-3-5-3z"/>
    </svg>
  );
}
function IconScarf({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4c2 0 4 1.5 6 3 2-1.5 4-3 6-3"/>
      <path d="M6 4c-.5 4 1 8 2 12"/>
      <path d="M18 4c.5 4-1 8-2 12"/>
      <path d="M8 16c1.5 1 3.5 2 5 2s3.5-1 5-2"/>
    </svg>
  );
}
function IconHanger({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 19H3.62a1 1 0 01-.76-1.65L12 7"/>
      <path d="M12 7V4a2 2 0 014 0"/>
      <path d="M12 7a2 2 0 000 4"/>
    </svg>
  );
}

// ─── Store Category Config ─────────────────────────────────────────────────────

const STORE_CATEGORY_STYLES: Record<string, { icon: React.ReactNode; bg: string; iconColor: string }> = {
  cosmetics:   { icon: <Sparkles className="w-7 h-7" />, bg: "from-[#F7E8E8] to-[#EEC5CF]", iconColor: "#C9748A" },
  skincare:    { icon: <Flower2 className="w-7 h-7" />,  bg: "from-[#FFF0F5] to-[#FFD6E7]", iconColor: "#C9748A" },
  accessories: { icon: <Gem className="w-7 h-7" />,      bg: "from-[#F0DDB8] to-[#E8D5A3]", iconColor: "#C9A96E" },
  bangles:     { icon: <Disc3 className="w-7 h-7" />,    bg: "from-[#E8EEF7] to-[#C5D5EE]", iconColor: "#5B7BB8" },
  purses:      { icon: <ShoppingBag className="w-7 h-7" />, bg: "from-[#F0F0F0] to-[#E0E0D8]", iconColor: "#6B7280" },
};

const DEFAULT_STORE_STYLE = {
  icon: <Package className="w-7 h-7" />,
  bg: "from-[#F5F5F7] to-[#E8E5E0]",
  iconColor: "#6B7280",
};

// ─── Clothing Category Config ─────────────────────────────────────────────────

const CLOTHING_ICONS: Record<string, React.ReactNode> = {
  "kurti":           <IconDress className="w-7 h-7" />,
  "kurti-set":       <Layers className="w-7 h-7" />,
  "suit":            <Shirt className="w-7 h-7" />,
  "salwar-kameez":   <IconHanger className="w-7 h-7" />,
  "sharara":         <IconScarf className="w-7 h-7" />,
  "gharara":         <Wind className="w-7 h-7" />,
  "lehenga":         <Crown className="w-7 h-7" />,
  "lehenga-choli":   <Star className="w-7 h-7" />,
  "saree":           <IconScarf className="w-7 h-7" />,
  "readymade-saree": <Sparkles className="w-7 h-7" />,
  "anarkali":        <IconDress className="w-7 h-7" />,
  "palazzo-set":     <Layers className="w-7 h-7" />,
  "patiala-suit":    <Shirt className="w-7 h-7" />,
  "churidar-suit":   <Shirt className="w-7 h-7" />,
  "dupatta":         <Wind className="w-7 h-7" />,
  "top":             <Shirt className="w-7 h-7" />,
  "dress":           <IconDress className="w-7 h-7" />,
  "coord-set":       <Layers className="w-7 h-7" />,
  "jumpsuit":        <IconHanger className="w-7 h-7" />,
  "jeans-trousers":  <Package className="w-7 h-7" />,
  "skirt":           <IconDress className="w-7 h-7" />,
  "shorts":          <Package className="w-7 h-7" />,
  "blazer-jacket":   <Shirt className="w-7 h-7" />,
  "casual-wear":     <Wind className="w-7 h-7" />,
  "loungewear":      <Heart className="w-7 h-7" />,
  "night-suit":      <Sun className="w-7 h-7" />,
  "track-suit":      <Layers className="w-7 h-7" />,
  "sweater-cardigan":<Wind className="w-7 h-7" />,
  "winter-suit":     <Shirt className="w-7 h-7" />,
  "bridal-wear":     <Crown className="w-7 h-7" />,
  "party-wear":      <Star className="w-7 h-7" />,
  "festive-wear":    <Sparkles className="w-7 h-7" />,
  "wedding-guest":   <Flower2 className="w-7 h-7" />,
};

// cycling gradient palette for clothing cards
const CLOTHING_GRADIENTS = [
  { bg: "from-[#F7E8E8] to-[#EEC5CF]", iconColor: "#C9748A", accent: "#C9748A" },
  { bg: "from-[#F0DDB8] to-[#E8D5A3]", iconColor: "#C9A96E", accent: "#C9A96E" },
  { bg: "from-[#E8EEF7] to-[#C5D5EE]", iconColor: "#5B7BB8", accent: "#5B7BB8" },
  { bg: "from-[#F5F5F7] to-[#E8DDD9]", iconColor: "#6B7280", accent: "#6B7280" },
  { bg: "from-[#FFF0F5] to-[#FFD6E7]", iconColor: "#C9748A", accent: "#C9748A" },
  { bg: "from-[#F0EEF7] to-[#DDD5EE]", iconColor: "#7B5BB8", accent: "#7B5BB8" },
];

const INITIAL_VISIBLE = 6;

// ─── Category Card ─────────────────────────────────────────────────────────────

function CategoryCard({
  cat,
  icon,
  bg,
  iconColor,
  accent,
  isClothing = false,
}: {
  cat: any;
  icon: React.ReactNode;
  bg: string;
  iconColor: string;
  accent?: string;
  isClothing?: boolean;
}) {
  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      id={`category-card-${cat.slug}`}
      className={`group relative bg-gradient-to-br ${bg} rounded-2xl p-5 sm:p-6 flex flex-col gap-2 min-h-[160px] sm:min-h-[175px] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(201,116,138,0.18)] hover:-translate-y-1`}
    >
      {/* Accent top bar */}
      <span
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: accent || iconColor }}
      />

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-1 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${iconColor}18`, color: iconColor }}
      >
        {icon}
      </div>

      {/* Name */}
      <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A2E] leading-tight group-hover:text-[#C9748A] transition-colors duration-200">
        {cat.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
        {cat.description || "Discover our collection"}
      </p>

      {/* CTA */}
      <span
        className="mt-auto text-xs font-bold flex items-center gap-1 transition-all duration-200 group-hover:gap-2"
        style={{ color: iconColor }}
      >
        Shop now
        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface CategoryTabsProps {
  categories: any[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState<"store" | "clothing">("store");
  const [showAll, setShowAll] = useState(false);

  // ── Split categories ──────────────────────────────────────────────────────
  // Store: no parentId, exclude the 'womens-clothing' parent wrapper itself
  const storeCategories = categories.filter(
    (c) => !c.parentId && c.slug !== "womens-clothing"
  );

  // Clothing: any category that has a parentId (all sub-categories)
  const clothingCategories = categories.filter((c) => !!c.parentId);

  // Visible clothing cards
  const visibleClothing = showAll
    ? clothingCategories
    : clothingCategories.slice(0, INITIAL_VISIBLE);

  const hasMore = clothingCategories.length > INITIAL_VISIBLE;

  return (
    <section aria-label="Shop by category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ── Section header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#C9748A] mb-1">Browse</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
            Shop by Category
          </h2>
        </div>

        {/* ── Tab Pills ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 p-1 rounded-full bg-[#F5F5F7] border border-[#E8DDD9] self-start sm:self-auto">
          {/* Ranique Store Tab */}
          <button
            id="tab-ranique-store"
            onClick={() => { setActiveTab("store"); setShowAll(false); }}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "store"
                ? "bg-[#1A1A2E] text-white shadow-md"
                : "text-[#6B7280] hover:text-[#1A1A2E]"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Ranique Store
          </button>

          {/* Ranique Clothing Tab */}
          <button
            id="tab-ranique-clothing"
            onClick={() => { setActiveTab("clothing"); setShowAll(false); }}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "clothing"
                ? "text-white shadow-md"
                : "text-[#6B7280] hover:text-[#1A1A2E]"
            }`}
            style={
              activeTab === "clothing"
                ? { background: "linear-gradient(135deg, #C9748A 0%, #A85970 100%)" }
                : {}
            }
          >
            <IconDress className="w-3.5 h-3.5" />
            Ranique Clothing
          </button>
        </div>
      </div>

      {/* ── Store Tab Content ─────────────────────────────────────────────── */}
      {activeTab === "store" && (
        <div
          key="store"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          {storeCategories.length === 0 ? (
            <p className="col-span-4 text-center text-[#6B7280] py-10 text-sm">
              No store categories found.
            </p>
          ) : (
            storeCategories.map((cat) => {
              const style = STORE_CATEGORY_STYLES[cat.slug] || DEFAULT_STORE_STYLE;
              return (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  icon={style.icon}
                  bg={style.bg}
                  iconColor={style.iconColor}
                  accent={style.iconColor}
                />
              );
            })
          )}
        </div>
      )}

      {/* ── Clothing Tab Content ──────────────────────────────────────────── */}
      {activeTab === "clothing" && (
        <div key="clothing" className="animate-in fade-in slide-in-from-bottom-3 duration-300">

          {/* Clothing count badge */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#6B7280]">
              Showing{" "}
              <span className="font-bold text-[#1A1A2E]">
                {visibleClothing.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#1A1A2E]">
                {clothingCategories.length}
              </span>{" "}
              categories
            </p>
            {hasMore && (
              <Link
                href="/clothing"
                className="text-xs font-bold text-[#C9748A] hover:underline underline-offset-2"
              >
                View Clothing Hub →
              </Link>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
            {clothingCategories.length === 0 ? (
              <p className="col-span-3 text-center text-[#6B7280] py-10 text-sm">
                No clothing categories found.
              </p>
            ) : (
              visibleClothing.map((cat, idx) => {
                const palette = CLOTHING_GRADIENTS[idx % CLOTHING_GRADIENTS.length];
                const icon = CLOTHING_ICONS[cat.slug] || <IconHanger className="w-7 h-7" />;
                return (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    icon={icon}
                    bg={palette.bg}
                    iconColor={palette.iconColor}
                    accent={palette.accent}
                    isClothing
                  />
                );
              })
            )}
          </div>

          {/* Load More / Collapse */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              {!showAll ? (
                <button
                  id="clothing-load-more"
                  onClick={() => setShowAll(true)}
                  className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{ background: "linear-gradient(135deg, #C9748A 0%, #A85970 100%)" }}
                >
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  Load More ({clothingCategories.length - INITIAL_VISIBLE} more)
                </button>
              ) : (
                <button
                  id="clothing-collapse"
                  onClick={() => setShowAll(false)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm border-2 text-[#1A1A2E] hover:bg-[#F5F5F7] transition-all duration-300"
                  style={{ borderColor: "#E8DDD9" }}
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
