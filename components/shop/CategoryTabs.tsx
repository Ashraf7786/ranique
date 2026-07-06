"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/mockData";
import { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sparkles, Gem, Disc3, ShoppingBag, LayoutGrid, Package } from "lucide-react";

interface CategoryTabsProps {
  activeCategory?: ProductCategory | "all" | string;
  categories: any[];
}

export function CategoryTabs({ activeCategory = "all", categories }: CategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSelect(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      params.delete("category");
    } else {
      params.set("category", id);
    }
    router.push(`/shop?${params.toString()}`);
  }

  const getCategoryIcon = (slug: string, isActive: boolean) => {
    const iconClass = cn("w-4 h-4", isActive ? "text-white" : "text-brand-slate group-hover:text-brand-rose");
    switch (slug) {
      case "cosmetics": return <Sparkles className={iconClass} />;
      case "accessories": return <Gem className={iconClass} />;
      case "bangles": return <Disc3 className={iconClass} />;
      case "purses": return <ShoppingBag className={iconClass} />;
      default: return <Package className={iconClass} />;
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Product categories"
      className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1"
    >
      <button
        id="category-tab-all"
        role="tab"
        aria-selected={activeCategory === "all"}
        onClick={() => handleSelect("all")}
        className={cn(
          "shrink-0 inline-flex items-center gap-1.5 px-4 h-10 rounded-full",
          "font-sans text-sm font-medium transition-all duration-200",
          "border whitespace-nowrap",
          "active:scale-95",
          activeCategory === "all"
            ? "bg-brand-rose border-brand-rose text-white shadow-sm"
            : "bg-white border-brand-border text-brand-slate hover:border-brand-rose hover:text-brand-rose"
        )}
      >
        <LayoutGrid className={cn("w-4 h-4", activeCategory === "all" ? "text-white" : "text-brand-slate group-hover:text-brand-rose")} />
        All Products
      </button>
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat.id}
            id={`category-tab-${cat.slug}`}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(cat.slug)}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 px-4 h-10 rounded-full",
              "font-sans text-sm font-medium transition-all duration-200",
              "border whitespace-nowrap",
              "active:scale-95",
              isActive
                ? "bg-brand-rose border-brand-rose text-white shadow-sm"
                : "bg-white border-brand-border text-brand-slate hover:border-brand-rose hover:text-brand-rose"
            )}
          >
            {getCategoryIcon(cat.slug, isActive)}
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
