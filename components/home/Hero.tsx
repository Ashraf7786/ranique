"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft, ChevronRight, Zap, Sparkles, Tag, Clock,
  Flame, Star, Gift, ShoppingBag, PartyPopper, Sun,
} from "lucide-react";

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

// ─── Festive SVG icon sets (no emojis) ───────────────────────────────────────

const FESTIVE_CONFIG: Record<string, { gradient: string; color: string }> = {
  DIWALI:        { gradient: "from-orange-900/10 via-transparent to-yellow-900/10", color: "from-orange-400 to-yellow-400" },
  EID:           { gradient: "from-emerald-900/10 via-transparent to-teal-900/10",  color: "from-emerald-400 to-teal-400" },
  HOLI:          { gradient: "from-pink-900/10 via-transparent to-purple-900/10",   color: "from-pink-400 to-purple-400" },
  CHRISTMAS:     { gradient: "from-red-900/10 via-transparent to-green-900/10",     color: "from-red-400 to-green-400" },
  NAVRATRI:      { gradient: "from-red-900/10 via-transparent to-orange-900/10",    color: "from-red-400 to-orange-400" },
  RAKSHA_BANDHAN:{ gradient: "from-rose-900/10 via-transparent to-pink-900/10",     color: "from-rose-400 to-pink-400" },
  DURGA_PUJA:    { gradient: "from-orange-900/10 via-transparent to-red-900/10",    color: "from-orange-400 to-red-400" },
};

// ─── Countdown Hook ───────────────────────────────────────────────────────────

function useCountdown(targetDate: string | Date | null | undefined) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return { timeLeft, expired };
}

// ─── Fallback slides ──────────────────────────────────────────────────────────

const FALLBACK_SLIDES: HeroBannerSlide[] = [
  {
    id: "fallback-1",
    type: "REGULAR",
    eyebrow: "New Collection 2025",
    title: "Premium Crafted",
    emphasis: "For You",
    description: "Discover our curated edit of bangles, cosmetics, and purses — timeless elegance for the modern woman.",
    primaryLabel: "Shop Now",
    primaryHref: "/shop",
    secondaryLabel: "Explore Bangles",
    secondaryHref: "/shop?category=bangles",
    bgColor: "#FDF8F8",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop",
    isSale: false,
  },
];

// ─── Ticker items (SVG only, no emojis) ──────────────────────────────────────

const TICKER_ITEMS = [
  { icon: ShoppingBag, text: "Free Shipping on Orders" },
  { icon: Star,        text: "Premium Quality" },
  { icon: Gift,        text: "COD Available Pan-India" },
  { icon: Sparkles,    text: "New Arrivals Every Week" },
  { icon: Tag,         text: "Exclusive Member Discounts" },
];

// ─── Progress Bar Auto-slide ─────────────────────────────────────────────────

const AUTOPLAY_MS = 5500;

// ─── Hero Component ───────────────────────────────────────────────────────────

