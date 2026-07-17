import React from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Search, PackageOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";

interface ProductGridProps {
  products: Product[];
  priorityCount?: number;
  viewMode?: "grid" | "list";
}

// ─── List card ─────────────────────────────────────────────────────────────────
function ProductListCard({ product, priority }: { product: Product; priority: boolean }) {
  const hasActiveOffer =
    product.offer && product.offer.isActive && new Date(product.offer.endsAt) > new Date();
  const currentPrice = hasActiveOffer ? product.offer!.offerPrice : product.price;
  const originalPrice = hasActiveOffer ? product.price : product.compareAtPrice;
  const discount = hasActiveOffer
    ? product.offer!.discount
    : product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  return (
    <article
      className={cn(
        "group flex gap-4 bg-white rounded-2xl overflow-hidden",
        "shadow-card hover:shadow-card-hover transition-shadow duration-300 p-3 sm:p-4"
      )}
    >
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative shrink-0 w-28 sm:w-36 aspect-product rounded-xl overflow-hidden bg-brand-blush"
      >
        {product.images[0]?.src ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            fill
            sizes="(max-width: 640px) 112px, 144px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-blush">
            <PackageOpen className="w-8 h-8 text-brand-rose opacity-50" />
          </div>
        )}
        {discount && (
          <span className="absolute top-2 left-2 bg-brand-rose text-white text-2xs font-bold px-1.5 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <p className="text-2xs text-brand-slate font-medium uppercase tracking-wider truncate">
          {product.brand}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="font-serif text-sm sm:text-base font-medium text-brand-ink line-clamp-2 hover:text-brand-rose transition-colors leading-snug"
        >
          {product.name}
        </Link>

        {product.reviewCount > 0 && (
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        )}

        {product.description && (
          <p className="text-xs text-brand-slate line-clamp-2 hidden sm:block mt-0.5">
            {product.description}
          </p>
        )}

        {/* Color swatches */}
        {product.variants?.colors && product.variants.colors.length > 0 && (
          <div className="flex gap-1 mt-1">
            {product.variants.colors.slice(0, 6).map((color, idx) => (
              <span
                key={idx}
                title={color.label}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-brand-border"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.variants.colors.length > 6 && (
              <span className="text-2xs text-brand-slate self-center">
                +{product.variants.colors.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-base sm:text-lg font-bold font-serif",
              hasActiveOffer ? "text-brand-rose" : "text-brand-ink"
            )}>
              {formatPrice(currentPrice, product.currency)}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice, product.currency)}
              </span>
            )}
          </div>
          <Link
            href={`/product/${product.slug}`}
            className={cn(
              "shrink-0 px-4 h-8 rounded-full font-sans text-xs font-semibold",
              "bg-brand-rose text-white hover:bg-brand-rose-dark",
              "transition-all duration-200 active:scale-95 flex items-center"
            )}
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── ProductGrid ───────────────────────────────────────────────────────────────

export function ProductGrid({
  products,
  priorityCount = 4,
  viewMode = "grid",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-brand-blush rounded-full flex items-center justify-center mb-5">
          <Search className="w-9 h-9 text-brand-rose opacity-60" strokeWidth={1.5} />
        </div>
        <h2 className="font-serif text-xl text-brand-ink mb-2">No products found</h2>
        <p className="text-sm text-brand-slate max-w-xs">
          Try adjusting your filters or browse a different category. We're always adding new arrivals!
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div role="list" aria-label="Products" className="flex flex-col gap-3">
        {products.map((product, idx) => (
          <div key={product.id} role="listitem">
            <ProductListCard product={product} priority={idx < priorityCount} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      role="list"
      aria-label="Products"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
    >
      {products.map((product, idx) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} priority={idx < priorityCount} />
        </div>
      ))}
    </div>
  );
}
