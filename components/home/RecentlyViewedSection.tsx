"use client";

import React, { useEffect, useState } from "react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { useSession } from "next-auth/react";

export function RecentlyViewedSection() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    async function fetchRecentlyViewed() {
      try {
        const res = await fetch("/api/recently-viewed");
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch recently viewed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentlyViewed();
  }, [session]);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section aria-label="Recently Viewed products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
          Recently Viewed
        </h2>
      </div>
      <ProductGrid products={products} priorityCount={4} />
    </section>
  );
}
