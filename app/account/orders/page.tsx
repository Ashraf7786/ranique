import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Filter, Package } from "lucide-react";
import { formatDateIST } from "@/lib/utils";

export default async function OrdersPage() {
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
        include: {
          items: {
            include: { product: { include: { images: true } } },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {user.orders.length} order{user.orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
      </div>

      {user.orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-5">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Looks like you haven&apos;t made your first purchase yet. Explore our collection to find something you love!
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
        <div className="space-y-4">
          {user.orders.map((order) => {
            const statusClass =
              statusColors[order.status] ||
              "bg-gray-50 text-gray-600 border-gray-200";
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="bg-gray-50/80 px-5 sm:px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                          Order ID
                        </p>
                        <p className="font-bold text-gray-900 text-sm">
                          #{order.id.slice(-10).toUpperCase()}
                        </p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-200" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                          Date
                        </p>
                        <p className="font-medium text-gray-700 text-sm">
                          {formatDateIST(order.createdAt, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-200" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                          Total
                        </p>
                        <p className="font-bold text-gray-900 text-sm">
                          ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-200" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                          Payment
                        </p>
                        <p className="font-medium text-gray-700 text-sm">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusClass}`}
                      >
                        {order.status}
                      </span>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all"
                      >
                        View Details
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-5 sm:px-6 divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 flex items-center gap-4"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <img
                          src={
                            item.product.images.find((img) => img.isCover)
                              ?.url ||
                            item.product.images[0]?.url ||
                            ""
                          }
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-medium text-gray-900 text-sm sm:text-base hover:text-[#b76e79] transition-colors line-clamp-2"
                        >
                          {item.product.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                            Qty: {item.quantity}
                          </span>
                          {item.size && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900 text-sm sm:text-base">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
