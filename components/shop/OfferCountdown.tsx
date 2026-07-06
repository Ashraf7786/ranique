"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfferCountdown({ endsAt, compact = false }: { endsAt: string, compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const targetDate = new Date(endsAt).getTime();
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endsAt]);

  if (!timeLeft) return null; // Offer expired

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-brand-rose px-2 py-1 rounded shadow-sm animate-pulse-slow">
        <Clock className="w-3 h-3" />
        <span>{timeLeft.d}d {timeLeft.h}h {timeLeft.m}m</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-red-50/50 rounded-xl border border-red-100">
      <div className="flex items-center gap-2 text-brand-rose font-bold text-sm uppercase tracking-wider">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-rose opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-rose"></span>
        </span>
        Flash Sale Ends In
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center justify-center bg-white border border-red-100 rounded-lg w-12 h-12 shadow-sm">
          <span className="text-lg font-bold text-gray-900">{timeLeft.d}</span>
          <span className="text-[10px] text-gray-500 font-medium">DAYS</span>
        </div>
        <span className="text-brand-rose font-bold">:</span>
        <div className="flex flex-col items-center justify-center bg-white border border-red-100 rounded-lg w-12 h-12 shadow-sm">
          <span className="text-lg font-bold text-gray-900">{timeLeft.h.toString().padStart(2, '0')}</span>
          <span className="text-[10px] text-gray-500 font-medium">HRS</span>
        </div>
        <span className="text-brand-rose font-bold">:</span>
        <div className="flex flex-col items-center justify-center bg-white border border-red-100 rounded-lg w-12 h-12 shadow-sm">
          <span className="text-lg font-bold text-gray-900">{timeLeft.m.toString().padStart(2, '0')}</span>
          <span className="text-[10px] text-gray-500 font-medium">MIN</span>
        </div>
        <span className="text-brand-rose font-bold">:</span>
        <div className="flex flex-col items-center justify-center bg-white border border-red-100 rounded-lg w-12 h-12 shadow-sm">
          <span className="text-lg font-bold text-brand-rose animate-pulse">{timeLeft.s.toString().padStart(2, '0')}</span>
          <span className="text-[10px] text-gray-500 font-medium">SEC</span>
        </div>
      </div>
    </div>
  );
}
