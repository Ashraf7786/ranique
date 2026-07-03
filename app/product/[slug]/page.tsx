"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { ColorVariant, SizeVariant } from "@/lib/types";
import { ProductGallery } from "@/components/pdp/ProductGallery";
import { VariantSelector } from "@/components/pdp/VariantSelector";
import { AddToCartBar } from "@/components/pdp/AddToCartBar";
import { ProductTabs } from "@/components/pdp/ProductTabs";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

// ─── Inner Client Component ────────────────────────────────────────────────────

function PDPClient({ slug }: { slug: string }) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(
    product.variants.colors?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<SizeVariant | undefined>(
    product.variants.sizes?.[0]
  );

  const effectivePrice = product.price + (selectedColor?.priceModifier ?? 0);

  // Related products: same category, different id, max 4
  const related = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // Tab content
  const tabs = [
    {
      id: "description",
      label: "Description",
      content: (
        <div className="prose-luxury">
          <p>{product.description}</p>
          {product.details.length > 0 && (
            <>
              <p className="font-semibold text-brand-ink mt-4 mb-2">Details</p>
              <ul>
                {product.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ),
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      content: (
        <div className="prose-luxury">
          <p>{product.shipping}</p>
          <p className="mt-3">
            We accept returns within 30 days of delivery for unused, unopened items in original packaging. Final sale items cannot be returned.
          </p>
        </div>
      ),
    },
    {
      id: "reviews",
      label: `Reviews (${product.reviewCount})`,
      content: (
        <div className="space-y-4">
          {/* Aggregate */}
          <div className="flex items-center gap-4 p-4 bg-brand-mist rounded-2xl">
            <div className="text-center">
              <p className="font-serif text-4xl font-semibold text-brand-ink">
                {product.rating}
              </p>
              <StarRating rating={product.rating} showCount={false} size="md" />
              <p className="text-2xs text-brand-slate mt-1">
                {product.reviewCount} reviews
              </p>
            </div>
          </div>

          {/* Review list */}
          {product.reviews?.map((review) => (
            <div key={review.id} className="border-b border-brand-border pb-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-rose flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-brand-ink">
                      {review.author}
                    </p>
                    {review.verified && (
                      <span className="text-2xs text-green-600 font-medium">✓ Verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={review.rating} showCount={false} size="sm" />
                    <span className="text-2xs text-brand-slate">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-brand-slate pl-11">{review.body}</p>
            </div>
          ))}

          {(!product.reviews || product.reviews.length === 0) && (
            <p className="text-sm text-brand-slate text-center py-4">
              No written reviews yet. Be the first!
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-brand-slate mb-6">
        <Link href="/" className="hover:text-brand-rose transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-rose transition-colors">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-brand-rose transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-brand-ink font-medium truncate max-w-[160px]">{product.name}</span>
      </nav>

      {/* Main PDP layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Left: Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Right: Info */}
        <div className="flex flex-col gap-5">
          {/* Brand + Badge */}
          <div className="flex items-center gap-2">
            <p className="text-xs text-brand-slate font-medium uppercase tracking-widest">
              {product.brand}
            </p>
            {product.badge && <Badge type={product.badge} />}
          </div>

          {/* Name */}
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="md"
          />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-sans text-2xl font-bold text-brand-ink">
              {formatPrice(effectivePrice, product.currency)}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-brand-slate line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="text-sm font-semibold text-brand-rose">
                Save {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-sm text-brand-slate leading-relaxed">
            {product.description.substring(0, 140)}…
          </p>

          {/* Variant selector */}
          <VariantSelector
            variants={product.variants}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
          />

          {/* Add to Cart */}
          <AddToCartBar
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
          />

          {/* Trust icons */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-brand-border">
            {[
              { icon: "🚚", label: "Free shipping over $50" },
              { icon: "🔒", label: "Secure checkout" },
              { icon: "↩️", label: "30-day returns" },
            ].map((t) => (
              <span key={t.label} className="flex items-center gap-1.5 text-xs text-brand-slate">
                <span>{t.icon}</span> {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <ProductTabs tabs={tabs} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section aria-label="Related products">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-brand-ink">
              You May Also Love
            </h2>
          </div>
          <ProductGrid products={related} priorityCount={2} />
        </section>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  return <PDPClient slug={slug} />;
}
