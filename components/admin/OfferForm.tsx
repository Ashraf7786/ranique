"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function OfferForm({ products }: { products: any[] }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [discount, setDiscount] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Helper to pre-calculate offer price when discount changes
  const handleDiscountChange = (val: string) => {
    setDiscount(val);
    if (!val || !productId) return;
    
    const prod = products.find(p => p.id === productId);
    if (prod && prod.sellingPrice) {
      const discountNum = Number(val);
      if (discountNum > 0 && discountNum <= 100) {
        const newPrice = prod.sellingPrice * (1 - (discountNum / 100));
        setOfferPrice(Math.round(newPrice).toString());
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          discount: Number(discount),
          offerPrice: Number(offerPrice),
          endsAt: new Date(endsAt),
          isActive
        }),
      });

      if (!res.ok) throw new Error("Failed to create offer");
      
      router.push("/admin/offers");
      router.refresh();
    } catch (error) {
      alert("Failed to save offer.");
      console.error(error);
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Select Product</label>
          <select 
            required
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blush"
          >
            <option value="" disabled>Select a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} (₹{p.sellingPrice})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Discount Percentage (%)</label>
            <input 
              type="number" 
              required
              min="1"
              max="100"
              placeholder="e.g. 20"
              value={discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blush"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Offer Price (₹)</label>
            <input 
              type="number" 
              required
              min="0"
              placeholder="Calculated automatically"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blush bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Ends At</label>
            <input 
              type="datetime-local" 
              required
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blush"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
            <select 
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blush"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-5 py-2.5 bg-brand-ink text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Creating..." : "Create Offer"}
          </button>
        </div>
      </form>
    </div>
  );
}
