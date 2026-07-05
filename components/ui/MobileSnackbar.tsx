"use client";

import { useState, useEffect, useRef } from "react";

const WA_NUMBER = "919288467633";
const WA_MESSAGE = encodeURIComponent(
  "Hii Ranique! 🌸 I'd love to place an order. Can you help me?"
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const DISPLAY_DURATION = 7000; // ms before auto-dismiss

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function MobileSnackbar() {
  const [show, setShow]       = useState(false);
  const [visible, setVisible] = useState(false); // controls CSS transition
  const [gone, setGone]       = useState(false); // unmount after slide-out
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    setVisible(false);
    // Wait for slide-out transition then unmount
    setTimeout(() => setGone(true), 450);
    sessionStorage.setItem("ranique_snackbar_seen", "1");
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("ranique_snackbar_seen")) return;

    // Appear after 2.5s
    const appear = setTimeout(() => {
      setShow(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );

      // Auto-dismiss
      timerRef.current = setTimeout(dismiss, DISPLAY_DURATION);
    }, 2500);

    return () => {
      clearTimeout(appear);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!show || gone) return null;

  return (
    <>
      {/* Keyframes for progress bar shrink */}
      <style>{`
        @keyframes snack-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
        .snack-progress-bar {
          animation: snack-progress ${DISPLAY_DURATION}ms linear forwards;
          transform-origin: left;
        }
      `}</style>

      {/* Only on mobile — hidden sm and up */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Order on WhatsApp"
        className={[
          "sm:hidden fixed bottom-4 left-3 right-3 z-[60]",
          "transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          visible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-10 opacity-0 scale-95 pointer-events-none",
        ].join(" ")}
      >
        <div className="relative bg-white rounded-2xl shadow-[0_8px_40px_rgba(201,116,138,0.18),0_2px_12px_rgba(0,0,0,0.08)] border border-brand-border overflow-hidden">

          {/* Top accent strip */}
          <div className="h-[3px] w-full bg-gradient-to-r from-brand-rose via-brand-gold to-brand-rose-light" />

          {/* Body */}
          <div className="px-4 pt-3.5 pb-4">
            <div className="flex items-start gap-3">

              {/* Icon bubble */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blush to-brand-rose-light flex items-center justify-center">
                <span className="text-xl leading-none">🛍️</span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-serif text-sm font-semibold text-brand-ink leading-snug">
                  Order on WhatsApp
                </p>
                <p className="font-sans text-xs text-brand-slate mt-0.5 leading-relaxed">
                  Direct karo humse — reply in minutes! ✨
                </p>
              </div>

              {/* Dismiss */}
              <button
                onClick={dismiss}
                aria-label="Dismiss"
                className="shrink-0 -mt-0.5 -mr-1 w-7 h-7 rounded-full flex items-center justify-center text-brand-slate hover:bg-brand-blush hover:text-brand-rose transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* CTA button */}
            <a
              id="whatsapp-snackbar-cta"
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="group mt-3 flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C4A] text-white font-sans font-semibold text-xs shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.97] transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <WhatsAppIcon />
                Chat &amp; Order Now
              </span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Auto-dismiss countdown bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-border overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-brand-rose to-brand-gold snack-progress-bar" />
          </div>

        </div>
      </div>
    </>
  );
}
