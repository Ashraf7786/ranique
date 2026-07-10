import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Clock, CheckCircle, Edit2 } from "lucide-react";

export const metadata = { title: "My Products | Staff" };

export default async function StaffProductsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const session = await getServerSession(authOptions);
  const staffId = (session?.user as any)?.id;
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { staffId, deletedAt: null },
      include: {
        images: { where: { isCover: true }, take: 1 },
        editRequests: {
          where: { status: "PENDING" },
          take: 1,
        },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where: { staffId, deletedAt: null } }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-ink">My Products</h1>
          <p className="text-sm text-gray-500 mt-1">{total} product{total !== 1 ? "s" : ""} listed by you</p>
        </div>
        <Link
          href="/staff/products/add"
          className="bg-brand-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-ink/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">S.No.</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Edit Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                  No products yet.{" "}
                  <Link href="/staff/products/add" className="text-brand-gold font-medium hover:underline">
                    Add your first product →
                  </Link>
                </td>
              </tr>
            ) : products.map((p, idx) => {
              const cover = p.images[0];
              const hasPendingEdit = p.editRequests.length > 0;

              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {cover ? (
                          <Image src={cover.url} alt={p.title} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">?</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.title}</p>
                        <p className="text-xs text-gray-400 font-mono">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.category?.name || "—"}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{p.sellingPrice.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    {hasPendingEdit ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700">
                        <Clock className="w-3 h-3" />
                        Pending Verification
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Verified Edit
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/staff/products/${p.id}/edit`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-brand-ink transition-colors border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
            <p className="text-sm text-gray-700">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Link href={page > 1 ? `?page=${page - 1}` : "#"}
                className={`px-3 py-1 text-sm border border-gray-300 rounded-md ${page <= 1 ? "opacity-50 pointer-events-none" : "hover:bg-gray-50"}`}>
                Previous
              </Link>
              <Link href={page < totalPages ? `?page=${page + 1}` : "#"}
                className={`px-3 py-1 text-sm border border-gray-300 rounded-md ${page >= totalPages ? "opacity-50 pointer-events-none" : "hover:bg-gray-50"}`}>
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
