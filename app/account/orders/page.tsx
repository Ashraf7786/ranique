import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Heart, Settings, User, ShoppingBag } from "lucide-react";
import { formatDateIST } from "@/lib/utils";
import { LogoutButton } from "@/components/account/LogoutButton";

export default async function OrdersPage() {
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
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: { product: { include: { images: true } } }
          }
        }
      },
    }
  });

  if (!user) {
    redirect("/login");
  }

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
              <Link href="/account/orders" className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-l-2 border-brand-rose text-brand-rose font-medium transition-colors">
                <Package className="w-5 h-5" />
                My Orders
              </Link>
              <Link href="/account/wishlist" className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-brand-ink transition-colors">
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
            <h1 className="font-serif text-3xl font-bold text-brand-ink">My Orders</h1>
          </div>

          {user.orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-brand-mist rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-brand-rose" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-ink mb-2">Your orders are empty</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't made your first purchase yet.</p>
              <Link href="/shop" className="px-6 py-3 bg-brand-ink text-white font-medium rounded-full hover:bg-gray-900 transition-colors shadow-sm">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {user.orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gray-50 p-4 sm:px-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-brand-ink">{formatDateIST(order.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Total</p>
                        <p className="font-semibold text-brand-ink">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Order ID</p>
                        <p className="font-semibold text-brand-ink">#{order.id.slice(-10).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1.5 bg-brand-mist text-brand-rose text-xs font-bold uppercase tracking-wider rounded-full border border-brand-rose/20">
                        {order.status}
                      </span>
                      <Link href={`/account/orders/${order.id}`} className="px-4 py-1.5 bg-white border border-gray-200 text-brand-ink text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:px-6 divide-y divide-gray-100">
                    {order.items.map(item => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                           <img 
                              src={item.product.images.find(img => img.isCover)?.url || item.product.images[0]?.url || ''} 
                              alt={item.product.title} 
                              className="w-full h-full object-cover"
                           />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${item.product.slug}`} className="font-serif font-medium text-brand-ink text-lg hover:text-brand-rose transition-colors line-clamp-1">
                            {item.product.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-brand-ink">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
