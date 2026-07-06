import Link from "next/link";
import { Plus } from "lucide-react";
import { getProducts } from "@/lib/api";
import { ProductDataTable } from "@/components/admin/ProductDataTable";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Products</h1>
        <Link 
          href="/admin/products/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-brand-ink text-white font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <ProductDataTable initialProducts={products} />
    </div>
  );
}
