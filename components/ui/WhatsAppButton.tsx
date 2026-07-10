"use client";

import { useState, useEffect } from "react";

const WA_NUMBER = "919288467633";
const WA_MESSAGE = encodeURIComponent(
  "Hii Ranique! 🌸 I'd love to place an order. Can you help me?"
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

// WhatsApp SVG icon
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBounced, setHasBounced] = useState(false);

  // Show button after 1.5s for a nice entrance
  useEffect(() => {
    const t1 = setTimeout(() => setIsVisible(true), 1500);
    // Bounce attention after 4s
    const t2 = setTimeout(() => setHasBounced(true), 4000);
    const t3 = setTimeout(() => setHasBounced(false), 4700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className={`hidden md:flex fixed bottom-6 right-5 z-50 flex-col items-end gap-2 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      {/* Tooltip bubble */}
      <div
        className={`relative bg-white rounded-2xl px-4 py-3 shadow-popover border border-brand-border max-w-[200px] transition-all duration-300 ${
          showTooltip ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }`}
        role="tooltip"
      >
        {/* Tail */}
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-brand-border rotate-45" />
        <p className="font-sans text-xs font-semibold text-brand-ink leading-snug">
          Order on WhatsApp 🛍️
        </p>
        <p className="font-sans text-xs text-brand-slate mt-0.5">
          Reply within minutes!
        </p>
      </div>

      {/* Main button */}
      <button
        id="whatsapp-order-btn"
        aria-label="Order on WhatsApp"
        onClick={() => window.open(WA_URL, "_blank", "noopener,noreferrer")}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={`relative group flex items-center justify-center w-14 h-14 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-green-400/50 ${
          hasBounced ? "animate-bounce" : ""
        }`}
      >
        {/* Outermost pulse ring */}
        <span className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />

        {/* Gradient ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-green-300 via-green-500 to-emerald-600 opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300" />

        {/* Button body */}
        <span className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#25D366] via-[#20BD5C] to-[#128C4A] shadow-lg group-hover:shadow-green-400/50 group-hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center">
          <WhatsAppIcon className="w-7 h-7 text-white drop-shadow-sm" />

          {/* Shine overlay */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </span>

        {/* Live indicator dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-white border-2 border-white flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </span>
      </button>
    </div>
  );
}
