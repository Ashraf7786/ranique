"use client";

import React from "react";
import { ActiveFilters } from "@/lib/types";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveFilterChipsProps {
  filters: ActiveFilters;
  onChange: (next: Partial<ActiveFilters>) => void;
  priceMin: number;
  priceMax: number;
}

const COLOR_LABELS: Record<string, string> = {
  "#C9748A": "Rose",
  "#1A1A1A": "Black",
  "#FFFFF0": "Ivory",
  "#C9A96E": "Gold",
  "#B76E79": "Rose Gold",
  "#722F37": "Burgundy",
  "#8B5E3C": "Tortoise",
  "#2D5A27": "Emerald",
  "#FF6B6B": "Coral Red",
  "#4A90D9": "Sky Blue",
  "#50C878": "Emerald Green",
  "#9B59B6": "Amethyst",
  "#F39C12": "Amber",
  "#1ABC9C": "Teal",
  "#E74C3C": "Crimson",
  "#2C3E50": "Midnight",
};

function Chip({
  label,
  onRemove,
  colorHex,
}: {
  label: string;
  onRemove: () => void;
  colorHex?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 h-8 px-3 rounded-full",
        "bg-brand-blush border border-brand-rose-light text-brand-rose",
        "font-sans text-xs font-medium whitespace-nowrap animate-slide-up",
        "shrink-0"
      )}
    >
      {colorHex && (
        <span
          className="w-3 h-3 rounded-full border border-white shadow-sm shrink-0"
          style={{ backgroundColor: colorHex }}
        />
      )}
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="w-3.5 h-3.5 rounded-full hover:bg-brand-rose hover:text-white flex items-center justify-center transition-colors ml-0.5 shrink-0"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}

export function ActiveFilterChips({
  filters,
  onChange,
  priceMin,
  priceMax,
}: ActiveFilterChipsProps) {
  const chips: { key: string; label: string; colorHex?: string; onRemove: () => void }[] = [];

  // Price range
  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    const label =
      min === priceMin && max === priceMax
        ? "All Prices"
        : max >= priceMax
        ? `₹${min.toLocaleString("en-IN")}+`
        : `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")}`;
    chips.push({
      key: "price",
      label,
      onRemove: () => onChange({ priceRange: null }),
    });
  }

  // Colors
  filters.colors.forEach((hex) => {
    chips.push({
      key: `color-${hex}`,
      label: COLOR_LABELS[hex] ?? hex,
      colorHex: hex,
      onRemove: () => onChange({ colors: filters.colors.filter((c) => c !== hex) }),
    });
  });

  // Brands
  filters.brands.forEach((brand) => {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      onRemove: () => onChange({ brands: filters.brands.filter((b) => b !== brand) }),
    });
  });

  // Materials
  filters.materials.forEach((mat) => {
    chips.push({
      key: `mat-${mat}`,
      label: mat,
      onRemove: () =>
        onChange({ materials: filters.materials.filter((m) => m !== mat) }),
    });
  });

  // Rating
  if (filters.minRating !== null) {
    chips.push({
      key: "rating",
      label: `${filters.minRating}★ & above`,
      onRemove: () => onChange({ minRating: null }),
    });
  }

  // In Stock
  if (filters.inStock) {
    chips.push({
      key: "instock",
      label: "In Stock Only",
      onRemove: () => onChange({ inStock: false }),
    });
  }

  // On Sale
  if (filters.onSale) {
    chips.push({
      key: "onsale",
      label: "On Sale",
      onRemove: () => onChange({ onSale: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5 -mx-1 px-1">
      {/* Clear all */}
      <button
        type="button"
        id="clear-all-filters-btn"
        onClick={() =>
          onChange({
            priceRange: null,
            colors: [],
            brands: [],
            materials: [],
            minRating: null,
            inStock: false,
            onSale: false,
          })
        }
        className={cn(
          "shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full",
          "border border-brand-border bg-white text-brand-slate",
          "font-sans text-xs font-medium whitespace-nowrap",
          "hover:border-brand-rose hover:text-brand-rose transition-colors"
        )}
      >
        <X className="w-3 h-3" />
        Clear all
      </button>

      {chips.map((chip) => (
        <Chip
          key={chip.key}
          label={chip.label}
          colorHex={chip.colorHex}
          onRemove={chip.onRemove}
        />
      ))}
    </div>
  );
}
