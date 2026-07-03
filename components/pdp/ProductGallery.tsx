"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
      {/* ── Main Image ── */}
      <div className="relative aspect-product w-full overflow-hidden rounded-2xl bg-brand-blush flex-1">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={cn(
              "absolute inset-0 transition-opacity duration-400",
              idx === activeIdx ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
              disabled={activeIdx === 0}
              aria-label="Previous image"
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full",
                "bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center",
                "transition-all hover:bg-white disabled:opacity-30"
              )}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIdx((i) => Math.min(i + 1, images.length - 1))}
              disabled={activeIdx === images.length - 1}
              aria-label="Next image"
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full",
                "bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center",
                "transition-all hover:bg-white disabled:opacity-30"
              )}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators (mobile) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-200",
                  i === activeIdx
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnail Strip (desktop sidebar) ── */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden scrollbar-hide md:w-20 md:max-h-[480px]">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              aria-label={`View ${img.alt}`}
              aria-current={idx === activeIdx}
              className={cn(
                "shrink-0 relative w-16 h-20 md:w-full md:h-24 rounded-xl overflow-hidden",
                "border-2 transition-all duration-150",
                "bg-brand-blush",
                idx === activeIdx
                  ? "border-brand-rose"
                  : "border-transparent hover:border-brand-rose-light"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
