import { prisma } from "@/lib/prisma";
import { OfferForm } from "@/components/admin/OfferForm";

export default async function NewOfferPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      sku: true,
      sellingPrice: true,
      images: {
        where: { isCover: true },
        take: 1
      }
    },
    orderBy: { title: 'asc' }
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Create New Offer</h1>
        <p className="text-sm text-gray-500 mt-1">Set up a flash sale for a product with a countdown timer.</p>
      </div>

      <OfferForm products={products} />
    </div>
  );
}
