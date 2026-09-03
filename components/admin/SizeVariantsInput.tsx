"use client";

import React, { useState } from "react";

export interface SizeVariant {
  id: string;
  label: string;
  stock: number;
}

interface SizeVariantsInputProps {
  value: SizeVariant[];
  onChange: (variants: SizeVariant[]) => void;
}

const PRESETS: Record<string, SizeVariant[]> = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((s) => ({
    id: s.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    label: s,
    stock: 0,
  })),
  bangles: ["2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "2.10", "Free Size"].map(
    (s) => ({
      id: s.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      label: s,
      stock: 0,
    })
  ),
  footwear: ["5", "6", "7", "8", "9", "10"].map((s) => ({
    id: `shoe-${s}`,
    label: `UK ${s}`,
    stock: 0,
  })),
  waist: ["26", "28", "30", "32", "34", "36"].map((s) => ({
    id: `waist-${s}`,
    label: `${s}"`,
    stock: 0,
  })),
};

export function SizeVariantsInput({ value, onChange }: SizeVariantsInputProps) {
  const [enabled, setEnabled] = useState(value.length > 0);
  const [customLabel, setCustomLabel] = useState("");

  const totalStock = value.reduce((sum, sv) => sum + sv.stock, 0);

  const handleEnable = (on: boolean) => {
    setEnabled(on);
    if (!on) onChange([]);
  };

  const applyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    // Preserve existing stock if label matches
    const merged = preset.map((pv) => {
      const existing = value.find((v) => v.label === pv.label);
      return existing ? { ...pv, stock: existing.stock } : pv;
    });
    onChange(merged);
  };

  const updateStock = (id: string, stock: number) => {
    onChange(value.map((sv) => (sv.id === id ? { ...sv, stock: Math.max(0, stock) } : sv)));
  };

  const removeVariant = (id: string) => {
    onChange(value.filter((sv) => sv.id !== id));
  };

  const addCustom = () => {
    const label = customLabel.trim();
    if (!label) return;
    if (value.some((sv) => sv.label.toLowerCase() === label.toLowerCase())) {
      setCustomLabel("");
      return;
    }
    const id = label.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now();
    onChange([...value, { id, label, stock: 0 }]);
    setCustomLabel("");
  };

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
        <div
          onClick={() => handleEnable(!enabled)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            enabled ? "bg-brand-rose" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
          Enable Size Variants &amp; Individual Stock
        </span>
      </label>

      {enabled && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
          {/* Preset buttons */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Quick Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(PRESETS).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-300 bg-white hover:border-brand-rose hover:text-brand-rose transition-colors capitalize"
                >
                  {key === "bangles"
                    ? "Bangle Sizes"
                    : key === "footwear"
                    ? "Shoe Sizes (UK)"
                    : key === "waist"
                    ? "Waist Sizes"
                    : "Clothing (XS–XXL)"}
                </button>
              ))}
            </div>
          </div>

          {/* Size rows */}
          {value.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr,120px,32px] gap-2 items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Size Label
                </span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock Qty
                </span>
                <span />
              </div>
              {value.map((sv) => (
                <div
                  key={sv.id}
                  className="grid grid-cols-[1fr,120px,32px] gap-2 items-center"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        sv.stock > 5
                          ? "bg-green-400"
                          : sv.stock > 0
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-800">{sv.label}</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={sv.stock}
                    onChange={(e) => updateStock(sv.id, parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose focus:border-brand-rose outline-none text-center"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(sv.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove size"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Stock total */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-xs font-semibold text-gray-500">Total Stock (auto-calculated)</span>
                <span className={`text-sm font-bold tabular-nums ${totalStock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {totalStock} units
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-2">
              No sizes added yet. Use a preset above or add custom sizes.
            </p>
          )}

          {/* Add custom size */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
              placeholder="Add custom size (e.g. 42, One Size…)"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose focus:border-brand-rose outline-none"
            />
            <button
              type="button"
              onClick={addCustom}
              disabled={!customLabel.trim()}
              className="px-4 py-2 text-sm font-medium bg-brand-rose text-white rounded-lg hover:bg-brand-rose/90 transition-colors disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
