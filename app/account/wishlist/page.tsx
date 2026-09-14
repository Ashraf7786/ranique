import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";

export default async function AccountWishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if ((session.user as any).role === "ADMIN") {
    redirect("/admin");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      wishlist: {
        include: {
          items: {
            include: {
              product: { include: { images: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const wishlistItems = user.wishlist?.items ?? [];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-[#b76e79] text-xs font-bold rounded-full border border-pink-100">
            <Heart className="w-3 h-3" />
            {wishlistItems.length}
          </span>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-5">
            <Heart className="w-10 h-10 text-pink-300" strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Save your favorite products here by clicking the heart icon. Come back anytime to view or order them!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {wishlistItems.map((item) => {
            const product = item.product;
            const coverImage =
              product.images.find((img) => img.isCover) || product.images[0];
            const hasDiscount =
              product.originalPrice &&
              Number(product.originalPrice) > Number(product.sellingPrice);
            const discountPercent = hasDiscount
              ? Math.round(
                  ((Number(product.originalPrice) -
                    Number(product.sellingPrice)) /
                    Number(product.originalPrice)) *
                    100
                )
              : 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
              >
                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                  {coverImage ? (
                    <img
                      src={coverImage.url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <ShoppingBag className="w-12 h-12 text-gray-200" />
                    </div>
                  )}

                  {/* Discount badge */}
                  {hasDiscount && discountPercent > 0 && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#b76e79] text-white text-[10px] font-bold shadow-sm">
                      {discountPercent}% OFF
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <Link
                      href={`/product/${product.slug}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full shadow-md hover:bg-white"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Quick View
                    </Link>
                  </div>

                  {/* Wishlist heart */}
                  <div className="absolute top-2.5 right-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <Heart
                        className="w-4 h-4 text-[#b76e79] fill-[#b76e79]"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 hover:text-[#b76e79] transition-colors leading-snug">
                      {product.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-[#b76e79] text-sm">
                      ₹{Number(product.sellingPrice).toLocaleString("en-IN")}
                    </span>
                    {hasDiscount && (
                      <span className="text-gray-400 line-through text-xs">
                        ₹
                        {Number(product.originalPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/product/${product.slug}`}
                    className="mt-3 flex items-center justify-center w-full h-9 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
