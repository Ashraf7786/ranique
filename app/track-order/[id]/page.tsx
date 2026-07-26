import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { 
  Package, Truck, CheckCircle2, MapPin, 
  ChevronLeft, AlertCircle, Calendar, Receipt
} from "lucide-react";

export const metadata: Metadata = {
  title: "Order Tracking | Ranique",
  description: "Track the status of your Ranique order.",
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const STATUS_STEPS = [
  { id: "PENDING", label: "Order Placed", icon: Package },
  { id: "CONFIRMED", label: "Confirmed", icon: Receipt },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

export default async function OrderTrackingDetailsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { email } = await searchParams;

  if (!email || typeof email !== "string") {
    redirect("/track-order");
  }

  // Safely decode the ID (handles potential double encoding by Next.js router)
  let decodedId = decodeURIComponent(id);
  if (decodedId.includes("%")) {
    try { decodedId = decodeURIComponent(decodedId); } catch (e) {}
  }
  
  // Strip any leading non-alphanumeric characters (like #) the user might have pasted
  const cleanId = decodedId.replace(/^[^a-zA-Z0-9]+/, "");

  // Fetch the order from the database (supporting both full UUIDs and 8-character truncated IDs shown to users)
  const order = await prisma.order.findFirst({
    where: { 
      id: {
        startsWith: cleanId.toLowerCase()
      }
    },
    include: {
      user: {
        select: { email: true }
      },
      items: {
        include: {
          product: {
            select: {
              title: true,
              images: {
                where: { isCover: true },
                take: 1
              }
            }
          }
        }
      }
    }
  });

  // Verify order exists and email matches either the registered user's email or the shipping email
  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-semibold text-gray-900 mb-2">Order Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center">
          We couldn't find an order with ID "{decodedId}". Please check your order ID and try again.
        </p>
        <Link 
          href="/track-order" 
          className="bg-brand-ink text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Go Back
        </Link>
      </div>
    );
  }

  const orderEmail = order.shippingEmail || order.user.email;
  
  if (orderEmail.toLowerCase() !== email.toLowerCase()) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-semibold text-gray-900 mb-2">Verification Failed</h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center">
          The email address provided does not match the email associated with this order.
        </p>
        <Link 
          href="/track-order" 
          className="bg-brand-ink text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Try Again
        </Link>
      </div>
    );
  }

  // Calculate current step index
  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.id === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/track-order"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Track another order
          </Link>
          <div className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Order Meta Header */}
          <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Order ID</p>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-mono tracking-tight">#{order.id.slice(0, 8).toUpperCase()}</h1>
            </div>
            {isCancelled ? (
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-50 text-red-600 font-semibold text-sm border border-red-100 self-start md:self-auto">
                Order Cancelled
              </div>
            ) : (
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Expected Delivery</p>
                <p className="text-brand-ink font-semibold">
                  {order.deliveredAt 
                    ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                    : "Usually 3-5 business days"}
                </p>
              </div>
            )}
          </div>

          {/* Timeline Section */}
          <div className="p-6 md:p-12 border-b border-gray-100 bg-gray-50/30">
            <h2 className="text-lg font-serif font-semibold text-gray-900 mb-8 md:text-center">Tracking Status</h2>
            
            {isCancelled ? (
              <div className="text-center py-8">
                <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Order Cancelled</h3>
                <p className="text-gray-500 text-sm mt-1">This order has been cancelled and will not be delivered.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Connecting Line (Background) */}
                <div className="absolute top-6 left-6 md:left-[10%] md:right-[10%] bottom-6 md:bottom-auto md:top-6 w-0.5 md:w-auto md:h-0.5 bg-gray-200 z-0">
                  {/* Connecting Line (Active Progress) */}
                  {currentStatusIndex > 0 && (
                    <div 
                      className="absolute top-0 left-0 w-full md:h-full bg-brand-rose transition-all duration-700 ease-in-out"
                      style={{ 
                        // Mobile: Fill height based on steps completed
                        height: `var(--mobile-h, ${currentStatusIndex * 33.33}%)`,
                        // Desktop: Fill width based on steps completed
                        width: `var(--desktop-w, ${currentStatusIndex * 33.33}%)`,
                      }}
                    />
                  )}
                  {/* We use standard CSS to override inline styles via a style tag for responsive variables */}
                  <style>{`
                    @media (min-width: 768px) {
                      .bg-brand-rose { --mobile-h: 100%; }
                    }
                    @media (max-width: 767px) {
                      .bg-brand-rose { --desktop-w: 100%; }
                    }
                  `}</style>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:gap-0 md:px-[10%]">
                  {STATUS_STEPS.map((step, index) => {
                    const isCompleted = currentStatusIndex >= index;
                    const isActive = currentStatusIndex === index;
                    const Icon = step.icon;

                    return (
                      <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3 group relative z-10">
                        {/* Mobile connection line active state */}
                        {index > 0 && isCompleted && (
                          <div className="absolute -top-8 left-6 w-0.5 h-8 bg-brand-rose md:hidden -z-10" />
                        )}

                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 outline outline-4 outline-white transition-all duration-300
                          ${isCompleted 
                            ? "bg-brand-rose border-brand-rose text-white shadow-md shadow-brand-rose/20" 
                            : "bg-white border-gray-200 text-gray-300"}
                          ${isActive ? "scale-110" : ""}
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="md:text-center">
                          <p className={`font-semibold text-sm ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          {isActive && (
                            <p className="text-xs text-brand-rose font-medium mt-0.5 hidden md:block">Current Status</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Items */}
            <div className="p-6 md:p-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Items Ordered</h3>
              <div className="space-y-4">
                {order.items.map((item) => {
                  const product = item.product;
                  const image = product.images[0]?.url || "/images/placeholder.png";

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 relative">
                        <Image 
                          src={image}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{product.title}</p>
                        {item.sku && <p className="text-xs text-gray-500 mt-0.5 truncate">SKU: {item.sku}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-medium text-gray-500">Qty: {item.quantity}</span>
                          <span className="text-sm font-semibold text-gray-900">₹{item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping & Summary */}
            <div className="p-6 md:p-8 bg-gray-50/50">
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Shipping Details</h3>
                <div className="flex gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-slate" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{order.shippingName || "Customer"}</p>
                    {order.shippingLine1 ? (
                      <>
                        <p>{order.shippingLine1}</p>
                        {order.shippingLine2 && <p>{order.shippingLine2}</p>}
                        <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                        <p className="mt-1 font-medium">{order.shippingPhone}</p>
                      </>
                    ) : (
                      <p className="italic text-gray-400">No address provided</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{(order.totalAmount + order.couponDiscount + order.firstOrderDiscount).toFixed(2)}</span>
                  </div>
                  {(order.couponDiscount > 0 || order.firstOrderDiscount > 0) && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{(order.couponDiscount + order.firstOrderDiscount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-brand-ink">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  {order.paymentMethod && (
                    <p className="text-right text-xs text-gray-500 mt-1 uppercase font-medium tracking-wider">
                      Paid via {order.paymentMethod}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Support Banner */}
        <div className="bg-brand-ink rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-lg mb-1">Need help with this order?</h4>
            <p className="text-sm text-gray-300">Our support team is always ready to assist you.</p>
          </div>
          <Link 
            href="/contact" 
            className="bg-white text-brand-ink px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors shrink-0"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}
