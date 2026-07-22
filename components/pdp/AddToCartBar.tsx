"use client";

import React, { useState } from "react";
import { Product, ColorVariant, SizeVariant } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import { formatPrice, cn, flyToCart } from "@/lib/utils";

interface AddToCartBarProps {
  product: Product;
  selectedColor: ColorVariant | undefined;
  selectedSize: SizeVariant | undefined;
}

export function AddToCartBar({
  product,
  selectedColor,
  selectedSize,
}: AddToCartBarProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const hasActiveOffer = product.offer && product.offer.isActive && new Date(product.offer.endsAt) > new Date();
  const basePrice = hasActiveOffer ? product.offer!.offerPrice : product.price;

  const effectivePrice =
    basePrice + (selectedColor?.priceModifier ?? 0);

  const outOfStock =
    (selectedColor?.stock ?? Infinity) === 0 ||
    (selectedSize?.stock ?? Infinity) === 0;

  function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    if (outOfStock) return;
    
    const button = e.currentTarget;
    // For PDP, we can use the main product image or try to find it on the page
    // The main image in PDP usually has an ID or is easy to find, but we can fall back to the button
    const mainImage = document.querySelector(".pdp-main-image") as HTMLImageElement;
    const imgSrc = mainImage?.src || product.images[0]?.src || "/placeholder.jpg";
    
    flyToCart(mainImage || button, imgSrc);

    addItem(product, qty, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      {/* Quantity selector */}
      <div className="flex items-center border border-brand-border rounded-full overflow-hidden h-12 shrink-0">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="px-3 h-full text-brand-slate active:text-brand-rose active:bg-brand-blush transition-colors text-lg leading-none cursor-pointer"
          style={{ touchAction: "manipulation" }}
        >
          −
        </button>
        <span
          aria-live="polite"
          aria-label={`Quantity: ${qty}`}
          className="w-8 text-center font-sans font-medium text-sm text-brand-ink"
        >
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => q + 1)}
          aria-label="Increase quantity"
          className="px-3 h-full text-brand-slate active:text-brand-rose active:bg-brand-blush transition-colors text-lg leading-none cursor-pointer"
          style={{ touchAction: "manipulation" }}
        >
          +
        </button>
      </div>

      {/* Add to Bag */}
      <button
        id="pdp-add-to-cart"
        onClick={handleAdd}
        disabled={outOfStock}
        aria-label={
          outOfStock
            ? "Out of stock"
            : `Add ${qty} ${product.name} to bag — ${formatPrice(effectivePrice * qty, product.currency)}`
        }
        style={{ touchAction: "manipulation" }}
        className={cn(
          "flex-1 h-12 rounded-full font-sans font-semibold text-sm cursor-pointer",
          "transition-all duration-200 active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose focus-visible:ring-offset-2",
          outOfStock
            ? "bg-brand-mist text-brand-slate cursor-not-allowed"
            : added
            ? "bg-green-500 text-white"
            : "bg-brand-rose text-white active:bg-brand-rose-dark shadow-sm"
        )}
      >
        {outOfStock
          ? "Out of Stock"
          : added
          ? `✓ Added to Bag`
          : `Add to Bag — ${formatPrice(effectivePrice * qty, product.currency)}`}
      </button>
    </div>
  );
}
