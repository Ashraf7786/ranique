import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { Suspense } from "react";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { ReelsSection } from "@/components/shop/ReelsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhatsAppOrderBanner } from "@/components/home/WhatsAppOrderBanner";
import { Sparkles, Gem, Disc3, ShoppingBag, Truck, RefreshCcw, Lock, Package } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Category Grid ────────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, { icon: React.ReactNode, bg: string }> = {
  cosmetics: {
    icon: <Sparkles className="w-8 h-8 text-brand-rose" strokeWidth={1.5} />,
    bg: "from-[#F7E8E8] to-[#EEC5CF]",
  },
  accessories: {
    icon: <Gem className="w-8 h-8 text-[#C9A96E]" strokeWidth={1.5} />,
    bg: "from-[#F0DDB8] to-[#E8D5A3]",
  },
  bangles: {
    icon: <Disc3 className="w-8 h-8 text-[#8B9DB8]" strokeWidth={1.5} />,
    bg: "from-[#E8EEF7] to-[#C5D5EE]",
  },
  purses: {
    icon: <ShoppingBag className="w-8 h-8 text-brand-slate" strokeWidth={1.5} />,
    bg: "from-[#F0F0F0] to-[#E0E0D8]",
  },
};

const DEFAULT_CATEGORY_STYLE = {
  icon: <Package className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
  bg: "from-[#F0F0F0] to-[#E0E0D8]",
};

function CategoryGrid({ categories }: { categories: any[] }) {
  // Filter out any categories that might not be suitable for the grid, e.g. 'all'
  const validCategories = categories.filter(c => c.slug !== 'all');

  return (
    <section aria-label="Shop by category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
          Shop by Category
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {validCategories.map((cat) => {
          const style = CATEGORY_STYLES[cat.slug] || DEFAULT_CATEGORY_STYLE;
          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              id={`category-card-${cat.slug}`}
              className={cn(
                `bg-gradient-to-br ${style.bg}`,
                "rounded-2xl p-5 sm:p-6 group hover:shadow-card-hover transition-all duration-300",
                "flex flex-col gap-2 min-h-[140px] sm:min-h-[160px]"
              )}
            >
              <div className="mb-2">{style.icon}</div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-brand-ink group-hover:text-brand-rose transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs sm:text-sm text-brand-slate line-clamp-2">{cat.description || "Discover our collection"}</p>
              <span className="mt-auto text-xs font-semibold text-brand-rose flex items-center gap-1">
                Shop now
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── cn inline (avoid circular dep in RSC) ───────────────────────────────────
// Removed inline cn function in favor of import

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
    { icon: <Lock className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />, title: "Secure Payment", desc: "256-bit SSL encryption" },
    { icon: <Gem className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />, title: "Luxury Quality", desc: "Curated premium products" },
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
  const [allProducts, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <>
      <Hero />
      <OfferProductsSection products={allProducts} />
      <TrustBar />
      <CategoryGrid categories={categories} />
      
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
      <TestimonialsSection />
    </>
  );
}
