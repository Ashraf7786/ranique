"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ActiveFilters, Product, SortBy } from "@/lib/types";
import { CategoryTabs } from "@/components/shop/CategoryTabs";
import { FilterSidebar, MobileFilterSheet, PRICE_ABSOLUTE_MAX, PRICE_ABSOLUTE_MIN } from "@/components/shop/FilterBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SortDropdown } from "@/components/shop/SortDropdown";
import { ActiveFilterChips } from "@/components/shop/ActiveFilterChips";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: ActiveFilters = {
  category: "all",
  priceRange: null,
  colors: [],
  materials: [],
  brands: [],
  minRating: null,
  inStock: false,
  onSale: false,
  sortBy: "relevance",
};

// ─── Sort logic ───────────────────────────────────────────────────────────────

function sortProducts(products: Product[], sortBy: SortBy): Product[] {
  const arr = [...products];
  switch (sortBy) {
    case "price-asc":
      return arr.sort((a, b) => {
        const ap = a.offer?.isActive ? a.offer.offerPrice : a.price;
        const bp = b.offer?.isActive ? b.offer.offerPrice : b.price;
        return ap - bp;
      });
    case "price-desc":
      return arr.sort((a, b) => {
        const ap = a.offer?.isActive ? a.offer.offerPrice : a.price;
        const bp = b.offer?.isActive ? b.offer.offerPrice : b.price;
        return bp - ap;
      });
    case "newest":
      return arr; // already ordered by createdAt desc from DB
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    case "popular":
      return arr.sort((a, b) => (b.boughtLastWeek ?? 0) - (a.boughtLastWeek ?? 0));
    default:
      return arr;
  }
}

// ─── ShopClient ───────────────────────────────────────────────────────────────

export default function ShopClient({
  initialProducts,
  categories,
  brands = [],
}: {
  initialProducts: Product[];
  categories: any[];
  brands?: any[];
}) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") ?? "all";
  const searchQuery = searchParams.get("q")?.toLowerCase().trim() || "";

  const [filters, setFilters] = useState<ActiveFilters>({
    ...DEFAULT_FILTERS,
    category: urlCategory as any,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleFilterChange = useCallback((next: Partial<ActiveFilters>) => {
    // FilterBar's Apply button passes the full draft; Partial is fine too
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);


  const handleClearAll = useCallback(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      category: prev.category,
      sortBy: prev.sortBy,
    }));
  }, []);

  // ── Compute active filter count (for badge) ──────────────────────────────
  const activeCount = useMemo(() => {
    return (
      (filters.priceRange ? 1 : 0) +
      filters.colors.length +
      filters.materials.length +
      filters.brands.length +
      (filters.minRating !== null ? 1 : 0) +
      (filters.inStock ? 1 : 0) +
      (filters.onSale ? 1 : 0)
    );
  }, [filters]);

  // ── Filter + Sort ──────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter((p) => {
      // Category (URL-driven)
      if (urlCategory !== "all" && p.category !== urlCategory) return false;

      // In Stock
      if (filters.inStock && !p.inStock) return false;

      // On Sale
      if (filters.onSale) {
        const hasOffer = p.offer?.isActive && new Date(p.offer.endsAt) > new Date();
        const hasSalePrice = !!p.compareAtPrice && p.compareAtPrice > p.price;
        if (!hasOffer && !hasSalePrice) return false;
      }

      // Price range
      if (filters.priceRange) {
        const effectivePrice = p.offer?.isActive ? p.offer.offerPrice : p.price;
        if (effectivePrice < filters.priceRange.min || effectivePrice > filters.priceRange.max) {
          return false;
        }
      }

      // Colors — match product variant colors against selected hex values
      if (filters.colors.length > 0) {
        const productColors = p.variants?.colors?.map((c) => c.hex) ?? [];
        const matches = filters.colors.some((hex) => productColors.includes(hex));
        if (!matches) return false;
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

      // Search query (full-text match)
      if (searchQuery) {
        const haystack = [p.name, p.description, p.brand, p.category, p.material ?? ""]
          .join(" ")
          .toLowerCase();
        const terms = searchQuery.split(/\s+/);
        if (!terms.every((t) => haystack.includes(t))) return false;
      }

      return true;
    });

    return sortProducts(result, filters.sortBy);
  }, [initialProducts, filters, urlCategory, searchQuery]);

  // ── Page header label ───────────────────────────────────────────────────────
  const headingLabel = searchQuery
    ? `Search results for "${searchParams.get("q")}"`
    : urlCategory === "all"
    ? "All Products"
    : capitalize(categories.find((c) => c.slug === urlCategory)?.name ?? urlCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {/* ── Page Header ── */}
      <div className="mb-5">
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-brand-ink mb-1">
          {headingLabel}
        </h1>
        <p className="text-sm text-brand-slate">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          {activeCount > 0 ? ` (${activeCount} filter${activeCount > 1 ? "s" : ""} applied)` : ""}
        </p>
      </div>

      {/* ── Category Tabs ── */}
      <div className="mb-4">
        <CategoryTabs activeCategory={urlCategory} categories={categories} />
      </div>

      {/* ── Active filter chips ── */}
      {activeCount > 0 && (
        <div className="mb-4">
          <ActiveFilterChips
            filters={filters}
            onChange={handleFilterChange}
            priceMin={PRICE_ABSOLUTE_MIN}
            priceMax={PRICE_ABSOLUTE_MAX}
          />
        </div>
      )}

      {/* ── Toolbar: mobile filter button + sort + view toggle ── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {/* Mobile filter trigger */}
        <MobileFilterSheet
          filters={filters}
          onChange={handleFilterChange}
          brands={brands}
          onClearAll={handleClearAll}
          activeCount={activeCount}
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sort */}
        <SortDropdown
          value={filters.sortBy}
          onChange={(v) => handleFilterChange({ sortBy: v })}
        />

        {/* View mode toggle */}
        <div className="hidden sm:flex items-center border border-brand-border rounded-full overflow-hidden">
          <button
            id="view-grid-btn"
            type="button"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            className={cn(
              "h-9 w-9 flex items-center justify-center transition-colors",
              viewMode === "grid"
                ? "bg-brand-rose text-white"
                : "bg-white text-brand-slate hover:text-brand-rose"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            id="view-list-btn"
            type="button"
            onClick={() => setViewMode("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            className={cn(
              "h-9 w-9 flex items-center justify-center transition-colors",
              viewMode === "list"
                ? "bg-brand-rose text-white"
                : "bg-white text-brand-slate hover:text-brand-rose"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main layout: sidebar + products ── */}
      <div className="flex gap-6 lg:gap-8 items-start">

        {/* Desktop sidebar (hidden on mobile — handled by bottom sheet) */}
        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          brands={brands}
          onClearAll={handleClearAll}
          activeCount={activeCount}
        />

        {/* Product grid / list */}
        <div className="flex-1 min-w-0">
          <ProductGrid
            products={filteredProducts}
            priorityCount={4}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
