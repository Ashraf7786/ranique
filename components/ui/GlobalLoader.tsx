"use client";

import { useEffect, useState } from "react";

export function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loader after a short delay on initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-mist animate-fade-out" style={{ animationDelay: '1.2s' }}>
      <div className="flex flex-col items-center gap-6">
        <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-ink">
          <path d="M14 6h16c7 0 12 4 12 11.5 0 5-3 9-8.5 10.5L43 38h-6.5l-8.5-9.5H19V38h-5V6zm5 4.5V24h10.5c5 0 7.5-2.5 7.5-6.5 0-4.5-3-6.5-8-6.5H19z" fill="currentColor"/>
          <text x="48" y="32" fontFamily="Georgia, serif" fontSize="26" fontWeight="600" fill="currentColor" letterSpacing="2">anique</text>
        </svg>
        <div className="w-48 h-1 bg-brand-border rounded-full overflow-hidden">
          <div className="w-full h-full bg-brand-rose animate-scale-x" />
        </div>
      </div>
    </div>
  );
}
