import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl overflow-hidden shadow-card animate-fade-in",
        className
      )}
      aria-hidden="true"
      role="presentation"
    >
      {/* Image skeleton — locked 3:4 */}
      <div className="aspect-product w-full shimmer-bg" />

      <div className="p-3 space-y-2.5">
        {/* Brand line */}
        <div className="h-2.5 w-16 rounded-full shimmer-bg" />
        {/* Title lines */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded-full shimmer-bg" />
          <div className="h-3.5 w-3/4 rounded-full shimmer-bg" />
        </div>
        {/* Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-3 rounded-full shimmer-bg" />
          ))}
          <div className="h-2.5 w-8 rounded-full shimmer-bg ml-1" />
        </div>
        {/* Price */}
        <div className="flex items-center gap-2 pt-0.5">
          <div className="h-4 w-12 rounded-full shimmer-bg" />
          <div className="h-3 w-10 rounded-full shimmer-bg opacity-60" />
        </div>
        {/* CTA */}
        <div className="h-9 w-full rounded-full shimmer-bg mt-1" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
