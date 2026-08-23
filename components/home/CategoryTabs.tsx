"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  href: string | null;
  storeType: string;
  sortOrder: number;
  isVisible: boolean;
}

interface CategoryTabsProps {
  categories: Category[];
}

const DEFAULT_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80";

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Filter to active STORE type categories
  const storeCategories = (categories || [])
    .filter((c) => c.storeType === "STORE" && c.isVisible !== false)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Auto-slide effect when there are > 7 categories
  useEffect(() => {
    if (storeCategories.length <= 7 || isHovered) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const itemWidth = 140; // width + gap
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScrollLeft - 10) {
        // Wrap back to start
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Scroll right by one item
        container.scrollBy({ left: itemWidth, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [storeCategories.length, isHovered]);

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
    <section aria-label="Shop by category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative group/section">
      
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <p className="text-xs font-bold tracking-widest uppercase text-[#b76e79]">Browse</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">Shop by Category</h2>
        <div className="h-0.5 w-12 bg-[#b76e79] mx-auto my-3" />
      </div>

      {/* Main Row Container */}
      <div 
        className="relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Arrow Button (visible on hover if > 7 categories) */}
        {storeCategories.length > 7 && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 sm:left-0 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-md border border-gray-150 hover:bg-white text-gray-700 hover:text-brand-rose transition-all opacity-0 group-hover/section:opacity-100 hidden md:flex items-center justify-center focus:outline-none"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Horizontal Scrollable Row of Circular Categories */}
        <div
          ref={scrollContainerRef}
          className="w-full flex items-center justify-start md:justify-center gap-6 sm:gap-8 overflow-x-auto pb-6 scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {storeCategories.length === 0 ? (
            <p className="w-full text-center text-[#6B7280] py-10 text-sm">
              No store categories found.
            </p>
          ) : (
            storeCategories.map((cat) => {
              const imageSrc = cat.image || DEFAULT_CATEGORY_IMAGE;
              const linkHref = cat.href || `/shop?category=${cat.slug}`;

              return (
                <Link
                  key={cat.id}
                  href={linkHref}
                  className="flex flex-col items-center min-w-[100px] sm:min-w-[120px] group text-center shrink-0 cursor-pointer"
                >
                  {/* Circular Avatar Container (Larger size) */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#b76e79] group-hover:scale-105 transition-all duration-300 shadow-md group-hover:shadow-lg">
                    <img
                      src={imageSrc}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  
                  {/* Label */}
                  <span className="mt-3 text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-[#b76e79] transition-colors duration-200 uppercase tracking-wider">
                    {cat.name}
                  </span>
                </Link>
              );
            })
          )}
        </div>

        {/* Right Arrow Button (visible on hover if > 7 categories) */}
        {storeCategories.length > 7 && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 sm:right-0 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-md border border-gray-150 hover:bg-white text-gray-700 hover:text-brand-rose transition-all opacity-0 group-hover/section:opacity-100 hidden md:flex items-center justify-center focus:outline-none"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
