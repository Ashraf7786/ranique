"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { formatPrice, cn } from "@/lib/utils";
import { ShoppingBag, Zap } from "lucide-react";
import { OfferCountdown } from "./OfferCountdown";

// ─── Heart Icon ───────────────────────────────────────────────────────────────

function HeartIcon({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [wishlistAnim, setWishlistAnim] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const firstColor = product.variants?.colors?.[0];

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // don't navigate to PDP
      addItem(product, 1, firstColor);
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1800);
    },
    [addItem, product, firstColor]
  );

  const handleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      toggleWishlist(product.id);
      setWishlistAnim(true);
      setTimeout(() => setWishlistAnim(false), 500);
    },
    [toggleWishlist, product.id]
  );

  const hasActiveOffer = product.offer && product.offer.isActive && new Date(product.offer.endsAt) > new Date();
  
  const discount = hasActiveOffer 
    ? product.offer!.discount
    : product.compareAtPrice
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;
      
  const currentPrice = hasActiveOffer ? product.offer!.offerPrice : product.price;
  const originalPrice = hasActiveOffer ? product.price : product.compareAtPrice;

  return (
    <article
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden",
        "shadow-card hover:shadow-card-hover transition-shadow duration-300",
        "flex flex-col"
      )}
      aria-label={product.name}
    >
      {/* ── Image ── */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-product overflow-hidden bg-brand-blush"
        tabIndex={-1}
        aria-hidden
      >
        {product.images[0]?.src ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-blush">
            <ShoppingBag className="w-12 h-12 text-brand-rose opacity-50" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist button */}
        <button
          id={`wishlist-${product.id}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center",
            "bg-white/80 backdrop-blur-sm shadow-sm",
            "transition-all duration-200",
            "opacity-0 group-hover:opacity-100",
            wishlisted && "opacity-100",
            wishlistAnim && "animate-heart-beat"
          )}
        >
          <HeartIcon
            filled={wishlisted}
            className={cn(
              "w-4 h-4 transition-colors",
              wishlisted ? "text-brand-rose" : "text-brand-slate"
            )}
          />
        </button>

        {/* Badges & Discount */}
        {(discount || product.badge) && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount && (
              <span 
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full font-sans font-semibold text-2xs tracking-wide uppercase",
                  hasActiveOffer ? "bg-red-600 text-white animate-pulse" : "bg-brand-gold text-white"
                )}
              >
                {hasActiveOffer ? <><Zap className="w-3 h-3 mr-1 inline" /> {discount}% OFF SALE</> : `-${discount}%`}
              </span>
            )}
            {product.badge && !hasActiveOffer && (
              <Badge type={product.badge} />
            )}
          </div>
        )}
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Brand */}
        <p className="text-2xs text-brand-slate font-medium uppercase tracking-wider truncate">
          {product.brand}
        </p>

        {/* Name */}
        <Link
          href={`/product/${product.slug}`}
          className="font-serif text-sm font-medium text-brand-ink line-clamp-2 leading-snug hover:text-brand-rose transition-colors"
        >
          {product.name}
        </Link>

        {/* Stars */}
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size="sm"
        />

        {/* Price row */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn(
            "text-lg sm:text-xl font-bold font-serif",
            hasActiveOffer ? "text-brand-rose" : "text-brand-ink"
          )}>
            {formatPrice(currentPrice, product.currency)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice, product.currency)}
            </span>
          )}
        </div>
        
        {hasActiveOffer && (
          <div className="mt-2 mb-3">
            <OfferCountdown endsAt={product.offer!.endsAt} compact />
          </div>
        )}

        {/* Color swatches (first 4) */}
        {product.variants?.colors && product.variants.colors.length > 0 && (
          <div className="flex gap-1 mt-0.5">
            {product.variants.colors.slice(0, 4).map((color, index) => (
              <span
                key={index}
                title={color.label}
                className="w-3.5 h-3.5 rounded-full border border-white shadow-sm ring-1 ring-brand-border"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.variants.colors.length > 4 && (
              <span className="text-2xs text-brand-slate self-center">
                +{product.variants.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Add to Cart */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          className={cn(
            "mt-auto w-full h-9 rounded-full font-sans text-xs font-semibold",
            "transition-all duration-200 active:scale-[0.97]",
            addedFeedback
              ? "bg-green-500 text-white"
              : "bg-brand-rose text-white hover:bg-brand-rose-dark"
          )}
        >
          {addedFeedback ? "✓ Added to Bag" : "Add to Bag"}
        </button>
      </div>
    </article>
  );
}
