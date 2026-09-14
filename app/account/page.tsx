import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  Phone,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { FlashMessage } from "@/components/account/FlashMessage";
import { formatDateIST } from "@/lib/utils";

export default async function AccountDashboardPage() {
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
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          items: {
            include: { product: { include: { images: true } } },
            take: 2,
          },
        },
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
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const totalOrders = user.orders.length;
  const wishlistCount = user.wishlist?.items?.length ?? 0;
  const deliveredOrders = user.orders.filter(
    (o) => o.status === "DELIVERED"
  ).length;
  const totalSpent = user.orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
    SHIPPED: "bg-cyan-50 text-cyan-700 border-cyan-200",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
    RETURNED: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <FlashMessage />

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#b76e79] via-[#c98a93] to-[#d4a0a8] rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.07]">
          <svg className="w-full h-full" viewBox="0 0 600 200">
            <defs>
              <pattern
                id="grid"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="600" height="200" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative blob */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-8 -bottom-12 w-32 h-32 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-yellow-200" />
            <span className="text-sm font-medium text-white/80">
              Welcome back
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
            Hello, {user.firstName || "there"}!
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-lg">
            Manage your orders, track shipments, and update your personal
            details — all in one place.
          </p>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Orders</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
          <p className="text-xs text-gray-500 mt-0.5">Delivered</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{wishlistCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Wishlist Items</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{totalSpent.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Total Spent</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Recent Orders
            </h3>
          </div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#b76e79] hover:text-[#9c5a63] transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {user.orders.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No orders yet</p>
            <p className="text-gray-400 text-sm mb-5">
              Start shopping to see your orders here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {user.orders.map((order) => {
              const statusClass =
                statusColors[order.status] ||
                "bg-gray-50 text-gray-600 border-gray-200";
              return (
                <div
                  key={order.id}
                  className="px-5 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Product thumbnails */}
                      <div className="flex -space-x-2 shrink-0">
                        {order.items.slice(0, 2).map((item, i) => (
                          <div
                            key={item.id}
                            className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm"
                            style={{ zIndex: 2 - i }}
                          >
                            <img
                              src={
                                item.product.images.find(
                                  (img) => img.isCover
                                )?.url ||
                                item.product.images[0]?.url ||
                                ""
                              }
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="w-11 h-11 rounded-xl bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-500">
                            +{order.items.length - 2}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateIST(order.createdAt, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          {" · "}
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 sm:shrink-0">
                      <span
                        className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusClass}`}
                      >
                        {order.status}
                      </span>
                      <span className="font-bold text-gray-900 text-sm tabular-nums">
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </span>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Row: Address + Wishlist Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Saved Address */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Default Address
              </h3>
            </div>
            <Link
              href="/account/settings"
              className="text-xs font-semibold text-[#b76e79] hover:text-[#9c5a63] transition-colors uppercase tracking-wider"
            >
              Edit
            </Link>
          </div>
          {user.addresses && user.addresses.length > 0 ? (
            <div className="p-5 sm:p-6">
              {user.addresses
                .filter((a) => a.isDefault)
                .slice(0, 1)
                .map((address) => (
                  <div key={address.id} className="space-y-2">
                    <p className="font-semibold text-gray-900">
                      {address.name}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}
                      <br />
                      {address.city}, {address.state} — {address.zip}
                      <br />
                      {address.country}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 pt-1">
                      <Phone className="w-3.5 h-3.5" />
                      {address.phone}
                    </div>
                  </div>
                ))}
              {user.addresses.filter((a) => a.isDefault).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    No default address set.
                  </p>
                  <Link
                    href="/account/settings"
                    className="text-sm text-[#b76e79] font-medium mt-1 inline-block"
                  >
                    Set one now →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 mb-3">
                No saved addresses yet.
              </p>
              <Link
                href="/account/settings"
                className="text-sm font-medium text-[#b76e79] hover:text-[#9c5a63]"
              >
                Add your first address →
              </Link>
            </div>
          )}
        </div>

        {/* Wishlist Preview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-gray-400" />
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Wishlist
              </h3>
            </div>
            <Link
              href="/account/wishlist"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#b76e79] hover:text-[#9c5a63] transition-colors uppercase tracking-wider"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {(user.wishlist?.items?.length ?? 0) > 0 ? (
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-3">
                {user.wishlist!.items.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.product.slug}`}
                    className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img
                        src={
                          item.product.images.find((img) => img.isCover)
                            ?.url ||
                          item.product.images[0]?.url ||
                          ""
                        }
                        alt={item.product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {item.product.title}
                      </p>
                      <p className="text-xs font-bold text-[#b76e79]">
                        ₹
                        {Number(item.product.sellingPrice).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-pink-300" />
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Your wishlist is empty.
              </p>
              <Link
                href="/shop"
                className="text-sm font-medium text-[#b76e79] hover:text-[#9c5a63]"
              >
                Discover products →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed */}
      {user.recentlyViewed.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Recently Viewed
            </h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {user.recentlyViewed.map((rv) => (
                <Link
                  key={rv.id}
                  href={`/product/${rv.product.slug}`}
                  className="group block bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={
                        rv.product.images.find((img) => img.isCover)?.url ||
                        rv.product.images[0]?.url ||
                        ""
                      }
                      alt={rv.product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-medium text-gray-900 truncate">
                      {rv.product.title}
                    </h4>
                    <p className="text-xs font-bold text-[#b76e79] mt-1">
                      ₹
                      {Number(rv.product.sellingPrice).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
