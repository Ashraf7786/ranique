import React from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  priorityCount?: number; // first N cards get priority image loading
}

export function ProductGrid({ products, priorityCount = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">🔍</span>
        <h2 className="font-serif text-xl text-brand-ink mb-2">No products found</h2>
        <p className="text-sm text-brand-slate">
          Try adjusting your filters or browse a different category.
        </p>
      </div>
    );
  }

  return (
    <div
      role="list"
      aria-label="Products"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      {products.map((product, idx) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} priority={idx < priorityCount} />
        </div>
      ))}
    </div>
  );
}
