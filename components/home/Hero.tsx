"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

// Countdown hook
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

const HERO_SLIDES = [
  {
    id: 1,
    eyebrow: "New Summer Collection",
    title: "Premium Crafted",
    emphasis: "for You",
    description: "Discover our curated edit of Indian cosmetics, accessories, and purses — where timeless elegance meets modern femininity.",
    primaryCta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "Explore Cosmetics", href: "/shop?category=cosmetics" },
    bgClass: "bg-[#FAFAFA]",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop",
    isSale: false,
  },
  {
    id: 2,
    eyebrow: "Upcoming Festival Sale",
    title: "Radiate Your",
    emphasis: "Inner Glow",
    description: "Get ready for our biggest sale of the season. Premium lip serums, glowing highlights, and exclusive bridal collections at unbeatable prices.",
    primaryCta: { label: "View Offers", href: "/shop" },
    secondaryCta: { label: "Shop Best Sellers", href: "/shop" },
    bgClass: "bg-[#FFF8F9]",
    image: "/images/banner-accessories.png",
    isSale: true,
    saleLabel: "Monsoon Mega Sale Starts In:",
    saleEndDate: "2026-07-10T00:00:00Z",
  },
  {
    id: 3,
    eyebrow: "Timeless Elegance",
    title: "Accessorize with",
    emphasis: "Confidence",
    description: "From traditional gold-plated bangles to modern velvet clutches, find the perfect statement pieces to complete your Indian look.",
    primaryCta: { label: "Shop Accessories", href: "/shop?category=accessories" },
    secondaryCta: { label: "Shop Bangles", href: "/shop?category=bangles" },
    bgClass: "bg-[#FDFBF7]",
    image: "/images/banner-accessories.png",
    isSale: false,
  }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section aria-label="Hero" className={`relative transition-colors duration-700 ${slide.bgClass} overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[600px] md:min-h-[650px] flex items-center pt-8 pb-20 md:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center w-full">
          
          {/* Text Content */}
          <div key={`text-${currentSlide}`} className="md:col-span-6 lg:col-span-5 order-2 md:order-1 animate-fade-in z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-6 animate-slide-up">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
              {slide.eyebrow}
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-ink leading-tight mb-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
              {slide.title}
              <br />
              <em className="text-brand-rose not-italic">{slide.emphasis}</em>
            </h1>

            <p className="font-sans text-base sm:text-lg text-brand-slate leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              {slide.description}
            </p>

            {/* Countdown Timer (if sale) */}
            {slide.isSale && slide.saleEndDate && (
              <div className="mb-8 animate-slide-up" style={{ animationDelay: '250ms' }}>
                <SaleCountdown endDate={slide.saleEndDate} label={slide.saleLabel!} />
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link
                href={slide.primaryCta.href}
                className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-[0.97] transition-all shadow-md hover:shadow-lg"
              >
                {slide.primaryCta.label}
              </Link>
              <Link
                href={slide.secondaryCta.href}
                className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-brand-border bg-white text-brand-ink font-sans font-semibold text-sm hover:border-brand-rose hover:text-brand-rose active:scale-[0.97] transition-all shadow-sm"
              >
                {slide.secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div key={`img-${currentSlide}`} className="md:col-span-6 lg:col-span-7 order-1 md:order-2 animate-fade-in relative">
            <div className="relative w-full aspect-[4/3] md:aspect-[4/5] lg:aspect-square max-h-[500px] md:max-h-[600px] rounded-[2rem] overflow-hidden shadow-2xl">
              <Image 
                src={slide.image} 
                alt={slide.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[10s] hover:scale-105"
              />
              
              {/* Glass overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
            
            {/* Decorative background blur behind image */}
            <div className="absolute -inset-4 -z-10 bg-brand-rose/10 blur-3xl rounded-full opacity-50" />
          </div>

        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-brand-rose shadow-md" : "w-2 bg-brand-border/50 hover:bg-brand-rose-light"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Subcomponent for the countdown to avoid re-rendering the whole Hero
function SaleCountdown({ endDate, label }: { endDate: string, label: string }) {
  const timeLeft = useCountdown(endDate);

  return (
    <div className="inline-flex flex-col gap-2 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center gap-1.5 text-brand-rose font-semibold text-xs tracking-wider uppercase">
        <Clock className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="flex items-center gap-3 font-serif">
        <TimeBlock value={timeLeft.days} label="Days" />
        <span className="text-xl font-bold text-brand-slate/30 mt-[-10px]">:</span>
        <TimeBlock value={timeLeft.hours} label="Hrs" />
        <span className="text-xl font-bold text-brand-slate/30 mt-[-10px]">:</span>
        <TimeBlock value={timeLeft.minutes} label="Mins" />
        <span className="text-xl font-bold text-brand-slate/30 mt-[-10px]">:</span>
        <TimeBlock value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[3rem]">
      <span className="text-2xl font-bold text-brand-ink">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] font-sans font-medium text-brand-slate uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
