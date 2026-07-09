import { prisma } from "@/lib/prisma";
import { ReviewsDataTable } from "@/components/admin/ReviewsDataTable";

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          images: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: { title: 'asc' }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Product Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer reviews and add manual social proof.</p>
        </div>
      </div>

      <ReviewsDataTable initialReviews={reviews} products={products} />
    </div>
  );
}
