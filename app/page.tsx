"use client";

import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Sparkles, Gem, Disc3, ShoppingBag, Truck, RefreshCcw, Lock } from "lucide-react";

// ─── Hero Section ─────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden bg-hero-gradient"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #C9748A 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
            New Summer Collection
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-ink leading-tight mb-5 animate-slide-up">
            Luxury Crafted
            <br />
            <em className="text-brand-rose not-italic">for You</em>
          </h1>

          <p className="font-sans text-base sm:text-lg text-brand-slate leading-relaxed mb-8 max-w-xl animate-slide-up">
            Discover our curated edit of cosmetics, accessories, bangles, and purses — where timeless elegance meets modern femininity.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 animate-slide-up">
            <Link
              href="/shop"
              id="hero-shop-now"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-[0.97] transition-all shadow-sm hover:shadow-md"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?category=cosmetics"
              id="hero-explore-cosmetics"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-brand-border bg-white text-brand-ink font-sans font-semibold text-sm hover:border-brand-rose hover:text-brand-rose active:scale-[0.97] transition-all"
            >
              Explore Cosmetics
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Category Grid ────────────────────────────────────────────────────────────

const CATEGORY_CARDS = [
  {
    id: "cosmetics",
    label: "Cosmetics",
    icon: <Sparkles className="w-8 h-8 text-brand-rose" strokeWidth={1.5} />,
    bg: "from-[#F7E8E8] to-[#EEC5CF]",
    description: "Lip serums, highlighters & fragrances",
  },
  {
    id: "accessories",
    label: "Accessories",
    icon: <Gem className="w-8 h-8 text-[#C9A96E]" strokeWidth={1.5} />,
    bg: "from-[#F0DDB8] to-[#E8D5A3]",
    description: "Earrings, headbands & sunglasses",
  },
  {
    id: "bangles",
    label: "Bangles",
    icon: <Disc3 className="w-8 h-8 text-[#8B9DB8]" strokeWidth={1.5} />,
    bg: "from-[#E8EEF7] to-[#C5D5EE]",
    description: "Gold-plated, crystal & enamel",
  },
  {
    id: "purses",
    label: "Purses",
    icon: <ShoppingBag className="w-8 h-8 text-brand-slate" strokeWidth={1.5} />,
    bg: "from-[#F0F0F0] to-[#E0E0D8]",
    description: "Velvet clutches, crossbodies & totes",
  },
];

function CategoryGrid() {
  return (
    <section aria-label="Shop by category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
          Shop by Category
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORY_CARDS.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.id}`}
            id={`category-card-${cat.id}`}
            className={cn(
              `bg-gradient-to-br ${cat.bg}`,
              "rounded-2xl p-5 sm:p-6 group hover:shadow-card-hover transition-all duration-300",
              "flex flex-col gap-2 min-h-[140px] sm:min-h-[160px]"
            )}
          >
            <div className="mb-2">{cat.icon}</div>
            <h3 className="font-serif text-base sm:text-lg font-semibold text-brand-ink group-hover:text-brand-rose transition-colors">
              {cat.label}
            </h3>
            <p className="text-xs sm:text-sm text-brand-slate line-clamp-2">{cat.description}</p>
            <span className="mt-auto text-xs font-semibold text-brand-rose flex items-center gap-1">
              Shop now
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── cn inline (avoid circular dep in RSC) ───────────────────────────────────

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Featured Products ────────────────────────────────────────────────────────

function FeaturedProducts() {
  // Pick 8 products — 2 from each category
  const featured = [
    ...MOCK_PRODUCTS.filter((p) => p.category === "cosmetics").slice(0, 2),
    ...MOCK_PRODUCTS.filter((p) => p.category === "accessories").slice(0, 2),
    ...MOCK_PRODUCTS.filter((p) => p.category === "bangles").slice(0, 2),
    ...MOCK_PRODUCTS.filter((p) => p.category === "purses").slice(0, 2),
  ];

  return (
    <section aria-label="Featured products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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

// ─── Trust Bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const items = [
    { icon: <Truck className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />, title: "Free Shipping", desc: "On orders over ₹3999" },
    { icon: <RefreshCcw className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />, title: "Easy Returns", desc: "30-day hassle-free returns" },
    { icon: <Lock className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />, title: "Secure Payment", desc: "256-bit SSL encryption" },
    { icon: <Gem className="w-6 h-6 text-brand-rose" strokeWidth={1.5} />, title: "Luxury Quality", desc: "Curated premium products" },
  ];
  return (
    <section aria-label="Trust signals" className="border-y border-brand-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProducts />
    </>
  );
}
