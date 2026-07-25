"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronLeft, ChevronRight, Zap, Sparkles, Tag } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroBannerSlide {
  id: string;
  type: "REGULAR" | "FLASH_SALE" | "FESTIVE_SALE";
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
  image: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
  bgColor: string;
  bgGradient?: string | null;
  isSale: boolean;
  saleLabel?: string | null;
  saleEndDate?: string | Date | null;
  discountPercent?: number | null;
  saleBadge?: string | null;
  festiveTheme?: string | null;
}

// Festive theme decorative overlays
const FESTIVE_OVERLAYS: Record<string, { emoji: string[]; gradient: string }> = {
  DIWALI: { emoji: ["🪔", "✨", "🎆", "🌟"], gradient: "from-orange-900/10 via-transparent to-yellow-900/10" },
  EID: { emoji: ["🌙", "⭐", "🌟", "✨"], gradient: "from-emerald-900/10 via-transparent to-teal-900/10" },
  HOLI: { emoji: ["🎨", "🌈", "🎉", "✨"], gradient: "from-pink-900/10 via-transparent to-purple-900/10" },
  CHRISTMAS: { emoji: ["🎄", "⭐", "❄️", "🎁"], gradient: "from-red-900/10 via-transparent to-green-900/10" },
  NAVRATRI: { emoji: ["🪷", "🎊", "✨", "🌸"], gradient: "from-red-900/10 via-transparent to-orange-900/10" },
  RAKSHA_BANDHAN: { emoji: ["🪡", "💐", "🌸", "✨"], gradient: "from-rose-900/10 via-transparent to-pink-900/10" },
  DURGA_PUJA: { emoji: ["🌺", "🪷", "🎊", "✨"], gradient: "from-orange-900/10 via-transparent to-red-900/10" },
};

// ─── Countdown Hook ───────────────────────────────────────────────────────────

function useCountdown(targetDate: string | Date | null | undefined) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeLeft, expired };
}

// ─── Default Fallback Slides (shown when no DB banners) ──────────────────────

const FALLBACK_SLIDES: HeroBannerSlide[] = [
  {
    id: "fallback-1",
    type: "REGULAR",
    eyebrow: "New Collection 2025",
    title: "Premium Crafted",
    emphasis: "For You",
    description: "Discover our curated edit of bangles, cosmetics, and purses — where timeless elegance meets modern femininity.",
    primaryLabel: "Shop Now",
    primaryHref: "/shop",
    secondaryLabel: "Explore Bangles",
    secondaryHref: "/shop?category=bangles",
    bgColor: "#FAFAFA",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop",
    isSale: false,
  },
];

// ─── Hero Component ───────────────────────────────────────────────────────────

interface HeroProps {
  slides: HeroBannerSlide[];
}

