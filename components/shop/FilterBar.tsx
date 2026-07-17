"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ActiveFilters, SortBy } from "@/lib/types";
import { PriceRangeSlider } from "./PriceRangeSlider";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Tag,
  Package,
  Check,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

export const PRICE_ABSOLUTE_MIN = 0;
export const PRICE_ABSOLUTE_MAX = 50000;

// Full jewelry / fashion color palette — 28 colors
const COLOR_OPTIONS = [
  // Pinks & Reds
  { hex: "#FF1493", label: "Hot Pink" },
  { hex: "#C9748A", label: "Rose Pink" },
  { hex: "#B76E79", label: "Rose Gold" },
  { hex: "#FF6B6B", label: "Coral" },
  { hex: "#FF4444", label: "Red" },
  { hex: "#DC143C", label: "Crimson" },
  { hex: "#800000", label: "Maroon" },
  { hex: "#722F37", label: "Burgundy" },
  // Oranges & Yellows
  { hex: "#FF8C00", label: "Orange" },
  { hex: "#FFD700", label: "Yellow" },
  { hex: "#F39C12", label: "Amber" },
  { hex: "#C9A96E", label: "Gold" },
  // Greens
  { hex: "#50C878", label: "Emerald" },
  { hex: "#228B22", label: "Green" },
  { hex: "#2D5A27", label: "Dark Green" },
  { hex: "#1ABC9C", label: "Teal" },
  // Blues
  { hex: "#87CEEB", label: "Light Blue" },
  { hex: "#4A90D9", label: "Blue" },
  { hex: "#1E90FF", label: "Royal Blue" },
  { hex: "#000080", label: "Navy" },
  // Purples
  { hex: "#DA70D6", label: "Orchid" },
  { hex: "#9B59B6", label: "Amethyst" },
  { hex: "#800080", label: "Purple" },
  // Neutrals & Metallics
  { hex: "#8B5E3C", label: "Brown" },
  { hex: "#C0C0C0", label: "Silver" },
  { hex: "#1A1A1A", label: "Black" },
  { hex: "#808080", label: "Grey" },
  { hex: "#FFFFFF", label: "White" },
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

// Default reset values (everything cleared, category / sortBy preserved)
const FILTER_DEFAULTS = {
  priceRange: null,
  colors: [] as string[],
  materials: [] as string[],
  brands: [] as string[],
  minRating: null as number | null,
  inStock: false,
  onSale: false,
};

function computeActiveCount(f: ActiveFilters): number {
  return (
    (f.priceRange ? 1 : 0) +
    f.colors.length +
    f.materials.length +
    f.brands.length +
    (f.minRating !== null ? 1 : 0) +
    (f.inStock ? 1 : 0) +
    (f.onSale ? 1 : 0)
  );
}

// ─── FilterSection accordion ──────────────────────────────────────────────────

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
          <span className="font-sans font-semibold text-sm text-brand-ink">{title}</span>
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
        <div className="pb-4 px-1 animate-slide-up">{children}</div>
      )}
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

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
      className="flex items-center justify-between py-2 cursor-pointer group"
    >
      <span className="font-sans text-sm text-brand-ink group-hover:text-brand-rose transition-colors">
        {label}
      </span>
      <div
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
          checked ? "bg-brand-rose" : "bg-brand-border"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm",
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
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer group">
      <div
        className={cn(
          "w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all",
          checked
            ? "bg-brand-rose border-brand-rose"
            : "border-brand-border group-hover:border-brand-rose"
        )}
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        )}
      </div>
      <span
        className={cn(
          "font-sans text-sm transition-colors flex-1",
          checked ? "text-brand-rose font-medium" : "text-brand-ink group-hover:text-brand-rose"
        )}
      >
        {label}
      </span>
    </label>
  );
}

// ─── FilterPanelContent ───────────────────────────────────────────────────────
// Renders all filter sections. Works with whatever `draft` state is passed in.

