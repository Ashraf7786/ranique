"use client";

import React, { useState } from "react";
import { Check, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function PinCodeChecker() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate only numbers and exactly 6 digits (assuming standard Indian pincode)
    if (!/^\d{6}$/.test(pincode)) {
      setStatus("error");
      setMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    setStatus("checking");
    try {
      const res = await fetch(`/api/shipping/serviceability?pincode=${pincode}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Pincode check failed.");
      }
      
      if (data.serviceable) {
        setStatus("success");
        const codMsg = data.codAvailable 
          ? "Cash on Delivery (COD) is available." 
          : "Prepaid payment modes only (COD unavailable).";
        setMessage(`Delivery available to your location! ${codMsg}`);
      } else {
        setStatus("error");
        if (data.remark && data.remark.toLowerCase().includes("embargo")) {
          setMessage("Delivery is temporarily suspended to this location (Embargo).");
        } else {
          setMessage("Seller does not ship to this address / pincode.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage("Failed to verify pincode. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only numbers
    if (val === "" || /^\d+$/.test(val)) {
      if (val.length <= 6) {
        setPincode(val);
        setStatus("idle");
        setMessage("");
      }
    }
  };

  return (
    <div className="py-4 border-t border-brand-border">
      <div className="flex flex-col gap-2">
        <label htmlFor="pincode" className="text-sm font-medium text-brand-ink flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brand-slate" />
          Check Delivery Availability
        </label>
        
        <form onSubmit={handleCheck} className="flex gap-2 relative">
          <input
            id="pincode"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit PIN Code"
            value={pincode}
            onChange={handleInputChange}
            className="flex-1 h-10 px-3 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-1 focus:ring-brand-rose focus:border-brand-rose transition-all"
          />
          <button
            type="submit"
            disabled={pincode.length !== 6 || status === "checking"}
            className="h-10 px-4 rounded-lg bg-brand-slate text-white text-sm font-medium hover:bg-brand-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === "checking" ? "Checking..." : "Check"}
          </button>
        </form>

        {status === "success" && (
          <div className="flex items-center gap-1.5 text-sm text-green-600 mt-1 animate-slide-up">
            <Check className="w-4 h-4" />
            <span className="font-medium">{message}</span>
          </div>
        )}
        
        {status === "error" && (
          <div className="flex items-center gap-1.5 text-sm text-red-500 mt-1 animate-slide-up">
            <X className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
