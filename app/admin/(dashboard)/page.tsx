import { Package, IndianRupee, Users, ShoppingCart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

export default async function AdminDashboard() {
  const totalOrders = await prisma.order.count();
  const totalProducts = await prisma.product.count();
  const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
  
  const revenueResult = await prisma.order.aggregate({
    _sum: { totalAmount: true }
  });
  const totalRevenue = revenueResult._sum.totalAmount || 0;

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const ordersLast30Days = await prisma.order.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'asc' }
  });

  const chartDataMap = new Map();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    chartDataMap.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
  }

  ordersLast30Days.forEach(order => {
    const dateStr = order.createdAt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    if (chartDataMap.has(dateStr)) {
      const dayData = chartDataMap.get(dateStr);
      dayData.revenue += order.totalAmount;
      dayData.orders += 1;
    }
  });

  const chartData = Array.from(chartDataMap.values());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-xl lg:text-2xl font-serif font-bold text-gray-900 mb-5 lg:mb-6">Dashboard</h1>
      
      {/* Metrics — 2 cols mobile, 4 cols large */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-100" },
          { label: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Products", value: totalProducts.toLocaleString(), icon: Package, color: "text-purple-600", bg: "bg-purple-100" },
          { label: "Customers", value: totalCustomers.toLocaleString(), icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 lg:gap-4 transition-transform hover:-translate-y-1 duration-200">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 shrink-0 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs lg:text-sm text-gray-500 font-medium truncate">{stat.label}</p>
              <h3 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <DashboardCharts data={chartData} />

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 lg:px-6 py-4 lg:py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-white text-sm">
                <th className="py-4 px-6 font-medium text-gray-500">Order ID</th>
                <th className="py-4 px-6 font-medium text-gray-500">Customer</th>
                <th className="py-4 px-6 font-medium text-gray-500">Date</th>
                <th className="py-4 px-6 font-medium text-gray-500">Amount</th>
                <th className="py-4 px-6 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">#{order.id.slice(0,8).toUpperCase()}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-brand-rose text-white flex items-center justify-center font-bold text-xs">
                          {order.user?.firstName?.charAt(0) || order.user?.email?.charAt(0).toUpperCase()}
                        </div>
                        {order.user?.firstName} {order.user?.lastName}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      &#x20B9;{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">No recent orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-ink">
                    #{order.id.slice(0,8).toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-brand-rose text-white flex items-center justify-center font-bold text-xs">
                    {order.user?.firstName?.charAt(0) || order.user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {order.user?.firstName} {order.user?.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="font-semibold text-gray-900">&#x20B9;{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500 text-sm">No recent orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
