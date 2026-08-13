"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Gem, Disc3, ShoppingBag, Package, Flower2, ChevronRight } from "lucide-react";

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

// ─── Category Card ─────────────────────────────────────────────────────────────

function CategoryCard({
  cat,
  icon,
  bg,
  iconColor,
  accent,
}: {
  cat: any;
  icon: React.ReactNode;
  bg: string;
  iconColor: string;
  accent?: string;
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
  // Store: no parentId, exclude the 'womens-clothing' parent wrapper itself
  const storeCategories = categories.filter(
    (c) => !c.parentId && c.slug !== "womens-clothing"
  );

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
      </div>

      {/* ── Store Categories Content ─────────────────────────────────────────────── */}
      <div
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
    </section>
  );
}
