import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Truck, CheckCircle, ShoppingBag, Receipt, Calendar, Phone } from "lucide-react";
import InvoiceButton from "./InvoiceButton";
import { formatDateIST } from "@/lib/utils";

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

  // Mathematical price breakdown
  const subtotal = order.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const discount = order.couponDiscount + order.firstOrderDiscount;
  const shipping = order.totalAmount - (subtotal - discount);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-ink mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-5 border-b border-gray-100 pb-6">
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-bold text-brand-ink truncate">Purchase Details</h1>
          <p className="text-gray-500 text-sm mt-1 flex flex-wrap items-center gap-2">
            <span>Order #{order.id.slice(-8).toUpperCase()}</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDateIST(order.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </p>
        </div>
        <div className="w-full sm:w-auto flex justify-start sm:justify-end">
          <InvoiceButton status={order.status} orderId={order.id} />
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Timeline & Items) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Timeline Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-brand-ink mb-8 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-brand-rose" /> Order Status Timeline
            </h2>
            
            <div className="relative border-l-2 border-gray-100 ml-4 pl-2 space-y-8 py-2">
              {steps.map((step) => {
                const isCompleted = order.status !== "CANCELLED" && currentStatusIndex >= step.index;
                const isCurrent = order.status !== "CANCELLED" && currentStatusIndex === step.index;
                const StepIcon = step.icon;
                
                return (
                  <div key={step.label} className="relative pl-10">
                    {/* Circle Node */}
                    <div className="absolute -left-[25px] top-0.5 flex items-center justify-center">
                      {isCurrent && order.status !== "DELIVERED" && order.status !== "COMPLETED" && (
                        <div className="absolute w-9 h-9 rounded-full bg-brand-rose/20 animate-ping"></div>
                      )}
                      <div className={`relative w-8 h-8 rounded-full flex items-center justify-center border-4 border-white z-10 shadow-sm transition-colors duration-300 ${
                        isCompleted ? "bg-brand-rose text-white" : "bg-gray-100 text-gray-400"
                      }`}>
                        <StepIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold text-sm ${isCompleted ? "text-brand-ink" : "text-gray-400"}`}>{step.label}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{step.sub}</p>
                      {(isCompleted && step.date) && (
                        <p className="text-[10px] text-gray-400 mt-1">{formatDateIST(step.date)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {order.status === "CANCELLED" && (
              <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold">✕</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Order Cancelled</p>
                  <p className="text-xs text-red-600/80 mt-0.5">This order has been cancelled and will not be delivered.</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Items Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-brand-ink mb-6 flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-brand-rose" /> Items Ordered
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0].url || item.product.images[0].src} alt={item.product.title || item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-mist/50">
                        <ShoppingBag className="w-8 h-8 text-brand-rose opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-brand-ink text-sm line-clamp-2">{item.product?.title || item.product?.name}</p>
                      <p className="text-gray-400 text-xs mt-1">SKU: {item.sku}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      <p className="font-bold text-brand-ink text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Column (Shipping & Payment) */}
        <div className="space-y-8">
          
          {/* Shipping Address Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-serif text-lg font-bold text-brand-ink mb-4 flex items-center gap-2">
              <MapPin className="w-4.5 h-4.5 text-brand-rose" /> Shipping Details
            </h3>
            <div className="text-sm text-gray-600 space-y-1.5 border-t border-gray-50 pt-3">
              <p className="font-semibold text-brand-ink">{order.shippingName}</p>
              <p>{order.shippingLine1}</p>
              {order.shippingLine2 && <p>{order.shippingLine2}</p>}
              <p>{order.shippingCity}, {order.shippingState} - {order.shippingZip}</p>
              <p>{order.shippingCountry}</p>
              <p className="pt-2 text-brand-rose font-semibold flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-rose shrink-0" />
                <a href={`tel:${order.shippingPhone}`} className="hover:underline">{order.shippingPhone}</a>
              </p>
            </div>
          </div>

          {/* Payment & Price Summary Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-serif text-lg font-bold text-brand-ink mb-4 flex items-center gap-2">
              <Receipt className="w-4.5 h-4.5 text-brand-rose" /> Payment Summary
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600 border-t border-gray-50 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="text-brand-rose font-semibold">FREE</span>
                ) : (
                  <span>₹{shipping.toLocaleString("en-IN")}</span>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center text-brand-ink">
                <span className="font-bold">Total Paid</span>
                <span className="font-serif text-lg font-bold">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Method</span>
              <span className="px-3 py-1 bg-brand-rose/10 text-brand-rose text-xs font-bold rounded-full uppercase tracking-wider">
                {order.paymentMethod}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
