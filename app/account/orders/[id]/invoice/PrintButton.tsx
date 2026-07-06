"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-ink text-white font-medium rounded-xl hover:bg-gray-900 transition-colors shadow-sm"
    >
      <Printer className="w-4 h-4" /> Print Invoice
    </button>
  );
}