export function Hero({ slides }: { slides: HeroBannerSlide[] }) {
  const displaySlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
  const total = displaySlides.length;

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sliding, setSliding] = useState<"in" | "out" | null>(null);
  const [dir, setDir] = useState<1 | -1>(1); // 1 = right, -1 = left

  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  // ── Navigate with animation ──
  const goTo = useCallback((nextIdx: number, direction: 1 | -1 = 1) => {
    if (sliding) return;
    setDir(direction);
    setSliding("out");
    setProgress(0);
    setTimeout(() => {
      setCurrent(nextIdx);
      setSliding("in");
      setTimeout(() => setSliding(null), 320);
    }, 280);
  }, [sliding]);

  const next = useCallback(() => goTo((current + 1) % total, 1), [current, total, goTo]);
  const prev = useCallback(() => goTo((current - 1 + total) % total, -1), [current, total, goTo]);

  // ── Auto-slide with progress bar ──
  useEffect(() => {
    if (paused || total <= 1) {
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }
    setProgress(0);
    const step = 100 / (AUTOPLAY_MS / 50);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p + step >= 100) {
          // trigger next slide
          goTo((current + 1) % total, 1);
          return 0;
        }
        return p + step;
      });
    }, 50);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, paused, total]);

  // ── Keyboard ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  // ── Touch swipe — only horizontal, don't block vertical scroll ──
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy && dx > 10) isSwiping.current = true;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
    isSwiping.current = false;
  };

  const slide = displaySlides[current];
  const festive = slide.festiveTheme ? FESTIVE_CONFIG[slide.festiveTheme] : null;
  const isFlash = slide.type === "FLASH_SALE";
  const isFestive = slide.type === "FESTIVE_SALE";

  // Slide transition classes
  const textClass = sliding === "out"
    ? `opacity-0 ${dir === 1 ? "-translate-x-6" : "translate-x-6"}`
    : sliding === "in"
    ? `opacity-0 ${dir === 1 ? "translate-x-6" : "-translate-x-6"}`
    : "opacity-100 translate-x-0";

  const imgClass = sliding === "out"
    ? `opacity-0 ${dir === 1 ? "translate-x-6" : "-translate-x-6"}`
    : sliding === "in"
    ? `opacity-0 ${dir === 1 ? "-translate-x-6" : "translate-x-6"}`
    : "opacity-100 translate-x-0";

  return (
    <section
      aria-label="Hero Slider"
      className="relative overflow-hidden transition-colors duration-500 select-none"
      style={{ backgroundColor: slide.bgColor }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Festive gradient overlay */}
      {isFestive && festive && (
        <div className={`absolute inset-0 bg-gradient-to-br ${festive.gradient} pointer-events-none z-0`} />
      )}

      {/* ── Flash Sale ticker bar ── */}
      {isFlash && (
        <div className="relative z-10 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-1.5 overflow-hidden">
          <div className="marquee-wrapper">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center">
                  {["Flash Sale Live Now", "Limited Time Offer", "Huge Discounts", "Shop Before It Ends", "Don't Miss Out"].map((t, i) => (
                    <span key={i} className="flex items-center gap-2 px-6 text-xs font-bold tracking-widest uppercase whitespace-nowrap">
                      <Zap className="w-3 h-3 shrink-0" />
                      {t}
                      <span className="w-px h-3 bg-white/30" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white text-red-700 text-[10px] font-black rounded-sm tracking-widest uppercase badge-blink">
            LIVE
          </span>
        </div>
      )}

      {/* ── Festive Sale top bar ── */}
      {isFestive && slide.festiveTheme && (
        <div className={`relative z-10 bg-gradient-to-r ${festive?.color ?? "from-orange-500 to-yellow-500"} text-white overflow-hidden`}>
          <div className="marquee-wrapper py-1.5">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center">
                  {[`${slide.festiveTheme?.replace("_", " ")} Special Sale`, "Celebrate the Festival", "Exclusive Festival Offers", "Limited Stock"].map((t, i) => (
                    <span key={i} className="flex items-center gap-2 px-6 text-xs font-bold tracking-widest uppercase whitespace-nowrap">
                      <PartyPopper className="w-3 h-3 shrink-0" />
                      {t}
                      <span className="w-px h-3 bg-white/30" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile: stacked layout — image on top, text below */}
        {/* Desktop: side-by-side grid */}
        <div className="flex flex-col md:grid md:grid-cols-12 md:gap-10 lg:gap-16 md:items-center md:min-h-[580px] py-6 md:py-12 lg:py-16 gap-5">

          {/* ── Image (top on mobile, right on desktop) ── */}
          <div
            className={`md:col-span-6 lg:col-span-7 md:order-2 relative z-10 transition-all duration-300 ease-out ${imgClass}`}
          >
            {/* Image container — fixed height on mobile, aspect-ratio on desktop */}
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-auto md:aspect-[4/3] lg:aspect-[5/4] rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-xl md:shadow-2xl">
              <Image
                src={slide.image}
                alt={`${slide.title} ${slide.emphasis}`}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 55vw, 50vw"
                className="object-cover object-center"
              />
              {/* Soft gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

              {/* Flash Sale % ribbon */}
              {isFlash && slide.discountPercent && (
                <div className="absolute top-3 left-3 bg-red-600 text-white rounded-xl px-3 py-1.5 shadow-lg badge-glow">
                  <p className="text-xl font-black leading-none">{slide.discountPercent}%</p>
                  <p className="text-[10px] font-bold tracking-widest">OFF</p>
                </div>
              )}

              {/* Festive theme label */}
              {isFestive && slide.festiveTheme && festive && (
                <div className={`absolute top-3 left-3 bg-gradient-to-br ${festive.color} text-white rounded-xl px-3 py-1.5 shadow-lg text-center`}>
                  <Sun className="w-4 h-4 mx-auto mb-0.5" />
                  <p className="text-[10px] font-bold leading-none">{slide.festiveTheme.split("_")[0]}</p>
                </div>
              )}
            </div>
            {/* Glow blob behind image (desktop only) */}
            <div className="absolute -inset-6 -z-10 bg-brand-rose/10 blur-3xl rounded-full opacity-40 hidden md:block" />
          </div>

          {/* ── Text (bottom on mobile, left on desktop) ── */}
          <div
            className={`md:col-span-6 lg:col-span-5 md:order-1 z-10 transition-all duration-300 ease-out ${textClass}`}
          >
            {/* Eyebrow row */}
            <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-sm border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse shrink-0" />
                {slide.eyebrow}
              </div>
              {slide.discountPercent && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-600 text-white text-xs font-bold shadow badge-blink">
                  <Tag className="w-3 h-3 shrink-0" />
                  {slide.discountPercent}% OFF
                </div>
              )}
              {slide.saleBadge && (
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-bold shadow ${isFlash ? "bg-red-600 badge-blink badge-glow" : "bg-orange-500 badge-glow"}`}>
                  {isFlash ? <Zap className="w-3 h-3 shrink-0" /> : <Flame className="w-3 h-3 shrink-0" />}
                  {slide.saleBadge}
                </div>
              )}
            </div>

            {/* Festive decorative SVG icons row */}
            {isFestive && (
              <div className="flex items-center gap-3 mb-3" aria-hidden>
                {[Star, Sparkles, Sun, Gift].map((Icon, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${festive?.color ?? "from-orange-400 to-yellow-400"} flex items-center justify-center shadow-sm`} style={{ animationDelay: `${i * 120}ms` }}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                ))}
              </div>
            )}

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-brand-ink leading-tight mb-3 md:mb-4">
              {slide.title}
              <br />
              <em className="text-brand-rose not-italic">{slide.emphasis}</em>
            </h1>

            <p className="font-sans text-sm sm:text-base text-brand-slate leading-relaxed mb-5 md:mb-6 line-clamp-3 md:line-clamp-none">
              {slide.description}
            </p>

            {/* Countdown Timer */}
            {(isFlash || isFestive) && slide.saleEndDate && (
              <div className="mb-5 md:mb-6">
                <SaleCountdown
                  endDate={slide.saleEndDate}
                  label={slide.saleLabel || "Sale Ends In:"}
                  isFlash={isFlash}
                />
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-2.5">
              <Link
                href={slide.primaryHref}
                className={`inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-6 sm:px-8 rounded-full text-white font-sans font-semibold text-sm transition-all shadow-md active:scale-95 ${isFlash ? "bg-red-600 hover:bg-red-700" : isFestive ? "bg-orange-500 hover:bg-orange-600" : "bg-brand-rose hover:bg-brand-rose-dark"}`}
              >
                {isFlash && <Zap className="w-4 h-4" />}
                {isFestive && <Sparkles className="w-4 h-4" />}
                {slide.primaryLabel}
              </Link>
              {slide.secondaryLabel && slide.secondaryHref && (
                <Link
                  href={slide.secondaryHref}
                  className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 rounded-full border border-brand-border bg-white text-brand-ink font-sans font-semibold text-sm hover:border-brand-rose hover:text-brand-rose transition-all shadow-sm active:scale-95"
                >
                  {slide.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Prev / Next Arrows (only when >1 slide) ── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 backdrop-blur-sm border border-brand-border/40 shadow-md flex items-center justify-center text-brand-ink active:scale-90 transition-all"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 backdrop-blur-sm border border-brand-border/40 shadow-md flex items-center justify-center text-brand-ink active:scale-90 transition-all"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* ── Progress dots + bar ── */}
      {total > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {displaySlides.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative overflow-hidden rounded-full transition-all duration-300"
              style={{ width: i === current ? 28 : 8, height: 8 }}
            >
              <span className={`absolute inset-0 rounded-full ${s.type === "FLASH_SALE" ? "bg-red-200" : s.type === "FESTIVE_SALE" ? "bg-orange-200" : "bg-brand-border/50"}`} />
              {i === current && (
                <span
                  className={`absolute inset-y-0 left-0 rounded-full transition-none ${s.type === "FLASH_SALE" ? "bg-red-600" : s.type === "FESTIVE_SALE" ? "bg-orange-500" : "bg-brand-rose"}`}
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function SaleCountdown({ endDate, label, isFlash }: { endDate: string | Date; label: string; isFlash: boolean }) {
  const { timeLeft, expired } = useCountdown(endDate);

  if (expired) return (
    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-100 text-gray-500 text-sm font-semibold">
      <Clock className="w-4 h-4" />
      Sale Ended
    </div>
  );

  const color = isFlash ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200";
  const labelColor = isFlash ? "text-red-600" : "text-orange-600";
  const numColor = isFlash ? "text-red-700" : "text-orange-700";

  return (
    <div className={`inline-flex flex-col gap-2 px-4 py-3 rounded-2xl border ${color} shadow-sm`}>
      <div className={`flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase ${labelColor}`}>
        {isFlash ? <Zap className="w-3.5 h-3.5 badge-blink" /> : <Clock className="w-3.5 h-3.5" />}
        {label}
      </div>
      <div className="flex items-end gap-2">
        {[{ v: timeLeft.days, l: "Days" }, { v: timeLeft.hours, l: "Hrs" }, { v: timeLeft.minutes, l: "Mins" }, { v: timeLeft.seconds, l: "Secs" }].map(({ v, l }, i) => (
          <div key={l} className="flex items-end gap-2">
            <div className="flex flex-col items-center min-w-[2.5rem]">
              <span className={`text-2xl font-bold tabular-nums ${numColor}`}>
                {String(v).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-sans font-medium text-brand-slate uppercase tracking-wider">{l}</span>
            </div>
            {i < 3 && <span className={`text-lg font-bold mb-4 ${numColor} opacity-40`}>:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
