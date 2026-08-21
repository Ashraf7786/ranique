"use client";

import React from "react";
import Link from "next/link";

// Curated high-end Unsplash images for store categories
const STORE_CATEGORY_IMAGES: Record<string, string> = {
  cosmetics:   "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=80",
  skincare:    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80",
  accessories: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80",
  bangles:     "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&auto=format&fit=crop&q=80",
  purses:      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80",
  earings:     "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&auto=format&fit=crop&q=80",
  rakhi:       "https://images.unsplash.com/photo-1624314138470-5a2f24623f10?w=400&auto=format&fit=crop&q=80",
};

const DEFAULT_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80";

interface CategoryTabsProps {
  categories: any[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  // Store categories: no parentId, exclude the 'womens-clothing' parent wrapper
  const storeCategories = categories.filter(
    (c) => !c.parentId && c.slug !== "womens-clothing"
  );

  return (
    <section aria-label="Shop by category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <p className="text-xs font-bold tracking-widest uppercase text-[#b76e79]">Browse</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">Shop by Category</h2>
        <div className="h-0.5 w-12 bg-[#b76e79] mx-auto my-3" />
      </div>

      {/* Horizontal Scrollable Row of Circular Categories */}
      <div className="flex items-center justify-start md:justify-center gap-6 sm:gap-8 lg:gap-10 overflow-x-auto pb-6 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {storeCategories.length === 0 ? (
          <p className="w-full text-center text-[#6B7280] py-10 text-sm">
            No store categories found.
          </p>
        ) : (
          storeCategories.map((cat) => {
            const imageSrc = STORE_CATEGORY_IMAGES[cat.slug] || DEFAULT_CATEGORY_IMAGE;
            
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
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
    </section>
  );
}
