"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { ColorVariant, SizeVariant } from "@/lib/types";
import { ProductGallery } from "@/components/pdp/ProductGallery";
import { VariantSelector } from "@/components/pdp/VariantSelector";
import { AddToCartBar } from "@/components/pdp/AddToCartBar";
import { ProductTabs } from "@/components/pdp/ProductTabs";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { PinCodeChecker } from "@/components/pdp/PinCodeChecker";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { BadgeCheck, Flame, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CLOTHING_SLUGS = new Set([
  'kurti', 'kurti-set', 'suit', 'salwar-kameez', 'sharara', 'gharara',
  'lehenga', 'lehenga-choli', 'saree', 'readymade-saree', 'anarkali',
  'palazzo-set', 'patiala-suit', 'churidar-suit', 'dupatta',
  'top', 'dress', 'coord-set', 'jumpsuit', 'jeans-trousers', 'skirt',
  'shorts', 'blazer-jacket', 'casual-wear', 'loungewear', 'night-suit',
  'track-suit', 'sweater-cardigan', 'winter-suit',
  'bridal-wear', 'party-wear', 'festive-wear', 'wedding-guest',
  'womens-clothing'
]);

function parseClothingSpecs(product: any, selectedColor?: any) {
  const title = (product.name || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();
  const material = (product.material || "").toLowerCase();

  // 1. FABRIC
  let fabric = "Premium Fabric Blend";
  if (title.includes("chiffon") || desc.includes("chiffon")) fabric = "Chiffon";
  else if (title.includes("silk") || desc.includes("silk")) fabric = "Silk";
  else if (title.includes("cotton") || desc.includes("cotton")) fabric = "Cotton";
  else if (title.includes("linen") || desc.includes("linen")) fabric = "Linen";
  else if (title.includes("georgette") || desc.includes("georgette")) fabric = "Georgette";
  else if (title.includes("velvet") || desc.includes("velvet")) fabric = "Velvet";
  else if (title.includes("rayon") || desc.includes("rayon")) fabric = "Rayon";
  else if (title.includes("satin") || desc.includes("satin")) fabric = "Satin";
  else if (material) fabric = product.material;

  // 2. STYLE
  let style = "Designer Wear";
  if (title.includes("printed") || desc.includes("print") || title.includes("floral") || desc.includes("floral")) style = "Printed";
  else if (title.includes("embroidered") || desc.includes("embroidery") || desc.includes("embroidered") || desc.includes("zari") || desc.includes("kundan")) style = "Embroidered";
  else if (title.includes("solid") || title.includes("plain")) style = "Solid";
  else if (title.includes("woven") || desc.includes("handwoven")) style = "Woven / Handloom";
  else if (title.includes("anarkali")) style = "Anarkali Silhouette";
  else if (title.includes("sharara")) style = "Sharara Flare";
  else if (title.includes("saree")) style = "Classic Drape";

  // 3. COLOUR
  let color = selectedColor?.label || "Multicolor";
  if (color === "Multicolor") {
    try {
      if (product.variants?.colors?.[0]?.label) {
        color = product.variants.colors[0].label;
      } else {
        const matches = ["pink", "orange", "blue", "red", "yellow", "green", "black", "white", "peach", "gold", "mint", "silver"];
        const found = matches.find(m => title.includes(m) || desc.includes(m));
        if (found) color = found.charAt(0).toUpperCase() + found.slice(1);
      }
    } catch (e) {}
  }

  // 4. OCCASION
  let occasion = "Festive / Celebration";
  if (title.includes("festive") || desc.includes("festival") || title.includes("saree") || title.includes("lehenga") || desc.includes("diwali") || desc.includes("eid")) occasion = "Festival / Wedding";
  else if (title.includes("casual") || title.includes("lounge") || desc.includes("daily") || desc.includes("loungewear") || desc.includes("sleep")) occasion = "Casual Wear";
  else if (title.includes("formal") || title.includes("office") || title.includes("trousers")) occasion = "Formal / Work Wear";

  // 5. WASH CARE
  let washCare = "Gentle Machine Wash";
  if (fabric === "Silk" || fabric === "Chiffon" || fabric === "Georgette" || style === "Embroidered" || title.includes("saree") || title.includes("lehenga")) {
    washCare = "Dry Clean Only";
  }

  return {
    style,
    fabric,
    color,
    occasion,
    washCare,
    origin: "India",
  };
}

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className="border-b border-brand-border py-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between font-sans text-sm font-semibold text-brand-ink hover:text-brand-rose transition-colors py-2 text-left"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-brand-slate transition-transform duration-300",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="text-sm text-brand-slate leading-relaxed pb-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PDPClient({ product, related }: { product: any, related: any[] }) {
  if (!product) notFound();

  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(
    product.variants.colors?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<SizeVariant | undefined>(
    product.variants.sizes?.[0]
  );

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    shipping: false,
    manufacturing: false,
    returns: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasActiveOffer = product.offer && product.offer.isActive && new Date(product.offer.endsAt) > new Date();
  const basePrice = hasActiveOffer ? product.offer.offerPrice : product.price;
  const originalPrice = hasActiveOffer ? product.price : product.compareAtPrice;
  const discount = hasActiveOffer 
    ? product.offer.discount
    : product.compareAtPrice
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  const effectivePrice = basePrice + (selectedColor?.priceModifier ?? 0);

  // Track recently viewed
  useEffect(() => {
    if (product?.id) {
      fetch('/api/recently-viewed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      }).catch(console.error);
    }
  }, [product?.id]);

  // Tab content
  const tabs = [
    {
      id: "description",
      label: "Description",
      content: (
        <div className="prose-premium">
          <p>{product.description}</p>
          {product.details.length > 0 && (
            <>
              <p className="font-semibold text-brand-ink mt-4 mb-2">Details</p>
              <ul>
                {product.details.map((d: string, i: number) => (
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
        <div className="prose-premium">
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
          {product.reviewCount > 0 ? (
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
          ) : (
            <div className="p-4 bg-brand-mist rounded-2xl text-center">
              <p className="text-sm font-medium text-brand-slate">No reviews yet. Be the first to review!</p>
            </div>
          )}

          {/* Review list */}
          {product.reviews?.map((review: any) => (
            <div key={review.id} className="border-b border-brand-border pb-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-rose flex items-center justify-center text-white text-xs font-bold shrink-0 uppercase">
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-brand-ink">
                      {review.customerName}
                    </p>
                    {review.isVerified && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-brand-rose">
                        <BadgeCheck className="w-4 h-4" fill="currentColor" stroke="white" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={review.rating} showCount={false} size="sm" />
                    <span className="text-2xs text-brand-slate">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-brand-slate pl-11">{review.comment}</p>
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
          {product.reviewCount > 0 && (
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="md"
            />
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-sans text-2xl font-bold text-brand-ink">
              {formatPrice(effectivePrice, product.currency)}
            </span>
            {originalPrice && (
              <span className="text-base text-brand-slate line-through">
                {formatPrice(originalPrice, product.currency)}
              </span>
            )}
            {discount && (
              <span className="text-sm font-semibold text-brand-rose">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Social Proof */}
          {product.boughtLastWeek > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                {product.boughtLastWeek} bought last week
              </span>
            </div>
          )}

          {/* Short description */}
          <p className="text-sm text-brand-slate leading-relaxed">
            {product.description?.substring(0, 140)}…
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

          {/* Delivery Check */}
          <PinCodeChecker />

          {/* Trust icons */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-brand-border">
            {[
              { icon: "🚚", label: "Free shipping over ₹999" },
              { icon: "🔒", label: "Secure checkout" },
            ].map((t) => (
              <span key={t.label} className="flex items-center gap-1.5 text-xs text-brand-slate">
                <span>{t.icon}</span> {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs / Accordions */}
      <div className="mb-16">
        {CLOTHING_SLUGS.has(product.category) ? (
          <div className="border-t border-brand-border">
            <AccordionItem
              title="Product Description"
              isOpen={openAccordions.description}
              onToggle={() => toggleAccordion("description")}
            >
              <p className="mb-4">{product.description}</p>
              {(() => {
                const specs = parseClothingSpecs(product, selectedColor);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8 pt-6 border-t border-brand-border mt-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-slate">Style</span>
                      <span className="block text-sm font-medium text-brand-ink mt-1">{specs.style}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-slate">Fabric</span>
                      <span className="block text-sm font-medium text-brand-ink mt-1">{specs.fabric}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-slate">Colour</span>
                      <span className="block text-sm font-medium text-brand-ink mt-1">{specs.color}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-slate">Occasion</span>
                      <span className="block text-sm font-medium text-brand-ink mt-1">{specs.occasion}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-slate">Wash Care</span>
                      <span className="block text-sm font-medium text-brand-ink mt-1">{specs.washCare}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-slate">Country of Origin</span>
                      <span className="block text-sm font-medium text-brand-ink mt-1">{specs.origin}</span>
                    </div>
                  </div>
                );
              })()}
            </AccordionItem>

            <AccordionItem
              title="Shipping Policy"
              isOpen={openAccordions.shipping}
              onToggle={() => toggleAccordion("shipping")}
            >
              <p>
                Free shipping on orders above ₹999. Since our clothing collection consists of premium, custom-tailored designs, orders are dispatched within 2-3 business days and delivered within 4-7 business days across India. Tracking link is sent via Email/WhatsApp as soon as shipped.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Manufacturing Details"
              isOpen={openAccordions.manufacturing}
              onToggle={() => toggleAccordion("manufacturing")}
            >
              <p>
                Proudly Designed & Tailored in India by Ranique Atelier. Fabric sourced from traditional Indian weavers. Marketed by: Ranique Official, New Delhi, India. Custom sizing requests can be shared via WhatsApp support.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Returns & Exchange"
              isOpen={openAccordions.returns}
              onToggle={() => toggleAccordion("returns")}
            >
              <p>
                We support exchanges and returns within 7 days of delivery for clothing. Items must be unworn, unwashed, and with all brand tags intact. Please note that custom-tailored or altered garments are not eligible for returns.
              </p>
            </AccordionItem>
          </div>
        ) : (
          <ProductTabs tabs={tabs} />
        )}
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
