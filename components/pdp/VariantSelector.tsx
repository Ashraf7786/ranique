"use client";

import React from "react";
import { ColorVariant, SizeVariant, ProductVariant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface VariantSelectorProps {
  variants: ProductVariant;
  selectedColor: ColorVariant | undefined;
  selectedSize: SizeVariant | undefined;
  onColorChange: (color: ColorVariant) => void;
  onSizeChange: (size: SizeVariant) => void;
}

export function VariantSelector({
  variants,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: VariantSelectorProps) {
  const router = useRouter();

  const handleColorClick = (color: ColorVariant) => {
    if (color.stock === 0) return;
    
    // If the color variant points to a different product URL (sibling variant), navigate to it
    if (color.slug) {
      // Check if we are already on that product page by comparing with selectedColor's slug
      if (selectedColor?.slug !== color.slug) {
        router.push(`/product/${color.slug}`);
      }
    } else {
      onColorChange(color);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Colors ── */}
      {variants.colors && variants.colors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="font-sans text-sm font-semibold text-brand-ink">
              Color
            </p>
            {selectedColor && (
              <span className="text-sm text-brand-slate">
                — {selectedColor.label}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {variants.colors.map((color, index) => {
              // Fallback to hex if label is missing
              const uniqueIdentifier = color.id || color.label || color.hex || index;
              const isSelected = (selectedColor?.id && selectedColor.id === color.id) || 
                                 (selectedColor?.label && selectedColor.label === color.label) || 
                                 (selectedColor?.hex && selectedColor.hex === color.hex);
              const outOfStock = color.stock === 0;
              return (
                <button
                  key={uniqueIdentifier as React.Key}
                  id={`color-${uniqueIdentifier}`}
                  type="button"
                  onClick={() => handleColorClick(color)}
                  disabled={outOfStock}
                  aria-label={`${color.label}${outOfStock ? " — out of stock" : ""}`}
                  aria-pressed={!!isSelected}
                  title={outOfStock ? `${color.label} — out of stock` : color.label}
                  className={cn(
                    "relative w-9 h-9 rounded-full transition-all duration-200",
                    "border-2",
                    "hover:scale-110 active:scale-95",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose focus-visible:ring-offset-2",
                    isSelected
                      ? "border-brand-rose ring-2 ring-brand-rose ring-offset-2"
                      : "border-white shadow-sm hover:border-brand-rose-light",
                    outOfStock && "opacity-40 cursor-not-allowed hover:scale-100"
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Out-of-stock diagonal line */}
                  {outOfStock && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full overflow-hidden"
                    >
                      <span className="absolute inset-0 rotate-45 translate-y-1/2 border-t border-brand-slate/40" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Sizes ── */}
      {variants.sizes && variants.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-sans text-sm font-semibold text-brand-ink">Size</p>
            <button className="text-xs text-brand-rose underline-offset-2 hover:underline">
              Size Chart
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.sizes.map((size, index) => {
              const uniqueIdentifier = size.id || size.label || index;
              const isSelected = (selectedSize?.id && selectedSize.id === size.id) || 
                                 (selectedSize?.label && selectedSize.label === size.label);
              const outOfStock = size.stock === 0;
              return (
                <button
                  key={uniqueIdentifier as React.Key}
                  id={`size-${uniqueIdentifier}`}
                  type="button"
                  onClick={() => !outOfStock && onSizeChange(size)}
                  disabled={outOfStock}
                  aria-label={`Size ${size.label}${outOfStock ? " — out of stock" : ""}`}
                  aria-pressed={!!isSelected}
                  className={cn(
                    "relative h-10 px-4 rounded-full border font-sans text-sm",
                    "transition-all duration-150 active:scale-95",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose focus-visible:ring-offset-2",
                    isSelected
                      ? "border-brand-rose bg-brand-rose text-white"
                      : "border-brand-border bg-white text-brand-ink hover:border-brand-rose hover:text-brand-rose",
                    outOfStock && "opacity-40 cursor-not-allowed line-through"
                  )}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
