"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ActiveFilters } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterBarProps {
  filters: ActiveFilters;
  onChange: (next: Partial<ActiveFilters>) => void;
}

// ─── Color Swatch Data ────────────────────────────────────────────────────────

const COLOR_OPTIONS = [
  { hex: "#C9748A", label: "Rose" },
  { hex: "#1A1A1A", label: "Black" },
  { hex: "#FFFFF0", label: "Ivory" },
  { hex: "#C9A96E", label: "Gold" },
  { hex: "#B76E79", label: "Rose Gold" },
  { hex: "#722F37", label: "Burgundy" },
  { hex: "#8B5E3C", label: "Tortoise" },
  { hex: "#2D5A27", label: "Emerald" },
];

const PRICE_RANGES = [
  { label: "Under ₹3999",    min: 0,   max: 50 },
  { label: "₹3999–₹7999",     min: 50,  max: 100 },
  { label: "₹7999–₹15999",    min: 100, max: 200 },
  { label: "₹15999+",        min: 200, max: Infinity },
];

const MATERIAL_OPTIONS = ["Leather", "Silk", "Gold Plated", "Sterling Silver", "Velvet", "Brass", "Acetate"];
const BRAND_OPTIONS     = ["Maison Lumière", "Éclat Paris", "Lumina Jewels", "Petit Luxe", "Opulent", "Fleur Noir"];
const RATING_OPTIONS    = [4, 4.5, 5];

// ─── Popover wrapper ──────────────────────────────────────────────────────────

