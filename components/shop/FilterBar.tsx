"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ActiveFilters } from "@/lib/types";
import { PriceRangeSlider } from "./PriceRangeSlider";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Tag,
  Package,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

export const PRICE_ABSOLUTE_MIN = 0;
export const PRICE_ABSOLUTE_MAX = 50000;

const COLOR_OPTIONS = [
  { hex: "#C9748A", label: "Rose" },
  { hex: "#1A1A1A", label: "Black" },
  { hex: "#FFFFF0", label: "Ivory" },
  { hex: "#C9A96E", label: "Gold" },
  { hex: "#B76E79", label: "Rose Gold" },
  { hex: "#722F37", label: "Burgundy" },
  { hex: "#8B5E3C", label: "Tortoise" },
  { hex: "#2D5A27", label: "Emerald" },
  { hex: "#FF6B6B", label: "Coral Red" },
  { hex: "#4A90D9", label: "Sky Blue" },
  { hex: "#50C878", label: "Emerald Green" },
  { hex: "#9B59B6", label: "Amethyst" },
];

const MATERIAL_OPTIONS = [
  "Leather",
  "Silk",
  "Gold Plated",
  "Sterling Silver",
  "Velvet",
  "Brass",
  "Acetate",
  "Glass",
  "Resin",
];

const RATING_OPTIONS = [4, 3, 2] as const;

// ─── FilterSection accordion wrapper ─────────────────────────────────────────

function FilterSection({
  title,
  icon,
  children,
  badge,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-brand-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 px-1 group"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-brand-slate group-hover:text-brand-rose transition-colors">
            {icon}
          </span>
          <span className="font-sans font-semibold text-sm text-brand-ink">
            {title}
          </span>
          {badge !== undefined && badge > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 bg-brand-rose text-white text-2xs font-bold rounded-full flex items-center justify-center">
              {badge}
            </span>
          )}
        </div>
        <span className="text-brand-slate group-hover:text-brand-rose transition-colors">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {open && (
        <div className="pb-4 px-1 animate-slide-up">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between py-1.5 cursor-pointer group"
    >
      <span className="font-sans text-sm text-brand-ink group-hover:text-brand-rose transition-colors">
        {label}
      </span>
      <div
        className={cn(
          "relative w-10 h-5 rounded-full transition-colors duration-200",
          checked ? "bg-brand-rose" : "bg-brand-border"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm",
            "transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
    </label>
  );
}

// ─── Checkbox row ─────────────────────────────────────────────────────────────

function CheckRow({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  count?: number;
}) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
      <div
        className={cn(
          "w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all",
          checked
            ? "bg-brand-rose border-brand-rose"
            : "border-brand-border group-hover:border-brand-rose"
        )}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        )}
      </div>
      <span className={cn(
        "font-sans text-sm transition-colors flex-1",
        checked ? "text-brand-rose font-medium" : "text-brand-ink group-hover:text-brand-rose"
      )}>
        {label}
      </span>
      {count !== undefined && (
        <span className="text-2xs text-brand-slate font-medium">{count}</span>
      )}
    </label>
  );
}

// ─── Filter Panel content (shared between sidebar & bottom-sheet) ─────────────

