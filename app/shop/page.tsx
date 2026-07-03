"use client";

import React, { useState, useMemo, Suspense } from "react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { ActiveFilters, ProductCategory } from "@/lib/types";
import { CategoryTabs } from "@/components/shop/CategoryTabs";
import { FilterBar } from "@/components/shop/FilterBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { useSearchParams } from "next/navigation";

const DEFAULT_FILTERS: ActiveFilters = {
  category: "all",
  priceRange: null,
  colors: [],
  materials: [],
  brands: [],
  minRating: null,
};

function ShopContent() {
  const searchParams = useSearchParams();
  const urlCategory = (searchParams.get("category") as ProductCategory | null) ?? "all";
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const [filters, setFilters] = useState<ActiveFilters>({
    ...DEFAULT_FILTERS,
    category: urlCategory,
  });

  function handleFilterChange(next: Partial<ActiveFilters>) {
    setFilters((prev) => ({ ...prev, ...next }));
  }

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      // Category
      if (urlCategory !== "all" && p.category !== urlCategory) return false;

      // Price
      if (filters.priceRange) {
        const { min, max } = filters.priceRange;
        if (p.price < min || p.price > max) return false;
      }

      // Brands
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
        return false;
      }

      // Materials
      if (filters.materials.length > 0) {
        const mat = p.material ?? "";
        const matches = filters.materials.some((m) =>
          mat.toLowerCase().includes(m.toLowerCase())
        );
        if (!matches) return false;
      }

      // Min rating
      if (filters.minRating !== null && p.rating < filters.minRating) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const matchTitle = p.name.toLowerCase().includes(searchQuery);
        const matchDesc = p.description.toLowerCase().includes(searchQuery);
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    });
  }, [filters, urlCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-brand-ink mb-1">
          {searchQuery ? `Search Results for "${searchParams.get("q")}"` : urlCategory === "all" ? "All Products" : capitalize(urlCategory)}
        </h1>
        <p className="text-sm text-brand-slate">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Category tabs */}
      <div className="mb-4">
        <CategoryTabs activeCategory={urlCategory} />
      </div>

      {/* Filter bar */}
      <div className="mb-6">
        <FilterBar filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Product grid */}
      <Suspense fallback={<SkeletonGrid count={8} />}>
        <ProductGrid products={filteredProducts} />
      </Suspense>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SkeletonGrid count={8} />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
