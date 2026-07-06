import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintButton from "./PrintButton";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/login");

  const resolvedParams = await params;

  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id, userId: (session.user as any).id },
    include: { items: { include: { product: true } }, user: true }
  });

  if (!order || (order.status !== "DELIVERED" && order.status !== "COMPLETED")) {
    redirect(`/account/orders/${resolvedParams.id}`);
  }

  const subtotal = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 print:bg-white print:p-0 print:py-0">
      <div className="max-w-4xl mx-auto">
        
        {/* Controls - Hidden when printing */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link href={`/account/orders/${order.id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-ink transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Order
          </Link>
          <PrintButton />
        </div>

        {/* Invoice Paper */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 sm:p-16 print:shadow-none print:border-none print:rounded-none print:p-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 pb-10">
            <div>
              <h1 className="font-serif text-4xl font-bold text-brand-ink tracking-tight">RANIQUE</h1>
              <p className="text-gray-500 mt-2 text-sm">Premium Skincare & Beauty</p>
              <div className="mt-6 text-sm text-gray-600 space-y-1">
                <p>123 Beauty Boulevard</p>
                <p>Mumbai, Maharashtra 400001</p>
                <p>India</p>
                <p>support@ranique.com</p>
              </div>
            </div>
            <div className="mt-8 sm:mt-0 sm:text-right">
              <h2 className="text-3xl font-light text-gray-300 uppercase tracking-widest mb-4">Invoice</h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between sm:justify-end gap-8">
                  <span className="text-gray-500">Invoice No:</span>
                  <span className="font-medium text-brand-ink">INV-{order.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-8">
                  <span className="text-gray-500">Invoice Date:</span>
                  <span className="font-medium text-brand-ink">{new Date(order.deliveredAt || order.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-8">
                  <span className="text-gray-500">Order No:</span>
                  <span className="font-medium text-brand-ink">#{order.id.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 py-10">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Billed To</h3>
              <div className="text-sm text-gray-800 space-y-1">
                <p className="font-bold text-brand-ink">{order.user.firstName} {order.user.lastName}</p>
                <p>{order.user.email}</p>
                {order.user.mobileNumber && <p>{order.user.mobileNumber}</p>}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shipped To</h3>
              <div className="text-sm text-gray-800 space-y-1">
                <p className="font-bold text-brand-ink">{order.shippingName}</p>
                <p>{order.shippingLine1}</p>
                {order.shippingLine2 && <p>{order.shippingLine2}</p>}
                <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                <p>{order.shippingCountry}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs border-y border-gray-200">
                <tr>
                  <th className="py-4 px-4 font-semibold">Item Description</th>
                  <th className="py-4 px-4 font-semibold text-center">Qty</th>
                  <th className="py-4 px-4 font-semibold text-right">Price</th>
                  <th className="py-4 px-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item: any) => (
                  <tr key={item.id} className="text-gray-800">
                    <td className="py-5 px-4">
                      <p className="font-medium text-brand-ink">{item.product.title || item.product.name}</p>
                      <p className="text-gray-500 text-xs mt-1">SKU: {item.product.sku}</p>
                    </td>
                    <td className="py-5 px-4 text-center">{item.quantity}</td>
                    <td className="py-5 px-4 text-right">₹{item.price.toLocaleString("en-IN")}</td>
                    <td className="py-5 px-4 text-right font-medium text-brand-ink">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-8 pb-10 border-b border-gray-200">
            <div className="w-full sm:w-1/2 space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping & Discounts</span>
                <span>₹{(order.totalAmount - subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-brand-ink pt-4 border-t border-gray-100">
                <span>Total Amount</span>
                <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-10 text-center">
            <p className="text-xl font-serif text-brand-ink italic mb-2">Thank you for your purchase.</p>
            <p className="text-xs text-gray-400">If you have any questions concerning this invoice, contact our support.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
