import React, { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/api";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SkeletonGrid count={8} />
      </div>
    }>
      <ShopClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
