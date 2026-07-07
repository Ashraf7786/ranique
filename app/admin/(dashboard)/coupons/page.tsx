import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CouponDataTable } from "@/components/admin/CouponDataTable";
import { Ticket } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Manage Coupons | Admin Dashboard",
  description: "Manage discount coupons for your store.",
};

export const revalidate = 0;

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const products = await prisma.product.findMany({
    select: { id: true, title: true },
    where: { deletedAt: null },
    orderBy: { title: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-brand-rose" />
            Coupons
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage discount codes for your customers.
          </p>
        </div>
      </div>

      <CouponDataTable initialCoupons={coupons} products={products} />
    </div>
  );
}
