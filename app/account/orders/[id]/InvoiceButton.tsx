"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function InvoiceButton({ status, orderId }: { status: string; orderId: string }) {
  const [message, setMessage] = useState("");

  const handleClick = (e: React.MouseEvent) => {
    if (status !== "DELIVERED" && status !== "COMPLETED") {
      e.preventDefault();
      setMessage("Invoice is available after delivery.");
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="relative">
      <Link
        href={`/account/orders/${orderId}/invoice`}
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-ink text-white font-medium rounded-xl hover:bg-gray-900 transition-colors shadow-sm"
      >
        <FileText className="w-4 h-4" /> View Invoice
      </Link>
      
      {message && (
        <div className="absolute right-0 sm:right-0 top-full mt-2 w-48 sm:w-max px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl animate-in fade-in zoom-in duration-200 z-10 text-center sm:text-left">
          {message}
          <div className="absolute -top-1 right-8 w-2 h-2 bg-gray-900 transform rotate-45" />
        </div>
      )}
    </div>
  );
}
