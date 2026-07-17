"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PriceRangeSliderProps {
  min: number;
  max: number;         // slider visual max
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
  step = 100,
  onChange,
  formatLabel = (v) => `₹${v.toLocaleString("en-IN")}`,
}: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min" | "max" | null>(null);

  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);

  // Separate text state so user can freely type any digits without being blocked
  const [minText, setMinText] = useState(String(currentMin));
  const [maxText, setMaxText] = useState(String(currentMax));

  // Sync from external prop (e.g. Clear All resets to 0 / max)
  useEffect(() => {
    setLocalMin(currentMin);
    setMinText(String(currentMin));
  }, [currentMin]);

  useEffect(() => {
    setLocalMax(currentMax);
    setMaxText(String(currentMax));
  }, [currentMax]);

  // Slider position clamp (for the visual track only)
  const clampToSlider = (v: number) =>
    Math.min(max, Math.max(min, Math.round(v / step) * step));

  const getPct = (v: number) =>
    Math.max(0, Math.min(100, ((Math.min(v, max) - min) / (max - min)) * 100));

  const valueFromClientX = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return min;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return clampToSlider(min + ratio * (max - min));
    },
    [min, max, step] // eslint-disable-line
  );

  // ── pointer drag ──────────────────────────────────────────────────────────
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current) return;
      const val = valueFromClientX(e.clientX);
      if (dragging.current === "min") {
        const next = Math.min(val, clampToSlider(localMax) - step);
        setLocalMin(next);
        setMinText(String(next));
      } else {
        const next = Math.max(val, clampToSlider(localMin) + step);
        setLocalMax(next);
        setMaxText(String(next));
      }
    },
    [valueFromClientX, localMin, localMax, step] // eslint-disable-line
  );

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

  // ── text input handlers ───────────────────────────────────────────────────

  // Allow user to type any number freely; validate only on blur / Enter
  const commitMin = () => {
    const raw = parseInt(minText.replace(/\D/g, ""), 10);
    const v = isNaN(raw) ? min : Math.max(min, Math.min(raw, localMax - step));
    setLocalMin(v);
    setMinText(String(v));
    onChange(v, localMax);
  };

  const commitMax = () => {
    const raw = parseInt(maxText.replace(/\D/g, ""), 10);
    // No hard cap — user can type any number; slider just stays at max visually
    const v = isNaN(raw) ? max : Math.max(localMin + step, raw);
    setLocalMax(v);
    setMaxText(String(v));
    onChange(localMin, v);
  };

  const minPct = getPct(localMin);
  const maxPct = getPct(localMax);

  return (
    <div className="w-full select-none px-1">
      {/* ── Text inputs ── */}
      <div className="flex gap-2 mb-5">
        <div className="flex-1">
          <label className="text-2xs text-brand-slate font-medium uppercase tracking-wider mb-1.5 block">
            From
          </label>
          <input
            // type="text" + inputMode="numeric" avoids the browser's number-spinner
            // restrictions and shows the numeric keyboard on iOS/Android
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={minText}
            placeholder="0"
            onChange={(e) => setMinText(e.target.value.replace(/\D/g, ""))}
            onBlur={commitMin}
            onKeyDown={(e) => e.key === "Enter" && commitMin()}
            className={cn(
              "w-full h-10 px-3 rounded-xl border border-brand-border bg-white",
              "font-sans text-sm text-brand-ink focus:outline-none focus:border-brand-rose",
              "transition-colors"
            )}
          />
        </div>

        <div className="flex items-end pb-2 text-brand-slate font-medium shrink-0">—</div>

        <div className="flex-1">
          <label className="text-2xs text-brand-slate font-medium uppercase tracking-wider mb-1.5 block">
            To
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={maxText}
            placeholder={String(max)}
            onChange={(e) => setMaxText(e.target.value.replace(/\D/g, ""))}
            onBlur={commitMax}
            onKeyDown={(e) => e.key === "Enter" && commitMax()}
            className={cn(
              "w-full h-10 px-3 rounded-xl border border-brand-border bg-white",
              "font-sans text-sm text-brand-ink focus:outline-none focus:border-brand-rose",
              "transition-colors"
            )}
          />
        </div>
      </div>

      {/* ── Slider track ── */}
      <div
        ref={trackRef}
        className="relative h-1.5 bg-brand-border rounded-full mx-2 my-3"
        style={{ touchAction: "none" }}
      >
        {/* Filled range */}
        <div
          className="absolute h-full bg-brand-rose rounded-full pointer-events-none"
          style={{
            left: `${minPct}%`,
            right: `${100 - maxPct}%`,
          }}
        />

        {/* Min handle */}
        <button
          type="button"
          aria-label={`Minimum price ${formatLabel(localMin)}`}
          onPointerDown={startDrag("min")}
          style={{ left: `${minPct}%` }}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
            "w-6 h-6 rounded-full bg-white border-2 border-brand-rose shadow-md",
            "cursor-grab active:cursor-grabbing touch-none",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-rose"
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
            "w-6 h-6 rounded-full bg-white border-2 border-brand-rose shadow-md",
            "cursor-grab active:cursor-grabbing touch-none",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-rose"
          )}
        />
      </div>

      {/* ── Range labels ── */}
      <div className="flex justify-between mt-2 px-1">
        <span className="text-2xs text-brand-slate">{formatLabel(min)}</span>
        <span className="text-2xs text-brand-slate">{formatLabel(max)}+</span>
      </div>
    </div>
  );
}
