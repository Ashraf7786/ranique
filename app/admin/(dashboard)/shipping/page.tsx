import { prisma } from "@/lib/prisma";
import { DelhiveryPanel } from "@/components/admin/DelhiveryPanel";
import { Truck } from "lucide-react";

export const metadata = {
  title: "Delhivery Shipping | Admin",
};

// Always fetch fresh — never serve a cached version for this logistics page
export const dynamic = "force-dynamic";

export default async function DelhiveryShippingPage() {
  // Fetch orders that are CONFIRMED/ACCEPTED (ready to be shipped)
  // Also include already-manifested orders so admin can re-download labels
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["CONFIRMED", "SHIPPED"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      shippingName: true,
      shippingPhone: true,
      shippingCity: true,
      shippingState: true,
      shippingZip: true,
      totalAmount: true,
      paymentMethod: true,
      deliveryAwb: true,
      deliveryStatus: true,
      deliveryLabelUrl: true,
      _count: { select: { items: true } },
    },
  });

  // Map Prisma result → component-safe shape.
  // Several fields are nullable in the DB schema (String?) so we coerce them
  // to string | null explicitly to satisfy the strict ShipOrder interface.
  const shipOrders = orders.map((o) => ({
    id: o.id,
    status: o.status,
    shippingName: o.shippingName,
    shippingPhone: o.shippingPhone,
    shippingCity: o.shippingCity,
    shippingState: o.shippingState,
    shippingZip: o.shippingZip,
    totalAmount: o.totalAmount,
    paymentMethod: o.paymentMethod ?? 'UNKNOWN', // String? in schema → coerce null
    deliveryAwb: o.deliveryAwb,
    deliveryStatus: o.deliveryStatus,
    deliveryLabelUrl: o.deliveryLabelUrl,
    itemCount: o._count.items,
  }));

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-11 h-11 bg-brand-blush rounded-xl flex items-center justify-center">
          <Truck className="w-5 h-5 text-brand-rose" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Delhivery Shipping
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage manifests and labels for all accepted orders
          </p>
        </div>
      </div>

      {/* How it works — collapsible info strip */}
      <div className="bg-gradient-to-r from-brand-ink/5 to-brand-rose/5 border border-brand-border rounded-xl p-4 mb-6 text-sm text-gray-600">
        <p className="font-semibold text-gray-800 mb-2">How this works</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Accept an order from the{" "}
            <a
              href="/admin/orders"
              className="text-brand-rose underline underline-offset-2"
            >
              Orders page
            </a>{" "}
            — it will appear below automatically.
          </li>
          <li>
            Click <strong>Ship Order</strong> → hit{" "}
            <strong>Create Manifest</strong> to register it with Delhivery and
            get an AWB tracking number.
          </li>
          <li>
            Then click <strong>Download Label PDF</strong> — it auto-downloads
            to your device. Print and stick it on the package.
          </li>
        </ol>
      </div>

      <DelhiveryPanel orders={shipOrders} />
    </div>
  );
}
