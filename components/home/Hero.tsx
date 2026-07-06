"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const HERO_SLIDES = [
  {
    id: 1,
    eyebrow: "New Summer Collection",
    title: "Luxury Crafted",
    emphasis: "for You",
    description: "Discover our curated edit of cosmetics, accessories, bangles, and purses — where timeless elegance meets modern femininity.",
    primaryCta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "Explore Cosmetics", href: "/shop?category=cosmetics" },
    bgClass: "bg-hero-gradient",
    blob1: "radial-gradient(circle, #C9748A 0%, transparent 70%)",
    blob2: "radial-gradient(circle, #C9A96E 0%, transparent 70%)",
  },
  {
    id: 2,
    eyebrow: "Exclusive Designs",
    title: "Radiate Your",
    emphasis: "Inner Glow",
    description: "Explore our latest collection of premium lip serums and illuminating highlighters tailored for the perfect finish.",
    primaryCta: { label: "Shop Cosmetics", href: "/shop?category=cosmetics" },
    secondaryCta: { label: "View Best Sellers", href: "/shop" },
    bgClass: "bg-gradient-to-br from-[#F7E8E8] to-[#EEC5CF]",
    blob1: "radial-gradient(circle, #E8D5A3 0%, transparent 70%)",
    blob2: "radial-gradient(circle, #A85970 0%, transparent 70%)",
  },
  {
    id: 3,
    eyebrow: "Timeless Elegance",
    title: "Accessorize with",
    emphasis: "Confidence",
    description: "From gold-plated bangles to velvet clutches, find the perfect statement pieces to complete your look.",
    primaryCta: { label: "Shop Accessories", href: "/shop?category=accessories" },
    secondaryCta: { label: "Shop Bangles", href: "/shop?category=bangles" },
    bgClass: "bg-gradient-to-br from-[#F0DDB8] to-[#E8D5A3]",
    blob1: "radial-gradient(circle, #C9748A 0%, transparent 70%)",
    blob2: "radial-gradient(circle, #C9A96E 0%, transparent 70%)",
  }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      aria-label="Hero"
      className={`relative overflow-hidden transition-colors duration-700 ${slide.bgClass}`}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 transition-all duration-700"
        style={{ background: slide.blob1 }}
      />
      <div
        aria-hidden
        className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full opacity-10 transition-all duration-700"
        style={{ background: slide.blob2 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative min-h-[500px] flex items-center">
        <div key={currentSlide} className="max-w-2xl animate-fade-in">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-6 animate-slide-up">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
            {slide.eyebrow}
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-ink leading-tight mb-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {slide.title}
            <br />
            <em className="text-brand-rose not-italic">{slide.emphasis}</em>
          </h1>

          <p className="font-sans text-base sm:text-lg text-brand-slate leading-relaxed mb-8 max-w-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Link
              href={slide.primaryCta.href}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-[0.97] transition-all shadow-sm hover:shadow-md"
            >
              {slide.primaryCta.label}
            </Link>
            <Link
              href={slide.secondaryCta.href}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-brand-border bg-white text-brand-ink font-sans font-semibold text-sm hover:border-brand-rose hover:text-brand-rose active:scale-[0.97] transition-all"
            >
              {slide.secondaryCta.label}
            </Link>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-brand-rose" : "w-2 bg-brand-border hover:bg-brand-rose-light"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
