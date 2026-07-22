"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search } from "lucide-react";

export function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateParams({ search: search || null, page: "1" });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const updateParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-3">
      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by ID, name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-rose focus:border-brand-rose text-sm transition-colors"
        />
      </div>

      {/* Filters & Sort — stack on mobile, row on md+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3">
        {/* Payment Filter */}
        <select
          value={searchParams.get("payment") || ""}
          onChange={(e) => updateParams({ payment: e.target.value || null, page: "1" })}
          className="w-full pl-3 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-brand-rose focus:border-brand-rose bg-white text-gray-700"
        >
          <option value="">All Payments</option>
          <option value="COD">Cash on Delivery (COD)</option>
          <option value="PREPAID">Prepaid (Online)</option>
        </select>

        {/* Status Filter */}
        <select
          value={searchParams.get("status") || ""}
          onChange={(e) => updateParams({ status: e.target.value || null, page: "1" })}
          className="w-full pl-3 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-brand-rose focus:border-brand-rose bg-white text-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled / Rejected</option>
          <option value="FAILED">Failed</option>
        </select>

        {/* Sort */}
        <select
          value={searchParams.get("sort") || "latest"}
          onChange={(e) => updateParams({ sort: e.target.value, page: "1" })}
          className="w-full pl-3 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-brand-rose focus:border-brand-rose bg-white text-gray-700 font-medium"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
        </select>
      </div>
    </div>
  );
}
