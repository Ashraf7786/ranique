import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Heart, Settings, User, ShoppingBag } from "lucide-react";
import { LogoutButton } from "@/components/account/LogoutButton";

export default async function AccountWishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if ((session.user as any).role === 'ADMIN') {
    redirect("/admin");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      wishlist: {
        include: {
          items: {
            include: {
              product: { include: { images: true } }
            },
            orderBy: { createdAt: "desc" }
          }
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const wishlistItems = user.wishlist?.items ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-brand-rose text-white rounded-full flex items-center justify-center text-3xl font-serif font-bold mb-4 shadow-sm overflow-hidden">
              {user.image ? (
                <img src={user.image} alt={user.firstName || "Profile"} className="w-full h-full object-cover" />
              ) : (
                user.firstName?.[0] || user.email[0].toUpperCase()
              )}
            </div>
            <h2 className="font-serif font-bold text-lg text-brand-ink">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500 mb-4">{user.email}</p>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
              Verified User
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              <Link href="/account" className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-brand-ink transition-colors">
                <User className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-brand-ink transition-colors">
                <Package className="w-5 h-5" />
                My Orders
              </Link>
              <Link href="/account/wishlist" className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-l-2 border-brand-rose text-brand-rose font-medium transition-colors">
                <Heart className="w-5 h-5" />
                Wishlist
              </Link>
              <Link href="/account/settings" className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-brand-ink transition-colors border-t border-gray-100">
                <Settings className="w-5 h-5" />
                Settings
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h1 className="font-serif text-3xl font-bold text-brand-ink">My Wishlist</h1>
            {wishlistItems.length > 0 && (
              <span className="px-3 py-1 bg-brand-mist text-brand-rose text-sm font-semibold rounded-full border border-brand-rose/20">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-brand-blush rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-brand-rose" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-ink mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                Save your favorite products here by clicking the heart icon. Come back anytime to view or order them!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-ink text-white font-medium rounded-full hover:bg-gray-900 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.map(item => {
                const product = item.product;
                const coverImage = product.images.find(img => img.isCover) || product.images[0];
                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                    <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                      {coverImage ? (
                        <img
                          src={coverImage.url}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-mist/50">
                          <ShoppingBag className="w-12 h-12 text-brand-rose opacity-50" />
                        </div>
                      )}
                      {product.badge && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-rose text-white text-[10px] font-bold uppercase">
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-sans font-semibold text-sm text-brand-ink line-clamp-2 mb-1">
                        {product.title}
                      </h3>
                      <p className="font-bold text-brand-rose text-sm mb-3">
                        ₹{product.sellingPrice.toLocaleString("en-IN")}
                        {product.originalPrice && product.originalPrice > product.sellingPrice && (
                          <span className="text-gray-400 line-through text-xs ml-1 font-normal">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </p>
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex items-center justify-center w-full h-8 rounded-full bg-brand-ink text-white text-xs font-semibold hover:bg-gray-900 transition-colors"
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
      </div>
    </div>
  );
}