function Popover({
  trigger,
  children,
  isOpen,
  onToggle,
  id,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (isOpen) onToggle();
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative shrink-0">
      {React.cloneElement(trigger as React.ReactElement<any>, {
        id,
        onClick: onToggle,
        "aria-expanded": isOpen,
        "aria-haspopup": "listbox"
      })}
      {isOpen && (
        <div
          role="listbox"
          className={cn(
            "absolute top-full left-0 mt-2 z-20 min-w-[200px]",
            "bg-white border border-brand-border rounded-2xl shadow-popover",
            "p-3 animate-slide-up"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Chip button ─────────────────────────────────────────────────────────────

function FilterChip({
  label,
  isActive,
  hasActive,
  onClick,
  className,
  ...props
}: {
  label: string;
  isActive?: boolean;
  hasActive?: boolean;
  onClick: () => void;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      {...props}
      className={cn(
        "shrink-0 inline-flex items-center gap-1.5 px-4 h-10 rounded-full",
        "font-sans text-sm font-medium transition-all duration-200 border whitespace-nowrap",
        "active:scale-95",
        isActive || hasActive
          ? "bg-brand-rose border-brand-rose text-white"
          : "bg-white border-brand-border text-brand-slate hover:border-brand-rose hover:text-brand-rose",
        className
      )}
    >
      {label}
      {hasActive && !isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-white inline-block ml-0.5" />
      )}
    </button>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenPanel((prev) => (prev === id ? null : id));
  }

  const activeCount =
    (filters.priceRange ? 1 : 0) +
    filters.colors.length +
    filters.materials.length +
    filters.brands.length +
    (filters.minRating ? 1 : 0);

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1 items-center">
        {/* Clear all */}
        {activeCount > 0 && (
          <button
            id="filter-clear-all"
            type="button"
            onClick={() =>
              onChange({
                priceRange: null,
                colors: [],
                materials: [],
                brands: [],
                minRating: null,
              })
            }
            className="shrink-0 inline-flex items-center gap-1 px-3 h-10 rounded-full text-sm font-medium text-brand-rose border border-brand-rose-light bg-brand-blush hover:bg-brand-rose hover:text-white transition-all"
          >
            ✕ Clear ({activeCount})
          </button>
        )}

        {/* ── Price ── */}
        <Popover
          id="filter-price-btn"
          trigger={
            <FilterChip
              label="Price"
              hasActive={!!filters.priceRange}
              onClick={() => {}}
            />
          }
          isOpen={openPanel === "price"}
          onToggle={() => toggle("price")}
        >
          <p className="text-2xs font-semibold text-brand-slate uppercase tracking-widest mb-2 px-1">
            Price Range
          </p>
          <div className="space-y-1">
            {PRICE_RANGES.map((range) => {
              const isActive =
                filters.priceRange?.min === range.min &&
                filters.priceRange?.max === range.max;
              return (
                <button
                  key={range.label}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange({
                      priceRange: isActive
                        ? null
                        : { min: range.min, max: range.max },
                    });
                    toggle("price");
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors",
                    isActive
                      ? "bg-brand-blush text-brand-rose font-semibold"
                      : "text-brand-ink hover:bg-brand-mist"
                  )}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </Popover>

        {/* ── Color ── */}
        <Popover
          id="filter-color-btn"
          trigger={
            <FilterChip
              label="Color"
              hasActive={filters.colors.length > 0}
              onClick={() => {}}
            />
          }
          isOpen={openPanel === "color"}
          onToggle={() => toggle("color")}
        >
          <p className="text-2xs font-semibold text-brand-slate uppercase tracking-widest mb-3 px-1">
            Color
          </p>
          <div className="grid grid-cols-4 gap-2.5 px-1">
            {COLOR_OPTIONS.map((color) => {
              const isSelected = filters.colors.includes(color.hex);
              return (
                <button
                  key={color.hex}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-label={color.label}
                  title={color.label}
                  onClick={() => {
                    const next = isSelected
                      ? filters.colors.filter((c) => c !== color.hex)
                      : [...filters.colors, color.hex];
                    onChange({ colors: next });
                  }}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all duration-150",
                    "hover:scale-110 active:scale-95",
                    isSelected
                      ? "border-brand-rose ring-2 ring-brand-rose ring-offset-1"
                      : "border-white shadow-sm"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </Popover>

        {/* ── Material ── */}
        <Popover
          id="filter-material-btn"
          trigger={
            <FilterChip
              label="Material"
              hasActive={filters.materials.length > 0}
              onClick={() => {}}
            />
          }
          isOpen={openPanel === "material"}
          onToggle={() => toggle("material")}
        >
          <p className="text-2xs font-semibold text-brand-slate uppercase tracking-widest mb-2 px-1">
            Material
          </p>
          <div className="space-y-1">
            {MATERIAL_OPTIONS.map((mat) => {
              const isActive = filters.materials.includes(mat);
              return (
                <button
                  key={mat}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    const next = isActive
                      ? filters.materials.filter((m) => m !== mat)
                      : [...filters.materials, mat];
                    onChange({ materials: next });
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2",
                    isActive
                      ? "bg-brand-blush text-brand-rose font-semibold"
                      : "text-brand-ink hover:bg-brand-mist"
                  )}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-rose shrink-0" />}
                  {mat}
                </button>
              );
            })}
          </div>
        </Popover>

        {/* ── Brand ── */}
        <Popover
          id="filter-brand-btn"
          trigger={
            <FilterChip
              label="Brand"
              hasActive={filters.brands.length > 0}
              onClick={() => {}}
            />
          }
          isOpen={openPanel === "brand"}
          onToggle={() => toggle("brand")}
        >
          <p className="text-2xs font-semibold text-brand-slate uppercase tracking-widest mb-2 px-1">
            Brand
          </p>
          <div className="space-y-1">
            {BRAND_OPTIONS.map((brand) => {
              const isActive = filters.brands.includes(brand);
              return (
                <button
                  key={brand}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    const next = isActive
                      ? filters.brands.filter((b) => b !== brand)
                      : [...filters.brands, brand];
                    onChange({ brands: next });
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2",
                    isActive
                      ? "bg-brand-blush text-brand-rose font-semibold"
                      : "text-brand-ink hover:bg-brand-mist"
                  )}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-rose shrink-0" />}
                  {brand}
                </button>
              );
            })}
          </div>
        </Popover>

        {/* ── Reviews ── */}
        <Popover
          id="filter-reviews-btn"
          trigger={
            <FilterChip
              label="Reviews"
              hasActive={!!filters.minRating}
              onClick={() => {}}
            />
          }
          isOpen={openPanel === "reviews"}
          onToggle={() => toggle("reviews")}
        >
          <p className="text-2xs font-semibold text-brand-slate uppercase tracking-widest mb-2 px-1">
            Minimum Rating
          </p>
          <div className="space-y-1">
            {RATING_OPTIONS.map((r) => {
              const isActive = filters.minRating === r;
              return (
                <button
                  key={r}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange({ minRating: isActive ? null : r });
                    toggle("reviews");
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-1.5",
                    isActive
                      ? "bg-brand-blush text-brand-rose font-semibold"
                      : "text-brand-ink hover:bg-brand-mist"
                  )}
                >
                  {"⭐".repeat(Math.ceil(r))} {r}+
                </button>
              );
            })}
          </div>
        </Popover>
      </div>
    </div>
  );
}
