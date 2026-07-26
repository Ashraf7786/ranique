"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

export function TrackOrderForm() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!orderId.trim()) {
      setError("Please enter your Order ID.");
      return;
    }
    
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    
    // Pass email as a search parameter to the detailed tracking page
    router.push(`/track-order/${encodeURIComponent(orderId.trim())}?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full justify-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Track Status</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1.5">
            Order ID *
          </label>
          <input
            id="orderId"
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. ord_123456789"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-transparent transition-shadow bg-gray-50/50"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="The email used during checkout"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-transparent transition-shadow bg-gray-50/50"
            required
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full flex items-center justify-center gap-2 bg-brand-rose text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-rose-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-brand-rose/20 active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Search className="w-4 h-4" />
            Track Order
          </>
        )}
      </button>
      
      <p className="mt-4 text-center text-xs text-gray-400">
        You can find your Order ID in your confirmation email.
      </p>
    </form>
  );
}
