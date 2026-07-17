"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  step?: number;
  onChange: (min: number, max: number) => void;
  formatLabel?: (val: number) => string;
}

export function PriceRangeSlider({
  min,
  max,
  currentMin,
  currentMax,
  step = 1,
  onChange,
  formatLabel = (v) => `₹${v.toLocaleString("en-IN")}`,
}: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min" | "max" | null>(null);

  // Local state so the slider feels snappy
  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);

  // Sync external → local
  useEffect(() => { setLocalMin(currentMin); }, [currentMin]);
  useEffect(() => { setLocalMax(currentMax); }, [currentMax]);

  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));

  const getPercent = (v: number) => ((v - min) / (max - min)) * 100;

  const valueFromPosition = useCallback((clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return min;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return clamp(min + ratio * (max - min));
  }, [min, max, step]); // eslint-disable-line

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const val = valueFromPosition(e.clientX);
    if (dragging.current === "min") {
      const next = Math.min(val, localMax - step);
      setLocalMin(next);
    } else {
      const next = Math.max(val, localMin + step);
      setLocalMax(next);
    }
  }, [valueFromPosition, localMin, localMax, step]);

  const handlePointerUp = useCallback(() => {
    if (!dragging.current) return;
    onChange(localMin, localMax);
    dragging.current = null;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove, localMin, localMax, onChange]);

  const startDrag = (handle: "min" | "max") => (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = handle;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const minPct = getPercent(localMin);
  const maxPct = getPercent(localMax);

  return (
    <div className="w-full select-none px-1">
      {/* Input boxes */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label className="text-2xs text-brand-slate font-medium uppercase tracking-wider mb-1 block">From</label>
          <input
            type="number"
            value={localMin}
            min={min}
            max={localMax - step}
            step={step}
            onChange={(e) => {
              const v = clamp(Number(e.target.value));
              const next = Math.min(v, localMax - step);
              setLocalMin(next);
              onChange(next, localMax);
            }}
            className={cn(
              "w-full h-9 px-3 rounded-xl border border-brand-border bg-brand-mist",
              "font-sans text-sm text-brand-ink focus:outline-none focus:border-brand-rose",
              "transition-colors"
            )}
          />
        </div>
        <div className="flex items-end pb-0.5 text-brand-slate text-sm font-medium">—</div>
        <div className="flex-1">
          <label className="text-2xs text-brand-slate font-medium uppercase tracking-wider mb-1 block">To</label>
          <input
            type="number"
            value={localMax}
            min={localMin + step}
            max={max}
            step={step}
            onChange={(e) => {
              const v = clamp(Number(e.target.value));
              const next = Math.max(v, localMin + step);
              setLocalMax(next);
              onChange(localMin, next);
            }}
            className={cn(
              "w-full h-9 px-3 rounded-xl border border-brand-border bg-brand-mist",
              "font-sans text-sm text-brand-ink focus:outline-none focus:border-brand-rose",
              "transition-colors"
            )}
          />
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-1.5 bg-brand-border rounded-full mx-2 my-3"
        style={{ touchAction: "none" }}
      >
        {/* Active range fill */}
        <div
          className="absolute h-full bg-brand-rose rounded-full"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />

        {/* Min handle */}
        <button
          type="button"
          aria-label={`Minimum price ${formatLabel(localMin)}`}
          onPointerDown={startDrag("min")}
          style={{ left: `${minPct}%` }}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
            "w-5 h-5 rounded-full bg-white border-2 border-brand-rose shadow-md",
            "cursor-grab active:cursor-grabbing",
            "transition-transform hover:scale-125 focus:scale-125 focus:outline-none",
            "touch-none"
          )}
        />

        {/* Max handle */}
        <button
          type="button"
          aria-label={`Maximum price ${formatLabel(localMax)}`}
          onPointerDown={startDrag("max")}
          style={{ left: `${maxPct}%` }}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
            "w-5 h-5 rounded-full bg-white border-2 border-brand-rose shadow-md",
            "cursor-grab active:cursor-grabbing",
            "transition-transform hover:scale-125 focus:scale-125 focus:outline-none",
            "touch-none"
          )}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 px-1">
        <span className="text-2xs text-brand-slate font-medium">{formatLabel(localMin)}</span>
        <span className="text-2xs text-brand-slate font-medium">{formatLabel(localMax)}</span>
      </div>
    </div>
  );
}