function FilterPanelContent({
  filters,
  onChange,
  brands,
  onClearAll,
  activeCount,
}: {
  filters: ActiveFilters;
  onChange: (next: Partial<ActiveFilters>) => void;
  brands: any[];
  onClearAll: () => void;
  activeCount: number;
}) {
  const brandNames = brands.map((b: any) => b.name).filter(Boolean);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-3 border-b border-brand-border shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-rose" />
          <span className="font-serif font-semibold text-brand-ink text-base">Filters</span>
          {activeCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 bg-brand-rose text-white text-2xs font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="font-sans text-xs font-medium text-brand-slate hover:text-brand-rose transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto scrollbar-thin overscroll-contain">
        {/* Availability */}
        <FilterSection
          title="Availability"
          icon={<Package className="w-4 h-4" />}
          defaultOpen
        >
          <div className="space-y-1">
            <ToggleSwitch
              id="filter-in-stock"
              label="In Stock Only"
              checked={filters.inStock}
              onChange={(v) => onChange({ inStock: v })}
            />
            <ToggleSwitch
              id="filter-on-sale"
              label="On Sale"
              checked={filters.onSale}
              onChange={(v) => onChange({ onSale: v })}
            />
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          icon={<Tag className="w-4 h-4" />}
          badge={filters.priceRange ? 1 : 0}
          defaultOpen
        >
          <PriceRangeSlider
            min={PRICE_ABSOLUTE_MIN}
            max={PRICE_ABSOLUTE_MAX}
            step={100}
            currentMin={filters.priceRange?.min ?? PRICE_ABSOLUTE_MIN}
            currentMax={filters.priceRange?.max ?? PRICE_ABSOLUTE_MAX}
            onChange={(min, max) => {
              const isDefault = min === PRICE_ABSOLUTE_MIN && max === PRICE_ABSOLUTE_MAX;
              onChange({ priceRange: isDefault ? null : { min, max } });
            }}
          />
          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {[
              { label: "Under ₹500",   min: 0,    max: 500 },
              { label: "₹500–₹1500",   min: 500,  max: 1500 },
              { label: "₹1500–₹5000",  min: 1500, max: 5000 },
              { label: "₹5000+",       min: 5000, max: PRICE_ABSOLUTE_MAX },
            ].map((preset) => {
              const isActive =
                filters.priceRange?.min === preset.min &&
                filters.priceRange?.max === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    onChange({
                      priceRange: isActive ? null : { min: preset.min, max: preset.max },
                    })
                  }
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                    isActive
                      ? "bg-brand-rose text-white border-brand-rose"
                      : "bg-white text-brand-slate border-brand-border hover:border-brand-rose hover:text-brand-rose"
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Color */}
        <FilterSection
          title="Color"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" />
            </svg>
          }
          badge={filters.colors.length}
          defaultOpen
        >
          <div className="grid grid-cols-6 gap-2.5 pt-1">
            {COLOR_OPTIONS.map((color) => {
              const isSelected = filters.colors.includes(color.hex);
              return (
                <button
                  key={color.hex}
                  type="button"
                  aria-label={`${color.label}${isSelected ? " (selected)" : ""}`}
                  title={color.label}
                  onClick={() => {
                    const next = isSelected
                      ? filters.colors.filter((c) => c !== color.hex)
                      : [...filters.colors, color.hex];
                    onChange({ colors: next });
                  }}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all duration-150",
                    "hover:scale-110 active:scale-95 focus:outline-none",
                    isSelected
                      ? "border-brand-rose ring-2 ring-brand-rose ring-offset-2 scale-110"
                      : "border-white shadow-sm hover:border-brand-rose"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
          {/* Color labels for selected */}
          {filters.colors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {filters.colors.map((hex) => {
                const opt = COLOR_OPTIONS.find((c) => c.hex === hex);
                return (
                  <span key={hex} className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blush rounded-full text-2xs text-brand-rose font-medium">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: hex }} />
                    {opt?.label ?? hex}
                  </span>
                );
              })}
            </div>
          )}
        </FilterSection>

        {/* Rating */}
        <FilterSection
          title="Customer Rating"
          icon={<Star className="w-4 h-4" />}
          badge={filters.minRating !== null ? 1 : 0}
        >
          <div className="space-y-0.5">
            {RATING_OPTIONS.map((r) => {
              const isActive = filters.minRating === r;
              return (
                <button
                  key={r}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => onChange({ minRating: isActive ? null : r })}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-xl text-sm transition-colors",
                    isActive
                      ? "bg-brand-blush text-brand-rose"
                      : "text-brand-ink hover:bg-brand-mist"
                  )}
                >
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={cn("w-3.5 h-3.5", i <= r ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200")}
                      />
                    ))}
                  </span>
                  <span className={cn("font-medium", isActive && "text-brand-rose")}>
                    {r}+ & above
                  </span>
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Brand */}
        {brandNames.length > 0 && (
          <FilterSection
            title="Brand"
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            }
            badge={filters.brands.length}
          >
            <div className="space-y-0.5 max-h-52 overflow-y-auto scrollbar-thin">
              {brandNames.map((brand) => (
                <CheckRow
                  key={brand}
                  label={brand}
                  checked={filters.brands.includes(brand)}
                  onChange={(checked) => {
                    const next = checked
                      ? [...filters.brands, brand]
                      : filters.brands.filter((b) => b !== brand);
                    onChange({ brands: next });
                  }}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Material */}
        <FilterSection
          title="Material"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          }
          badge={filters.materials.length}
          defaultOpen={false}
        >
          <div className="space-y-0.5">
            {MATERIAL_OPTIONS.map((mat) => (
              <CheckRow
                key={mat}
                label={mat}
                checked={filters.materials.includes(mat)}
                onChange={(checked) => {
                  const next = checked
                    ? [...filters.materials, mat]
                    : filters.materials.filter((m) => m !== mat);
                  onChange({ materials: next });
                }}
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

export function FilterSidebar({
  filters,
  onChange,
  brands,
  onClearAll,
  activeCount,
}: {
  filters: ActiveFilters;
  onChange: (next: Partial<ActiveFilters>) => void;
  brands: any[];
  onClearAll: () => void;
  activeCount: number;
}) {
  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0">
      <div className="sticky top-[130px] h-[calc(100vh-150px)] overflow-hidden">
        <FilterPanelContent
          filters={filters}
          onChange={onChange}
          brands={brands}
          onClearAll={onClearAll}
          activeCount={activeCount}
        />
      </div>
    </aside>
  );
}

// ─── Mobile Bottom-Sheet ──────────────────────────────────────────────────────

export function MobileFilterSheet({
  filters,
  onChange,
  brands,
  onClearAll,
  activeCount,
}: {
  filters: ActiveFilters;
  onChange: (next: Partial<ActiveFilters>) => void;
  brands: any[];
  onClearAll: () => void;
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Trigger button (visible only on mobile/tablet) */}
      <button
        type="button"
        id="mobile-filter-btn"
        onClick={() => setOpen(true)}
        className={cn(
          "lg:hidden inline-flex items-center gap-2 h-9 px-4 rounded-full border font-sans text-sm font-medium",
          "transition-all duration-200",
          activeCount > 0
            ? "bg-brand-rose text-white border-brand-rose"
            : "bg-white border-brand-border text-brand-slate hover:border-brand-rose hover:text-brand-rose"
        )}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Filters
        {activeCount > 0 && (
          <span className="min-w-[18px] h-[18px] px-1 bg-white text-brand-rose text-2xs font-bold rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-brand-ink/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sheet */}
      <div
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 z-50",
          "bg-white rounded-t-3xl shadow-drawer",
          "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "h-[90dvh]",
          // iOS safe area
          "pb-[env(safe-area-inset-bottom,0px)]",
          open ? "translate-y-0" : "translate-y-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-brand-border rounded-full" />
        </div>

        {/* Close button */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-rose" />
            <span className="font-serif font-semibold text-brand-ink text-base">Filters</span>
            {activeCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 bg-brand-rose text-white text-2xs font-bold rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close filters"
            className="p-2 rounded-full hover:bg-brand-mist transition-colors"
          >
            <X className="w-5 h-5 text-brand-slate" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4 h-[calc(90dvh-160px)]">
          {/* Sections */}
          <FilterPanelContent
            filters={filters}
            onChange={onChange}
            brands={brands}
            onClearAll={onClearAll}
            activeCount={activeCount}
          />
        </div>

        {/* Sticky footer */}
        <div
          className={cn(
            "shrink-0 px-5 py-3 border-t border-brand-border bg-white",
            "pb-[max(12px,env(safe-area-inset-bottom,12px))]"
          )}
        >
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                onClearAll();
              }}
              className={cn(
                "flex-1 h-11 rounded-full border border-brand-border font-sans text-sm font-medium",
                "text-brand-slate hover:border-brand-rose hover:text-brand-rose transition-colors"
              )}
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-2 flex-grow-[2] h-11 rounded-full bg-brand-rose text-white font-sans text-sm font-semibold hover:bg-brand-rose-dark transition-colors"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
