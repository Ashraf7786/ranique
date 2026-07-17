"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SortBy } from "@/lib/types";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";

const SORT_OPTIONS: { value: SortBy; label: string; icon: string }[] = [
  { value: "relevance",  label: "Relevance",       icon: "✦" },
  { value: "newest",     label: "Newest First",     icon: "🆕" },
  { value: "price-asc",  label: "Price: Low → High", icon: "↑" },
  { value: "price-desc", label: "Price: High → Low", icon: "↓" },
  { value: "rating",     label: "Best Rated",       icon: "⭐" },
  { value: "popular",    label: "Most Popular",     icon: "🔥" },
];

interface SortDropdownProps {
  value: SortBy;
  onChange: (v: SortBy) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        id="sort-dropdown-btn"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "inline-flex items-center gap-2 h-9 px-3 rounded-full border font-sans text-sm font-medium",
          "transition-all duration-200 whitespace-nowrap",
          open
            ? "border-brand-rose bg-brand-blush text-brand-rose"
            : "border-brand-border bg-white text-brand-slate hover:border-brand-rose hover:text-brand-rose"
        )}
      >
        <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Sort:</span>
        <span className="font-semibold text-brand-ink">{current.label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Sort options"
          className={cn(
            "absolute right-0 top-full mt-2 z-30 w-52",
            "bg-white border border-brand-border rounded-2xl shadow-popover",
            "p-2 animate-slide-up"
          )}
        >
          {SORT_OPTIONS.map((opt) => {
            const isActive = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                  isActive
                    ? "bg-brand-blush text-brand-rose font-semibold"
                    : "text-brand-ink hover:bg-brand-mist"
                )}
              >
                <span className="text-base w-5 text-center shrink-0">{opt.icon}</span>
                <span className="flex-1 text-left">{opt.label}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-brand-rose shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
