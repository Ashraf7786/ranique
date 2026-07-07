import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductDataTable } from "@/components/admin/ProductDataTable";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams;
  const isTrashMode = view === 'trash';

  const products = await prisma.product.findMany({
    where: {
      deletedAt: isTrashMode ? { not: null } : null
    },
    include: {
      images: true,
      category: true,
      brand: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          {isTrashMode ? 'Trashed Products' : 'Products'}
        </h1>
        <div className="flex items-center gap-3">
          {isTrashMode ? (
            <Link 
              href="/admin/products"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              Back to Products
            </Link>
          ) : (
            <Link 
              href="/admin/products?view=trash"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors"
            >
              View Trash
            </Link>
          )}
          <Link 
            href="/admin/products/new"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-brand-ink text-white font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      <ProductDataTable initialProducts={products} isTrashMode={isTrashMode} />
    </div>
  );
}