export function Hero({ slides }: HeroProps) {
  const displaySlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number, dir: "left" | "right" = "right") => {
    if (animating || index === current) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 350);
  }, [animating, current]);

  const next = useCallback(() => goTo((current + 1) % displaySlides.length, "right"), [current, displaySlides.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + displaySlides.length) % displaySlides.length, "left"), [current, displaySlides.length, goTo]);

  // Auto-play
  useEffect(() => {
    if (paused || displaySlides.length <= 1) return;
    timerRef.current = setTimeout(next, 6000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, paused, next, displaySlides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  // Touch swipe
  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  const slide = displaySlides[current];

  return (
    <section
      aria-label="Hero Slider"
      className="relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: slide.bgColor }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Festive Background Overlay */}
      {slide.type === "FESTIVE_SALE" && slide.festiveTheme && FESTIVE_OVERLAYS[slide.festiveTheme] && (
        <div className={`absolute inset-0 bg-gradient-to-br ${FESTIVE_OVERLAYS[slide.festiveTheme].gradient} pointer-events-none z-0`} />
      )}

      {/* Flash Sale Pulsing top bar */}
      {slide.type === "FLASH_SALE" && (
        <div className="relative z-10 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white text-center py-2 text-xs font-bold tracking-widest uppercase animate-pulse">
          ⚡ Flash Sale Live Now — Limited Time Offer! ⚡
        </div>
      )}

      {/* Festive top bar */}
      {slide.type === "FESTIVE_SALE" && slide.festiveTheme && (
        <div className="relative z-10 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-white text-center py-2 text-xs font-bold tracking-widest uppercase">
          🎉 {slide.festiveTheme.replace("_", " ")} Special Sale — Celebrate the Festival! 🎉
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[580px] md:min-h-[640px] flex items-center pt-8 pb-20 md:py-16 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center w-full">

          {/* ── Text Content ── */}
          <div
            key={`text-${current}`}
            className={`md:col-span-6 lg:col-span-5 order-2 md:order-1 z-10 transition-all duration-350 ${animating ? (direction === "right" ? "opacity-0 -translate-x-4" : "opacity-0 translate-x-4") : "opacity-100 translate-x-0"}`}
          >
            {/* Eyebrow + Sale Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
                {slide.eyebrow}
              </div>
              {slide.discountPercent && (
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-600 text-white text-xs font-bold shadow">
                  <Tag className="w-3 h-3" /> {slide.discountPercent}% OFF
                </div>
              )}
              {slide.saleBadge && (
                <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow ${slide.type === "FLASH_SALE" ? "bg-red-600 animate-pulse" : "bg-orange-500"}`}>
                  {slide.type === "FLASH_SALE" ? <Zap className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                  {slide.saleBadge}
                </div>
              )}
            </div>

            {/* Festive Emojis (decorative) */}
            {slide.type === "FESTIVE_SALE" && slide.festiveTheme && FESTIVE_OVERLAYS[slide.festiveTheme] && (
              <div className="flex gap-2 text-2xl mb-3" aria-hidden>
                {FESTIVE_OVERLAYS[slide.festiveTheme].emoji.map((e, i) => (
                  <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>{e}</span>
                ))}
              </div>
            )}

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-ink leading-tight mb-5">
              {slide.title}
              <br />
              <em className="text-brand-rose not-italic">{slide.emphasis}</em>
            </h1>

            <p className="font-sans text-base sm:text-lg text-brand-slate leading-relaxed mb-7">
              {slide.description}
            </p>

            {/* Countdown Timer */}
            {(slide.type === "FLASH_SALE" || slide.type === "FESTIVE_SALE") && slide.saleEndDate && (
              <div className="mb-7">
                <SaleCountdown
                  endDate={slide.saleEndDate}
                  label={slide.saleLabel || "Sale Ends In:"}
                  isFlash={slide.type === "FLASH_SALE"}
                />
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={slide.primaryHref}
                className={`inline-flex items-center justify-center h-12 px-8 rounded-full text-white font-sans font-semibold text-sm active:scale-[0.97] transition-all shadow-md hover:shadow-lg ${slide.type === "FLASH_SALE" ? "bg-red-600 hover:bg-red-700" : slide.type === "FESTIVE_SALE" ? "bg-orange-500 hover:bg-orange-600" : "bg-brand-rose hover:bg-brand-rose-dark"}`}
              >
                {slide.type === "FLASH_SALE" && <Zap className="w-4 h-4 mr-2" />}
                {slide.type === "FESTIVE_SALE" && <Sparkles className="w-4 h-4 mr-2" />}
                {slide.primaryLabel}
              </Link>
              {slide.secondaryLabel && slide.secondaryHref && (
                <Link
                  href={slide.secondaryHref}
                  className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-brand-border bg-white text-brand-ink font-sans font-semibold text-sm hover:border-brand-rose hover:text-brand-rose active:scale-[0.97] transition-all shadow-sm"
                >
                  {slide.secondaryLabel}
                </Link>
              )}
            </div>
          </div>

          {/* ── Image ── */}
          <div
            key={`img-${current}`}
            className={`md:col-span-6 lg:col-span-7 order-1 md:order-2 relative transition-all duration-350 ${animating ? (direction === "right" ? "opacity-0 translate-x-4" : "opacity-0 -translate-x-4") : "opacity-100 translate-x-0"}`}
          >
            <div className="relative w-full aspect-[4/3] md:aspect-[4/5] lg:aspect-square max-h-[500px] md:max-h-[600px] rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src={slide.image}
                alt={`${slide.title} ${slide.emphasis}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover transition-transform duration-[8s] hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

              {/* Flash Sale corner ribbon */}
              {slide.type === "FLASH_SALE" && slide.discountPercent && (
                <div className="absolute top-4 left-4 bg-red-600 text-white rounded-2xl px-4 py-2 shadow-lg">
                  <p className="text-2xl font-black leading-none">{slide.discountPercent}%</p>
                  <p className="text-xs font-bold tracking-wider">OFF</p>
                </div>
              )}

              {/* Festive corner badge */}
              {slide.type === "FESTIVE_SALE" && slide.festiveTheme && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white rounded-2xl px-3 py-2 shadow-lg text-center">
                  <p className="text-xl">🎉</p>
                  <p className="text-xs font-bold">{slide.festiveTheme.split("_")[0]}</p>
                </div>
              )}
            </div>
            <div className="absolute -inset-4 -z-10 bg-brand-rose/10 blur-3xl rounded-full opacity-50" />
          </div>
        </div>

        {/* ── Prev / Next Arrows ── */}
        {displaySlides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm border border-brand-border/50 shadow-lg flex items-center justify-center text-brand-ink hover:bg-white hover:scale-110 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm border border-brand-border/50 shadow-lg flex items-center justify-center text-brand-ink hover:bg-white hover:scale-110 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* ── Dot Indicators ── */}
        {displaySlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {displaySlides.map((s, index) => (
              <button
                key={index}
                onClick={() => goTo(index, index > current ? "right" : "left")}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? s.type === "FLASH_SALE"
                      ? "w-8 bg-red-600 shadow-md"
                      : s.type === "FESTIVE_SALE"
                      ? "w-8 bg-orange-500 shadow-md"
                      : "w-8 bg-brand-rose shadow-md"
                    : "w-2 bg-brand-border/50 hover:bg-brand-rose-light"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function SaleCountdown({ endDate, label, isFlash }: { endDate: string | Date; label: string; isFlash: boolean }) {
  const { timeLeft, expired } = useCountdown(endDate);

  if (expired) return (
    <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-100 text-gray-500 text-sm font-semibold">
      Sale Ended
    </div>
  );

  return (
    <div className={`inline-flex flex-col gap-2 p-4 rounded-2xl border shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${isFlash ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}>
      <div className={`flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase ${isFlash ? "text-red-600" : "text-orange-600"}`}>
        {isFlash ? <Zap className="w-3.5 h-3.5 animate-pulse" /> : <Clock className="w-3.5 h-3.5" />}
        {label}
      </div>
      <div className="flex items-center gap-3 font-serif">
        <TimeBlock value={timeLeft.days} label="Days" isFlash={isFlash} />
        <Colon />
        <TimeBlock value={timeLeft.hours} label="Hrs" isFlash={isFlash} />
        <Colon />
        <TimeBlock value={timeLeft.minutes} label="Mins" isFlash={isFlash} />
        <Colon />
        <TimeBlock value={timeLeft.seconds} label="Secs" isFlash={isFlash} />
      </div>
    </div>
  );
}

function Colon() {
  return <span className="text-xl font-bold text-brand-slate/30 mt-[-10px]">:</span>;
}

function TimeBlock({ value, label, isFlash }: { value: number; label: string; isFlash: boolean }) {
  return (
    <div className="flex flex-col items-center min-w-[3rem]">
      <span className={`text-2xl font-bold tabular-nums ${isFlash ? "text-red-700" : "text-orange-700"}`}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-sans font-medium text-brand-slate uppercase tracking-wider">{label}</span>
    </div>
  );
}
