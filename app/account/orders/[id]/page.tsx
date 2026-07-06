import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Truck, CheckCircle, ShoppingBag } from "lucide-react";
import InvoiceButton from "./InvoiceButton";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/login");

  const resolvedParams = await params;

  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id, userId: (session.user as any).id },
    include: { items: { include: { product: { include: { images: true } } } } }
  });

  if (!order) redirect("/account/orders");

  // Status index for timeline
  const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "COMPLETED"];
  let currentStatusIndex = statuses.indexOf(order.status);
  if (currentStatusIndex === -1 && order.status === "CANCELLED") {
    currentStatusIndex = -1;
  }

  // Generate timeline steps
  const steps = [
    { label: "Ordered Today", sub: "Your order is received", date: order.createdAt, icon: Package, index: 0 },
    { label: "Confirmed", sub: "Your order is confirmed", date: null, icon: CheckCircle, index: 1 },
    { label: "Shipped", sub: "Your order is being shipped", date: order.shippedAt, icon: Truck, index: 2 },
    { label: "Delivered", sub: "You have received your order", date: order.deliveredAt, icon: MapPin, index: 3 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-ink mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-5">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl font-bold text-brand-ink truncate">Purchase Details</h1>
          <p className="text-gray-500 text-sm mt-1 break-words">Order #{order.id.slice(-8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="w-full sm:w-auto flex justify-start sm:justify-end">
          <InvoiceButton status={order.status} orderId={order.id} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
        <h2 className="font-serif text-xl font-bold text-brand-ink mb-8">Timeline</h2>
        
        <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
          {steps.map((step, i) => {
            const isCompleted = order.status !== "CANCELLED" && currentStatusIndex >= step.index;
            const isCurrent = order.status !== "CANCELLED" && currentStatusIndex === step.index;
            
            return (
              <div key={step.label} className="relative pl-8">
                <div className="absolute -left-[13px] top-1 flex items-center justify-center">
                  {isCurrent && order.status !== "DELIVERED" && order.status !== "COMPLETED" && (
                    <div className="absolute w-6 h-6 rounded-full bg-brand-rose animate-ping opacity-40"></div>
                  )}
                  <div className={`relative w-6 h-6 rounded-full flex items-center justify-center border-4 border-white z-10 shadow-sm ${isCompleted ? "bg-brand-rose" : "bg-gray-200"}`}>
                    <div className={`w-2 h-2 rounded-full ${isCompleted ? "bg-white" : "bg-transparent"}`} />
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-bold ${isCompleted ? "text-brand-ink" : "text-gray-400"}`}>{step.label}</h4>
                  <p className="text-sm text-gray-500">{step.sub}</p>
                  {(isCompleted && step.date) && (
                    <p className="text-xs text-gray-400 mt-1">{new Date(step.date).toLocaleString()}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {order.status === "CANCELLED" && (
          <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <span className="text-xl">✕</span>
            </div>
            <div>
              <p className="font-bold">Order Cancelled</p>
              <p className="text-sm">This order has been cancelled and will not be delivered.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-serif text-lg font-bold text-brand-ink mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                  {item.product?.images?.[0] ? (
                    <img src={item.product.images[0].url || item.product.images[0].src} alt={item.product.title || item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-mist/50">
                      <ShoppingBag className="w-8 h-8 text-brand-rose opacity-50" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-brand-ink text-sm line-clamp-2">{item.product?.title || item.product?.name}</p>
                  <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                  <p className="font-bold text-brand-ink text-sm mt-1">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-serif text-lg font-bold text-brand-ink mb-4">Shipping Info</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-brand-ink">{order.shippingName}</p>
            <p>{order.shippingLine1}</p>
            {order.shippingLine2 && <p>{order.shippingLine2}</p>}
            <p>{order.shippingCity}, {order.shippingState} - {order.shippingZip}</p>
            <p>{order.shippingCountry}</p>
            <p className="mt-2 text-brand-ink font-medium flex items-center gap-2">📞 {order.shippingPhone}</p>
          </div>
          
          <h2 className="font-serif text-lg font-bold text-brand-ink mb-4 mt-6">Payment</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Method: <strong>{order.paymentMethod}</strong></p>
            <p>Total Amount: <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
