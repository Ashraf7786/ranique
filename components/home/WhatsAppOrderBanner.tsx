"use client";

import { useState } from "react";

const WA_NUMBER = "919288467633";
const WA_MESSAGE = encodeURIComponent(
  "Hii Ranique! 🌸 I'd love to place an order. Can you help me?"
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const STEPS = [
  {
    num: "01",
    emoji: "🛍️",
    title: "Browse & Choose",
    desc: "Pick any product you love from our collection",
  },
  {
    num: "02",
    emoji: "📲",
    title: "Send on WhatsApp",
    desc: "Share the product with us — we reply instantly",
  },
  {
    num: "03",
    emoji: "🎀",
    title: "Delivered to You",
    desc: "Confirm your order & receive at your doorstep",
  },
];

export function WhatsAppOrderBanner() {
  const [burstKey, setBurstKey] = useState(0);
  const [bursting, setBursting] = useState(false);

  const handleClick = () => {
    setBurstKey((k) => k + 1);
    setBursting(true);
    setTimeout(() => setBursting(false), 700);
    window.open(WA_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      aria-label="Order via WhatsApp"
      className="relative overflow-hidden py-16 bg-gradient-to-br from-brand-blush via-white to-brand-gold-light/40 border-y border-brand-border"
    >
      {/* Keyframe for burst rings — inline, lightweight */}
      <style>{`
        @keyframes wa-ring {
          0%   { transform: scale(0.4); opacity: 0.6; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        .wa-ring-1 { animation: wa-ring 0.65s cubic-bezier(0.2,0.6,0.4,1) forwards; }
        .wa-ring-2 { animation: wa-ring 0.65s 0.12s cubic-bezier(0.2,0.6,0.4,1) forwards; }
        .wa-ring-3 { animation: wa-ring 0.65s 0.24s cubic-bezier(0.2,0.6,0.4,1) forwards; }
      `}</style>

      {/* Decorative blobs — matches hero palette */}
      <div
        aria-hidden
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Eyebrow */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
            Easiest Way to Order
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-brand-ink leading-tight mb-3">
            Order Directly on{" "}
            <em className="not-italic text-brand-rose">WhatsApp</em>
          </h2>
          <p className="font-sans text-sm sm:text-base text-brand-slate max-w-lg mx-auto">
            Koi form nahi, koi wait nahi — directly humse baat karo aur apna order place karo! 🌸
          </p>
        </div>

        {/* Steps — numbered, connected with a line */}
        <div className="relative max-w-3xl mx-auto mb-12">

          {/* Connecting line (desktop only) */}
          <div
            aria-hidden
            className="hidden sm:block absolute top-[2.1rem] left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px border-t border-dashed border-brand-border z-0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group"
              >
                {/* Step circle */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-brand-border shadow-card group-hover:border-brand-rose group-hover:shadow-card-hover transition-all duration-300 flex items-center justify-center text-2xl">
                    {step.emoji}
                  </div>
                  {/* Step number badge */}
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-rose text-white text-[10px] font-bold font-sans flex items-center justify-center leading-none">
                    {i + 1}
                  </span>
                </div>

                <p className="font-serif text-sm font-semibold text-brand-ink mb-1">
                  {step.title}
                </p>
                <p className="font-sans text-xs text-brand-slate leading-relaxed max-w-[160px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          {/* Button — uses onClick for burst animation */}
          <button
            id="whatsapp-order-banner-btn"
            onClick={handleClick}
            aria-label="Chat and order on WhatsApp"
            className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-full font-sans font-bold text-sm text-white shadow-lg overflow-visible transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
          >
            {/* Burst rings — only rendered while bursting */}
            {bursting && (
              <span key={burstKey} aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="absolute w-full h-full rounded-full border-2 border-[#25D366]/60 wa-ring-1" />
                <span className="absolute w-full h-full rounded-full border border-[#25D366]/40 wa-ring-2" />
                <span className="absolute w-full h-full rounded-full border border-[#25D366]/20 wa-ring-3" />
              </span>
            )}

            {/* Button fill */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C4A]" />
            {/* Hover shimmer sweep */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

            {/* Label */}
            <span className="relative flex items-center gap-2.5">
              <WhatsAppIcon className="w-5 h-5" />
              <span>Chat &amp; Order Now</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>

          {/* Phone + live indicator */}
          <div className="flex items-center gap-2 text-brand-slate text-xs font-sans">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              Online now
            </span>
            <span className="text-brand-border">·</span>
            <span>+91 92884 67633</span>
          </div>
        </div>

      </div>
    </section>
  );
}