function FilterPanelContent({
  draft,
  setDraft,
  brands,
  hideHeader = false,
  draftActiveCount,
  onClearDraft,
}: {
  draft: ActiveFilters;
  setDraft: (next: Partial<ActiveFilters>) => void;
  brands: any[];
  hideHeader?: boolean;
  draftActiveCount: number;
  onClearDraft: () => void;
}) {
  const brandNames = brands.map((b: any) => b.name).filter(Boolean);

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar header (hidden inside mobile sheet — sheet has its own) */}
      {!hideHeader && (
        <div className="flex items-center justify-between mb-2 pb-3 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-rose" />
            <span className="font-serif font-semibold text-brand-ink text-base">Filters</span>
            {draftActiveCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 bg-brand-rose text-white text-2xs font-bold rounded-full flex items-center justify-center">
                {draftActiveCount}
              </span>
            )}
          </div>
          {draftActiveCount > 0 && (
            <button
              type="button"
              onClick={onClearDraft}
              className="font-sans text-xs font-medium text-brand-slate hover:text-brand-rose transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Scrollable filter sections */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* ── Availability ── */}
        <FilterSection
          title="Availability"
          icon={<Package className="w-4 h-4" />}
          defaultOpen
        >
          <div className="space-y-1">
            <ToggleSwitch
              id="filter-in-stock"
              label="In Stock Only"
              checked={draft.inStock}
              onChange={(v) => setDraft({ inStock: v })}
            />
            <ToggleSwitch
              id="filter-on-sale"
              label="On Sale"
              checked={draft.onSale}
              onChange={(v) => setDraft({ onSale: v })}
            />
          </div>
        </FilterSection>

        {/* ── Price Range ── */}
        <FilterSection
          title="Price Range"
          icon={<Tag className="w-4 h-4" />}
          badge={draft.priceRange ? 1 : 0}
          defaultOpen
        >
          <PriceRangeSlider
            min={PRICE_ABSOLUTE_MIN}
            max={PRICE_ABSOLUTE_MAX}
            step={100}
            currentMin={draft.priceRange?.min ?? PRICE_ABSOLUTE_MIN}
            currentMax={draft.priceRange?.max ?? PRICE_ABSOLUTE_MAX}
            onChange={(mn, mx) => {
              const isDefault = mn === PRICE_ABSOLUTE_MIN && mx === PRICE_ABSOLUTE_MAX;
              setDraft({ priceRange: isDefault ? null : { min: mn, max: mx } });
            }}
          />
          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {[
              { label: "Under ₹500",  min: 0,    max: 500   },
              { label: "₹500–₹1500",  min: 500,  max: 1500  },
              { label: "₹1500–₹5000", min: 1500, max: 5000  },
              { label: "₹5000+",      min: 5000, max: PRICE_ABSOLUTE_MAX },
            ].map((preset) => {
              const isActive =
                draft.priceRange?.min === preset.min &&
                draft.priceRange?.max === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    setDraft({
                      priceRange: isActive ? null : { min: preset.min, max: preset.max },
                    })
                  }
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-all",
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

        {/* ── Color — all 28 colors in a 7-per-row grid ── */}
        <FilterSection
          title="Color"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
          }
          badge={draft.colors.length}
          defaultOpen
        >
          <div className="grid grid-cols-7 gap-2 pt-1 pb-1">
            {COLOR_OPTIONS.map((color) => {
              const isSelected = draft.colors.includes(color.hex);
              // White needs a border to be visible on white background
              const needsBorder = color.hex === "#FFFFFF" || color.hex === "#FFFFF0";
              return (
                <button
                  key={color.hex}
                  type="button"
                  title={color.label}
                  aria-label={`${color.label}${isSelected ? " (selected)" : ""}`}
                  onClick={() => {
                    const next = isSelected
                      ? draft.colors.filter((c) => c !== color.hex)
                      : [...draft.colors, color.hex];
                    setDraft({ colors: next });
                  }}
                  className={cn(
                    "relative w-8 h-8 rounded-full transition-all duration-150",
                    "hover:scale-110 active:scale-95 focus:outline-none",
                    needsBorder && "border border-brand-border",
                    isSelected
                      ? "ring-2 ring-brand-rose ring-offset-2 scale-110"
                      : "shadow-sm"
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check
                        className={cn(
                          "w-3.5 h-3.5",
                          // Dark tick for light colors
                          ["#FFFFFF", "#FFFFF0", "#FFD700", "#87CEEB", "#C0C0C0"].includes(color.hex)
                            ? "text-brand-ink"
                            : "text-white"
                        )}
                        strokeWidth={3}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Show selected color names */}
          {draft.colors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {draft.colors.map((hex) => {
                const opt = COLOR_OPTIONS.find((c) => c.hex === hex);
                return (
                  <span
                    key={hex}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blush rounded-full text-2xs text-brand-rose font-medium"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0 border border-white"
                      style={{ backgroundColor: hex }}
                    />
                    {opt?.label ?? hex}
                  </span>
                );
              })}
            </div>
          )}
        </FilterSection>

        {/* ── Rating ── */}
        <FilterSection
          title="Customer Rating"
          icon={<Star className="w-4 h-4" />}
          badge={draft.minRating !== null ? 1 : 0}
        >
          <div className="space-y-0.5">
            {RATING_OPTIONS.map((r) => {
              const isActive = draft.minRating === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setDraft({ minRating: isActive ? null : r })}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2.5 rounded-xl text-sm transition-colors",
                    isActive ? "bg-brand-blush text-brand-rose" : "text-brand-ink hover:bg-brand-mist"
                  )}
                >
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3.5 h-3.5",
                          i <= r ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"
                        )}
                      />
                    ))}
                  </span>
                  <span className={cn("font-medium", isActive && "text-brand-rose")}>
                    {r}+ & above
                  </span>
                  {isActive && <Check className="w-3.5 h-3.5 ml-auto text-brand-rose" />}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* ── Brand ── */}
        {brandNames.length > 0 && (
          <FilterSection
            title="Brand"
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            }
            badge={draft.brands.length}
            defaultOpen={false}
          >
            <div className="space-y-0.5 max-h-52 overflow-y-auto scrollbar-thin">
              {brandNames.map((brand) => (
                <CheckRow
                  key={brand}
                  label={brand}
                  checked={draft.brands.includes(brand)}
                  onChange={(checked) => {
                    const next = checked
                      ? [...draft.brands, brand]
                      : draft.brands.filter((b) => b !== brand);
                    setDraft({ brands: next });
                  }}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* ── Material ── */}
        <FilterSection
          title="Material"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          }
          badge={draft.materials.length}
          defaultOpen={false}
        >
          <div className="space-y-0.5">
            {MATERIAL_OPTIONS.map((mat) => (
              <CheckRow
                key={mat}
                label={mat}
                checked={draft.materials.includes(mat)}
                onChange={(checked) => {
                  const next = checked
                    ? [...draft.materials, mat]
                    : draft.materials.filter((m) => m !== mat);
                  setDraft({ materials: next });
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
}: {
  filters: ActiveFilters;
  onChange: (next: Partial<ActiveFilters>) => void;
  brands: any[];
  onClearAll: () => void;
  activeCount: number; // kept for API compat but computed from draft internally
}) {
  const [draft, setDraftState] = useState<ActiveFilters>(filters);

  // Sync draft when applied filters change from outside (e.g. category switch, clear all)
  useEffect(() => {
    setDraftState(filters);
  }, [filters]);

  const setDraft = (next: Partial<ActiveFilters>) =>
    setDraftState((prev) => ({ ...prev, ...next }));

  const draftActiveCount = useMemo(() => computeActiveCount(draft), [draft]);

  const handleClearDraft = () => {
    const reset = { ...draft, ...FILTER_DEFAULTS };
    setDraftState(reset);
    onClearAll();                // also clear applied immediately
  };

  const handleApply = () => {
    onChange(draft);              // apply draft → parent
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0">
      <div className="sticky top-[130px] flex flex-col h-[calc(100vh-150px)] overflow-hidden">
        {/* Panel content */}
        <div className="flex-1 min-h-0">
          <FilterPanelContent
            draft={draft}
            setDraft={setDraft}
            brands={brands}
            draftActiveCount={draftActiveCount}
            onClearDraft={handleClearDraft}
          />
        </div>

        {/* ── Apply Filters button — desktop ── */}
        <div className="shrink-0 pt-3 pb-1 border-t border-brand-border">
          <button
            id="sidebar-apply-filters-btn"
            type="button"
            onClick={handleApply}
            className={cn(
              "w-full h-10 rounded-full font-sans text-sm font-semibold",
              "transition-all duration-200 active:scale-[0.98]",
              draftActiveCount > 0
                ? "bg-brand-rose text-white hover:bg-brand-rose-dark"
                : "bg-brand-mist text-brand-slate border border-brand-border"
            )}
          >
            {draftActiveCount > 0 ? `Apply ${draftActiveCount} Filter${draftActiveCount > 1 ? "s" : ""}` : "Apply Filters"}
          </button>
        </div>
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

  // Local draft — independent of applied state until user taps "Apply"
  const [draft, setDraftState] = useState<ActiveFilters>(filters);

  // Sync draft when sheet is opened (so it reflects latest applied state)
  useEffect(() => {
    if (open) setDraftState(filters);
  }, [open]); // eslint-disable-line

  // Also sync if applied filters change from outside while sheet is closed
  useEffect(() => {
    if (!open) setDraftState(filters);
  }, [filters]); // eslint-disable-line

  const setDraft = (next: Partial<ActiveFilters>) =>
    setDraftState((prev) => ({ ...prev, ...next }));

  const draftActiveCount = useMemo(() => computeActiveCount(draft), [draft]);

  const handleClearDraft = () => {
    const reset = { ...draft, ...FILTER_DEFAULTS };
    setDraftState(reset);
  };

  const handleApply = () => {
    onChange(draft);   // commit draft → parent
    setOpen(false);
  };

  const handleClearAll = () => {
    const reset = { ...draft, ...FILTER_DEFAULTS };
    setDraftState(reset);
    onClearAll();       // also clear applied immediately
    setOpen(false);
  };

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Trigger button ── */}
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

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-brand-ink/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Bottom Sheet ── */}
      <div
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 z-50",
          "bg-white rounded-t-3xl shadow-drawer",
          "flex flex-col",
          "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-y-0" : "translate-y-full"
        )}
        style={{ height: "min(90dvh, 90vh)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-brand-border rounded-full" />
        </div>

        {/* Sheet header */}
        <div className="flex items-center justify-between px-5 pt-1 pb-3 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-rose" />
            <span className="font-serif font-semibold text-brand-ink text-base">Filters</span>
            {draftActiveCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 bg-brand-rose text-white text-2xs font-bold rounded-full flex items-center justify-center">
                {draftActiveCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {draftActiveCount > 0 && (
              <button
                type="button"
                onClick={handleClearDraft}
                className="px-3 py-1 font-sans text-xs font-medium text-brand-slate hover:text-brand-rose transition-colors"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="p-2 rounded-full hover:bg-brand-mist transition-colors"
            >
              <X className="w-5 h-5 text-brand-slate" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 min-h-0"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <FilterPanelContent
            draft={draft}
            setDraft={setDraft}
            brands={brands}
            hideHeader
            draftActiveCount={draftActiveCount}
            onClearDraft={handleClearDraft}
          />
        </div>

        {/* ── Sticky footer with Apply button ── */}
        <div
          className="shrink-0 px-5 pt-3 border-t border-brand-border bg-white"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))" }}
        >
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              className={cn(
                "flex-1 h-11 rounded-full border font-sans text-sm font-medium transition-colors",
                "border-brand-border text-brand-slate hover:border-brand-rose hover:text-brand-rose"
              )}
            >
              Clear All
            </button>
            <button
              id="mobile-apply-filters-btn"
              type="button"
              onClick={handleApply}
              className={cn(
                "flex-[2] h-11 rounded-full font-sans text-sm font-semibold transition-all active:scale-[0.98]",
                draftActiveCount > 0
                  ? "bg-brand-rose text-white hover:bg-brand-rose-dark"
                  : "bg-brand-mist text-brand-slate border border-brand-border"
              )}
            >
              {draftActiveCount > 0
                ? `Apply ${draftActiveCount} Filter${draftActiveCount > 1 ? "s" : ""}`
                : "View Products"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
