"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, ArrowUpDown, DollarSign, Activity, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export function TransactionDataTable() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({ totalRevenue: 0, successfulCount: 0, pendingCount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, methodFilter]);

  const fetchTransactions = async (searchQuery = search) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/transactions?search=${encodeURIComponent(searchQuery)}&status=${statusFilter}&method=${methodFilter}`);
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.orders);
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  const formatIST = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">₹{metrics.totalRevenue.toLocaleString('en-IN')}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Successful Payments</p>
            <h3 className="text-2xl font-bold text-gray-900">{metrics.successfulCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending/Processing</p>
            <h3 className="text-2xl font-bold text-gray-900">{metrics.pendingCount}</h3>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, Name, or Razorpay ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 rounded-xl text-sm transition-all outline-none"
          />
        </form>
        <div className="flex gap-2">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-brand-rose rounded-xl text-sm font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All Methods</option>
            <option value="ONLINE">Online (Razorpay)</option>
            <option value="COD">Cash on Delivery</option>
            <option value="WHATSAPP">WhatsApp</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-brand-rose rounded-xl text-sm font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment Info</th>
                <th className="px-6 py-4">Date (IST)</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{t.shippingName}</div>
                      <div className="text-xs text-gray-500">{t.user?.email || "Guest"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">₹{t.totalAmount.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        t.status === 'CONFIRMED' || t.status === 'SHIPPED' || t.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        t.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                          t.paymentMethod === 'ONLINE' ? 'border-brand-rose text-brand-rose bg-brand-rose/5' :
                          t.paymentMethod === 'COD' ? 'border-gray-800 text-gray-800 bg-gray-50' :
                          'border-green-600 text-green-600 bg-green-50'
                        }`}>
                          {t.paymentMethod}
                        </span>
                        {t.razorpayPaymentId && (
                          <span className="text-xs text-gray-500 font-mono" title={t.razorpayPaymentId}>
                            {t.razorpayPaymentId.slice(0, 12)}...
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatIST(t.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link href={`/admin/orders?search=${t.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-brand-rose hover:text-brand-rose-light">
                        View Order <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
