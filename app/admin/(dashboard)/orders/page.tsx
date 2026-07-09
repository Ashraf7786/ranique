import { prisma } from "@/lib/prisma";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Order Management | Admin",
};

export default async function OrdersAdminPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        user: {
          include: { addresses: true }
        },
        items: {
          include: { 
            product: {
              include: { images: true }
            }
          }
        }
      }
    }),
    prisma.order.count()
  ]);

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Order Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-sm">
                <th className="py-4 px-6 font-medium text-gray-500">Order ID</th>
                <th className="py-4 px-6 font-medium text-gray-500">Customer</th>
                <th className="py-4 px-6 font-medium text-gray-500 min-w-[200px]">Delivery Address</th>
                <th className="py-4 px-6 font-medium text-gray-500">Date</th>
                <th className="py-4 px-6 font-medium text-gray-500">Items</th>
                <th className="py-4 px-6 font-medium text-gray-500">Total Amount</th>
                <th className="py-4 px-6 font-medium text-gray-500">Payment Mode</th>
                <th className="py-4 px-6 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      #{order.id.slice(0, 8).toUpperCase()}
                      <div className="text-xs text-gray-500 mt-1">
                        {order.items.length} item(s)
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="font-medium text-gray-900">
                        {order.shippingName || (order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Unknown')}
                      </div>
                      <div className="text-xs text-gray-500">{order.shippingEmail || order.user?.email}</div>
                      <div className="text-xs text-gray-500">{order.shippingPhone || order.user?.mobileNumber || ''}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="text-xs text-gray-700 whitespace-pre-wrap">
                        {order.shippingLine1 ? (
                          <>
                            {order.shippingLine1}
                            {order.shippingLine2 ? `, ${order.shippingLine2}` : ''}
                            <br />
                            {order.shippingCity}, {order.shippingState} {order.shippingZip}
                          </>
                        ) : order.user?.addresses?.[0] ? (
                          <>
                            {order.user.addresses[0].line1}
                            {order.user.addresses[0].line2 ? `, ${order.user.addresses[0].line2}` : ''}
                            <br />
                            {order.user.addresses[0].city}, {order.user.addresses[0].state} {order.user.addresses[0].zip}
                          </>
                        ) : (
                          'Address not provided'
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex flex-col gap-3">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3">
                            {item.product?.images?.[0]?.url ? (
                              <img src={item.product.images[0].url} alt={item.product.title} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900 truncate max-w-[180px]">{item.product?.title || 'Unknown Product'}</div>
                              <div className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} • ₹{item.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded-sm border ${
                        order.paymentMethod === 'ONLINE' ? 'border-brand-rose text-brand-rose bg-brand-rose/5' :
                        order.paymentMethod === 'COD' ? 'border-gray-800 text-gray-800 bg-gray-50' :
                        'border-green-600 text-green-600 bg-green-50'
                      }`}>
                        {order.paymentMethod || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <Link
                href={page > 1 ? `?page=${page - 1}` : '#'}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${page <= 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              >
                Previous
              </Link>
              <Link
                href={page < totalPages ? `?page=${page + 1}` : '#'}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${page >= totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              >
                Next
              </Link>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(page * pageSize, totalOrders)}</span> of{' '}
                  <span className="font-medium">{totalOrders}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <Link
                    href={page > 1 ? `?page=${page - 1}` : '#'}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${page <= 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </Link>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                    Page {page} of {totalPages}
                  </span>
                  <Link
                    href={page < totalPages ? `?page=${page + 1}` : '#'}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${page >= totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
