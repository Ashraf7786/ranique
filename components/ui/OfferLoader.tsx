"use client";

import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";

// Module-level cache to instantly show the offer across route transitions
let cachedOffer: any = null;
let isFetching = false;

export function OfferLoader() {
  const [offer, setOffer] = useState<any>(cachedOffer);

  useEffect(() => {
    if (cachedOffer || isFetching) {
      return;
    }
    
    isFetching = true;
    fetch("/api/offers")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          // Find the first active offer
          const activeOffer = data.find((o: any) => o.isActive && new Date(o.endsAt) > new Date());
          if (activeOffer) {
            cachedOffer = activeOffer;
            setOffer(activeOffer);
          }
        }
      })
      .catch((err) => console.error("Failed to fetch offer for loader", err))
      .finally(() => {
        isFetching = false;
      });
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white shadow-2xl border border-brand-rose/20 max-w-sm text-center transform animate-slide-up">
        
        {/* Animated Logo / Icon */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-brand-rose/10">
          <div className="absolute inset-0 rounded-full border-4 border-brand-rose/20 border-t-brand-rose animate-spin" />
          <span className="font-serif font-bold text-2xl text-brand-rose">R</span>
        </div>

        {/* Loading text */}
        <div>
          <h2 className="font-serif text-xl font-semibold text-brand-ink mb-1">
            Loading Ranique...
          </h2>
          <p className="text-sm text-brand-slate animate-pulse">
            Curating premium just for you
          </p>
        </div>

        {/* Dynamic Offer Snippet */}
        {offer && (
          <div className="mt-2 p-3 bg-brand-rose/5 rounded-xl border border-brand-rose/20 w-full animate-fade-in">
            <div className="flex items-center justify-center gap-1.5 text-brand-rose text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" /> Special Offer
            </div>
            <p className="text-brand-ink text-sm font-medium line-clamp-1">
              {offer.product?.title || offer.product?.name}
            </p>
            <p className="text-brand-rose font-bold mt-1">
              {offer.discount}% OFF
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
