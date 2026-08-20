import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import type { HeroBannerSlide } from "@/components/home/Hero";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { Suspense } from "react";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { ReelsSection } from "@/components/shop/ReelsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhatsAppOrderBanner } from "@/components/home/WhatsAppOrderBanner";
import { CategoryTabs } from "@/components/home/CategoryTabs";
import { Truck, Lock, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── cn helper used below ────────────────────────────────────────────────────
// (CategoryGrid replaced by <CategoryTabs> client component)

// ─── Featured Products ────────────────────────────────────────────────────────

function FeaturedProducts({ products }: { products: any[] }) {
  // Pick 8 products — 2 from each category
  const featured = [
    ...products.filter((p) => p.category === "cosmetics").slice(0, 2),
    ...products.filter((p) => p.category === "accessories").slice(0, 2),
    ...products.filter((p) => p.category === "bangles").slice(0, 2),
    ...products.filter((p) => p.category === "purses").slice(0, 2),
  ];

  return (
    <section aria-label="Featured products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
          New Arrivals
        </h2>
        <Link
          href="/shop"
          className="text-sm text-brand-rose font-medium hover:underline underline-offset-2"
        >
          View all →
        </Link>
      </div>
      <ProductGrid products={featured} priorityCount={4} />
    </section>
  );
}

function CategoryProductsSection({ title, category, products }: { title: string, category: string, products: any[] }) {
  const categoryProducts = products.filter((p) => p.category === category).slice(0, 4);
  if (categoryProducts.length === 0) return null;

  return (
    <section aria-label={`${title} products`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
          {title}
        </h2>
        <Link
          href={`/shop?category=${category}`}
          className="text-sm text-brand-rose font-medium hover:underline underline-offset-2"
        >
          View all →
        </Link>
      </div>
      <ProductGrid products={categoryProducts} priorityCount={4} />
    </section>
  );
}

function OfferProductsSection({ products }: { products: any[] }) {
  const offerProducts = products.filter((p) => p.offer && p.offer.isActive && new Date(p.offer.endsAt) > new Date());
  if (offerProducts.length === 0) return null;

  return (
    <section aria-label="Special Offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8">
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
            Special Offers
          </h2>
          <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold animate-pulse">LIVE</span>
        </div>
        <Link
          href="/shop"
          className="text-sm text-brand-rose font-medium hover:underline underline-offset-2"
        >
          View all →
        </Link>
      </div>
      <ProductGrid products={offerProducts} priorityCount={4} />
    </section>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const items = [
    { icon: <Truck className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />, title: "Free Shipping", desc: "On orders over ₹999" },
    { icon: <Lock className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />, title: "Easy & Secure Payments", desc: "Multiple payment options" },
    { icon: <Gem className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />, title: "Premium Quality", desc: "Fashion, beauty & accessories" },
  ];
  return (
    <section aria-label="Trust signals" className="border-y border-brand-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-2">
              <div className="shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <p className="font-sans font-semibold text-sm text-brand-ink">{item.title}</p>
                <p className="font-sans text-xs text-brand-slate mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const revalidate = 60;

export default async function HomePage() {
  const [allProducts, categories, testimonials, heroBanners] = await Promise.all([
    getProducts(),
    getCategories(),
    prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 20
    }),
    prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <>
      <Hero slides={heroBanners as HeroBannerSlide[]} />
      <OfferProductsSection products={allProducts} />
      <TrustBar />
      <CategoryTabs categories={categories} />
      
      <FeaturedProducts products={allProducts} />
      
      <Suspense fallback={
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <SkeletonGrid count={4} />
        </section>
      }>
        <RecentlyViewedSection />
      </Suspense>

      <CategoryProductsSection title="Bangles Collection" category="bangles" products={allProducts} />
      
      <CategoryProductsSection title="Jewellery & Accessories" category="accessories" products={allProducts} />
      
      <CategoryProductsSection title="Purses & More" category="purses" products={allProducts} />



      <WhatsAppOrderBanner />
      <ReelsSection />
      <TestimonialsSection dynamicTestimonials={testimonials} />
    </>
  );
}
