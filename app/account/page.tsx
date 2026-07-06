import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Heart, Settings, User, MapPin, Phone } from "lucide-react";
import { LogoutButton } from "@/components/account/LogoutButton";
import { FlashMessage } from "@/components/account/FlashMessage";

export default async function AccountDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Admins should use the Admin Panel, not the frontend customer dashboard
  if ((session.user as any).role === 'ADMIN') {
    redirect("/admin");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      addresses: true,
      wishlist: {
        include: {
          items: {
            include: { product: { include: { images: true } } },
            take: 4,
          },
        },
      },
      recentlyViewed: {
        include: {
          product: { include: { images: true } },
        },
        orderBy: { viewedAt: "desc" },
        take: 4,
      }
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
              <Link href="/account" className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-l-2 border-brand-rose text-brand-rose font-medium transition-colors">
                <User className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-brand-ink transition-colors">
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
          
          <FlashMessage />

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-brand-sand to-brand-blush rounded-2xl p-8 border border-brand-rose-light">
            <h1 className="font-serif text-3xl font-bold text-brand-ink mb-2">
              Welcome to your dashboard, {user.firstName}!
            </h1>
            <p className="text-gray-700">
              Manage your orders, view your wishlist, and update your personal details here.
            </p>
          </div>

          {/* Recent Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-brand-ink">Recent Orders</h3>
              <Link href="/account/orders" className="text-sm font-medium text-brand-rose hover:underline">View all</Link>
            </div>
            {user.orders.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
                You haven't placed any orders yet.
              </div>
            ) : (
              <div className="space-y-4">
                {user.orders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                      <p className="font-semibold text-brand-ink text-lg">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-brand-ink text-lg">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                      <span className="inline-block mt-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Address */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-brand-ink">Saved Address</h3>
              <Link href="/account/settings" className="text-sm font-medium text-brand-rose hover:underline">Edit profile</Link>
            </div>
            {user.addresses && user.addresses.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                {user.addresses.map(address => (
                  <div key={address.id} className="mb-4 last:mb-0">
                    <p className="font-semibold text-brand-ink text-lg">{address.name}</p>
                    <p className="text-gray-600 text-sm mt-1">{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                    <p className="text-gray-600 text-sm">{address.city}, {address.state} - {address.zip}</p>
                    <p className="text-gray-600 text-sm">{address.country}</p>
                    <p className="text-gray-600 text-sm mt-2 flex items-center gap-2"><Phone className="w-4 h-4" /> {address.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm flex flex-col items-center gap-3">
                <MapPin className="w-8 h-8 text-gray-300" />
                <p>No saved addresses.</p>
                <Link href="/account/settings" className="px-5 py-2 bg-brand-ink text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">Add Address</Link>
              </div>
            )}
          </div>

          {/* Recently Viewed */}
          {user.recentlyViewed.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl font-bold text-brand-ink">Recently Viewed</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.recentlyViewed.map(rv => (
                  <Link key={rv.id} href={`/product/${rv.product.slug}`} className="group block bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-[4/5] bg-gray-100 relative">
                      <img 
                        src={rv.product.images.find(img => img.isCover)?.url || rv.product.images[0]?.url || ''} 
                        alt={rv.product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif font-medium text-brand-ink truncate text-sm">{rv.product.title}</h4>
                      <p className="text-brand-rose font-bold text-sm mt-1">₹{rv.product.sellingPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
