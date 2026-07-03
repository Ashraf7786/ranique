"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/mockData";
import { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  activeCategory?: ProductCategory | "all";
}

export function CategoryTabs({ activeCategory = "all" }: CategoryTabsProps) {
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

  return (
    <div
      role="tablist"
      aria-label="Product categories"
      className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1"
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            id={`category-tab-${cat.id}`}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(cat.id)}
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
            <span aria-hidden>{cat.emoji}</span>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
