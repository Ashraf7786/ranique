import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Clock, CheckCircle, XCircle, Plus } from "lucide-react";

export const metadata = { title: "Staff Dashboard | Ranique" };

export default async function StaffDashboardPage() {
  const session = await getServerSession(authOptions);
  const staffId = (session?.user as any)?.id;

  const [totalProducts, pendingRequests, approvedRequests, rejectedRequests, staffProfile] =
    await Promise.all([
      prisma.product.count({ where: { staffId } }),
      prisma.productEditRequest.count({ where: { staffId, status: "PENDING" } }),
      prisma.productEditRequest.count({ where: { staffId, status: "APPROVED" } }),
      prisma.productEditRequest.count({ where: { staffId, status: "REJECTED" } }),
      prisma.staffProfile.findUnique({ where: { userId: staffId } }),
    ]);

  const stats = [
    { label: "Products Listed", value: totalProducts, icon: Package, color: "text-brand-gold", bg: "bg-brand-gold/10" },
    { label: "Pending Edit Requests", value: pendingRequests, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Approved Edits", value: approvedRequests, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Rejected Edits", value: rejectedRequests, icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-serif font-bold text-brand-ink">Staff Dashboard</h1>
          {staffProfile && (
            <span className="font-mono text-sm font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
              {staffProfile.staffCode}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">Your product listing overview and edit request status.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${bg} flex items-center justify-center mb-2 md:mb-3`}>
              <Icon className={`w-4 h-4 md:w-5 md:h-5 ${color}`} />
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Link href="/staff/products/add"
          className="bg-brand-ink text-white rounded-xl p-5 md:p-6 flex items-center gap-4 hover:bg-brand-ink/90 transition-colors group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="font-semibold text-base">Add New Product</p>
            <p className="text-sm text-white/70">Goes live immediately</p>
          </div>
        </Link>
        <Link href="/staff/products"
          className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors flex-shrink-0">
            <Package className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-base text-gray-900">My Products</p>
            <p className="text-[11px] md:text-sm text-gray-500">View and manage your listings</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
