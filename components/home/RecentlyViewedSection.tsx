import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/shop/ProductGrid";

export async function RecentlyViewedSection() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("NextAuth error:", error);
  }

  if (!session?.user) {
    return null;
  }

  let recentlyViewedProducts: any[] = [];
  try {
    const rv = await prisma.recentlyViewed.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { viewedAt: 'desc' },
      take: 4,
      include: {
        product: { include: { images: true } }
      }
    });

    recentlyViewedProducts = rv.map(r => {
      let parsedColors = [];
      try {
        if (r.product.colors) parsedColors = JSON.parse(r.product.colors);
      } catch (e) {}

      return {
        ...r.product,
        name: r.product.title,
        price: r.product.sellingPrice,
        compareAtPrice: r.product.originalPrice,
        images: r.product.images.map((img: any) => ({
          src: img.url,
          alt: img.altText || r.product.title,
        })),
        variants: {
          colors: parsedColors.length > 0 ? parsedColors : undefined,
        },
      };
    });
  } catch (e) {
    console.error("Recently viewed error:", e);
    return null;
  }

  if (recentlyViewedProducts.length === 0) {
    return null;
  }

  return (
    <section aria-label="Recently Viewed products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
          Recently Viewed
        </h2>
      </div>
      <ProductGrid products={recentlyViewedProducts} priorityCount={4} />
    </section>
  );
}
