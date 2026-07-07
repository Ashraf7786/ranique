"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import {
  ChevronRight, Package, MapPin, CreditCard,
  CheckCircle, ShoppingBag, Phone, Loader2
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingForm {
  name: string; phone: string; email: string;
  line1: string; line2: string; city: string;
  state: string; zip: string; country: string;
}

type Step = "address" | "payment" | "success";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepBadge({ label, icon: Icon, active, done, onClick }: { label: string; icon: any; active: boolean; done: boolean; onClick?: () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
      done ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer" :
      active ? "bg-brand-ink text-white shadow-md cursor-default" :
      "bg-gray-100 text-gray-400 cursor-default"
    }`}>
      {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}

// ─── Order Summary Sidebar ─────────────────────────────────────────────────

function OrderSummary({ 
  items, subtotal, shipping, discount, finalTotal, 
  couponCode, setCouponCode, applyCoupon, removeCoupon, 
  appliedCoupon, validatingCoupon, discountLabel, couponError
}: { 
  items: any[]; subtotal: number; shipping: number; discount: number; finalTotal: number;
  couponCode: string; setCouponCode: (c: string) => void; applyCoupon: () => void; 
  removeCoupon: () => void; appliedCoupon: any; validatingCoupon: boolean;
  discountLabel: string; couponError: string | null;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
      <h3 className="font-serif text-lg font-bold text-brand-ink mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-brand-rose" /> Order Summary
      </h3>
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
        {items.map((item, index) => (
          <div key={item.id || `item-${index}`} className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
              {item.product?.images?.[0] ? (
                <img src={item.product.images[0].src || item.product.images[0].url} alt={item.product.name || item.product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-mist/50">
                  <ShoppingBag className="w-6 h-6 text-brand-rose opacity-50" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-ink line-clamp-1">{item.product?.name || item.product?.title}</p>
              {item.selectedColor && <p className="text-xs text-gray-400">{item.selectedColor.label || item.selectedColor.name}</p>}
              {item.selectedSize && <p className="text-xs text-gray-400">{item.selectedSize.label}</p>}
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-brand-ink shrink-0">
              ₹{(() => {
                const hasActiveOffer = item.product?.offer && item.product.offer.isActive && new Date(item.product.offer.endsAt) > new Date();
                const basePrice = hasActiveOffer ? item.product.offer.offerPrice : (item.product?.price || item.product?.sellingPrice || 0);
                const price = basePrice + (item.selectedColor?.priceModifier || 0);
                return (price * item.quantity).toLocaleString("en-IN");
              })()}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Discount ({discountLabel})</span>
          <span className="text-green-600 font-semibold">-₹{discount.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          {shipping === 0 ? (
            <span className="text-green-600 font-semibold">FREE</span>
          ) : (
            <span className="text-gray-900 font-semibold">₹{shipping}</span>
          )}
        </div>
        <div className="flex justify-between font-bold text-brand-ink pt-2 border-t border-gray-100 text-lg">
          <span>Total</span>
          <span>₹{finalTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Coupon Input Area */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        {appliedCoupon ? (
          <div className="bg-green-50 p-3 rounded-lg flex items-center justify-between border border-green-100">
            <div>
              <p className="text-sm font-semibold text-green-800">{appliedCoupon.couponCode} Applied</p>
              <p className="text-xs text-green-600">{appliedCoupon.message}</p>
            </div>
            <button onClick={removeCoupon} className="text-green-700 hover:text-green-900 text-sm font-medium">Remove</button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Coupon Code" 
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                className={`flex-1 px-3 py-2 border rounded-lg text-sm outline-none transition-all ${
                  couponError ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand-blush'
                }`}
              />
              <button 
                onClick={applyCoupon}
                disabled={validatingCoupon || !couponCode}
                className="px-4 py-2 bg-brand-ink text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {validatingCoupon ? "..." : "Apply"}
              </button>
            </div>
            {couponError && (
              <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1 fade-in duration-200">
                {couponError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// ─── Main checkout page ────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, totalPrice, clearCart, openCart } = useCart();

  const [step, setStep] = useState<Step>("address");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"WHATSAPP" | "ONLINE" | "COD" | null>(null);
  const [showCODConfirm, setShowCODConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(9 * 60); // 9 minutes in seconds

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Derived values
  const subtotal = totalPrice;
  const shipping = subtotal > 999 ? 0 : 99;
  
  let couponDiscount = 0;
  let firstOrderDiscount = 0;
  let discountLabels = [];

  if (appliedCoupon) {
    couponDiscount = appliedCoupon.discountAmount;
    discountLabels.push(`Coupon ${appliedCoupon.couponCode}`);
  } 
  
  if (isFirstOrder) {
    if (subtotal >= 1199) {
      firstOrderDiscount = Math.round(subtotal * 0.15);
      discountLabels.push("First Order 15%");
    } else {
      firstOrderDiscount = Math.round(subtotal * 0.10);
      discountLabels.push("First Order 10%");
    }
  }

  const discount = couponDiscount + firstOrderDiscount;
  const discountLabel = discountLabels.join(" + ");

  // Clear coupon if cart changes
  useEffect(() => {
    if (appliedCoupon) {
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("Cart changed. Please re-apply your coupon.");
    }
  }, [totalPrice, items]);

  const finalTotal = subtotal + shipping - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: couponCode, 
          cartSubtotal: subtotal, 
          cartItems: items.map(i => ({ 
            productId: i.product.id, 
            price: (i.product as any).sellingPrice || i.product.price, 
            quantity: i.quantity 
          })) 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to validate coupon");
      setAppliedCoupon(data);
    } catch (e: any) {
      setCouponError(e.message);
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const [form, setForm] = useState<ShippingForm>({
    name: "", phone: "", email: "", line1: "", line2: "",
    city: "", state: "", zip: "", country: "India",
  });

  // Pre-fill from session or latest order
  useEffect(() => {
    async function loadAddress() {
      if (session?.user) {
        // Fallback defaults from session
        const defaultName = (session.user as any)?.name || `${(session.user as any)?.firstName || ""} ${(session.user as any)?.lastName || ""}`.trim();
        const defaultEmail = session.user?.email || "";

        try {
          const res = await fetch("/api/orders?latest=true");
          const latestOrder = await res.json();
          if (res.ok && latestOrder && latestOrder.shippingName) {
            setIsFirstOrder(false);
            setForm({
              name: latestOrder.shippingName,
              phone: latestOrder.shippingPhone || "",
              email: latestOrder.shippingEmail || defaultEmail,
              line1: latestOrder.shippingLine1 || "",
              line2: latestOrder.shippingLine2 || "",
              city: latestOrder.shippingCity || "",
              state: latestOrder.shippingState || "",
              zip: latestOrder.shippingZip || "",
              country: latestOrder.shippingCountry || "India",
            });
            return;
          } else {
            setIsFirstOrder(true);
          }
        } catch (error) {
          console.error("Failed to fetch latest order address", error);
          setIsFirstOrder(true);
        }

        // If no latest order, use session defaults
        setForm(prev => ({ ...prev, name: defaultName, email: defaultEmail }));
      }
    }
    loadAddress();
  }, [session]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || step === "success") return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Redirect if not logged in
  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-rose" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="w-16 h-16 text-brand-rose" />
        <h2 className="font-serif text-2xl font-bold text-brand-ink">Please sign in to checkout</h2>
        <p className="text-gray-500 text-center">You need to be logged in to place an order.</p>
        <Link href={`/login?callbackUrl=/checkout`} className="px-8 py-3 bg-brand-ink text-white font-medium rounded-full hover:bg-gray-900 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="w-16 h-16 text-brand-rose" />
        <h2 className="font-serif text-2xl font-bold text-brand-ink">Your bag is empty</h2>
        <Link href="/shop" className="px-8 py-3 bg-brand-ink text-white font-medium rounded-full hover:bg-gray-900 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ── Validation ────────────────────────────────────────────────────────────

  const validateAddress = (): boolean => {
    const newErrors: Partial<ShippingForm> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.phone.trim() || !/^\+?[\d\s\-]{8,15}$/.test(form.phone)) newErrors.phone = "Valid phone number is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email is required";
    if (!form.line1.trim()) newErrors.line1 = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.zip.trim() || !/^\d{4,10}$/.test(form.zip)) newErrors.zip = "Valid PIN code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Place order ──────────────────────────────────────────────────────────

  const placeOrder = async (method: "WHATSAPP" | "ONLINE" | "COD", skipConfirm = false) => {
    if (method === "COD" && !skipConfirm) {
      setShowCODConfirm(true);
      return;
    }

    if (method === "COD") {
      setShowCODConfirm(false);
    }

    setPaymentMethod(method);
    setLoading(true);

    const orderItems = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    if (method === "ONLINE") {
      try {
        const loadScript = () => {
          return new Promise((resolve) => {
            if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
              resolve(true);
              return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const isLoaded = await loadScript();
        if (!isLoaded) throw new Error("Razorpay SDK failed to load. Are you online?");

        const orderRes = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: finalTotal }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.message || "Failed to initiate Razorpay order");

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Ranique",
          description: "Premium Ladies' Boutique",
          order_id: orderData.order_id,
          handler: async function (response: any) {
            try {
              const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: orderItems,
                  shippingAddress: form,
                  paymentMethod: method,
                  totalAmount: finalTotal,
                  couponCode: appliedCoupon?.couponCode || null,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Failed to save order");

              setOrderId(data.orderId);
              clearCart();
              setStep("success");
            } catch (err: any) {
              console.error(err);
              alert(err.message || "Payment succeeded but failed to save order. Contact support.");
              setLoading(false);
            }
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: "#0f172a", // brand-ink
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on("payment.failed", function (response: any) {
          alert("Payment Failed. Reason: " + response.error.description);
          setLoading(false);
        });
        paymentObject.open();
      } catch (err: any) {
        console.error(err);
        alert(err.message);
        setLoading(false);
      }
      return; // Stop here, Razorpay callback handles the rest
    }

    // Handle COD & WHATSAPP
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: form,
          paymentMethod: method,
          totalAmount: finalTotal,
          couponCode: appliedCoupon?.couponCode || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      const placedOrderId = data.orderId;
      setOrderId(placedOrderId);
      clearCart();
      setStep("success");

      // If WhatsApp, open WA after success with rich message
      if (method === "WHATSAPP") {
        // Build per-product lines with image, title, description, variant
        const productLines = items.map((item, idx) => {
          const i = item as any; // Bypass TS
          const p = i.product;
          const name = p.name || p.title || "Product";
          const desc = p.shortDescription || p.description || "";
          const price = (p.price || p.sellingPrice || 0);
          const lineTotal = (price * i.quantity).toLocaleString("en-IN");
          const color = i.selectedColor?.name ? `🎨 Colour: ${i.selectedColor.name}` : "";
          const size  = i.selectedSize?.name  ? `📐 Size: ${i.selectedSize.name}`   : "";
          const imgUrl = p.images?.[0]?.src || p.images?.[0]?.url || "";
          const imgLine = imgUrl ? `🖼️ Image: ${imgUrl}` : "";

          const lines = [
            `━━━━━━━━━━━━━━━━━━`,
            `📦 Item ${idx + 1}: *${name}*`,
            desc ? `📝 ${desc.slice(0, 120)}${desc.length > 120 ? "…" : ""}` : "",
            color,
            size,
            `🔢 Quantity: ${i.quantity}`,
            `💰 Price: ₹${price.toLocaleString("en-IN")} × ${i.quantity} = *₹${lineTotal}*`,
            imgLine,
          ].filter(Boolean).join("\n");

          return lines;
        }).join("\n");

        const msg = encodeURIComponent(
`🌸 *New Order — Ranique*
━━━━━━━━━━━━━━━━━━
🆔 Order ID: *#${placedOrderId.slice(-10).toUpperCase()}*
📅 Date: ${new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}

*🛍️ ORDER ITEMS*
${productLines}
━━━━━━━━━━━━━━━━━━
💳 *Payment Summary*
   Subtotal : ₹${subtotal.toLocaleString("en-IN")}
   Discount : -₹${discount.toLocaleString("en-IN")} (${discountLabel})
   Shipping : ${shipping === 0 ? "FREE 🎁" : `₹${shipping}`}
   *TOTAL   : ₹${finalTotal.toLocaleString("en-IN")}*

━━━━━━━━━━━━━━━━━━
📍 *SHIPPING ADDRESS*
   👤 Name    : ${form.name}
   📞 Phone   : ${form.phone}
   📧 Email   : ${form.email}
   🏠 Address : ${form.line1}${form.line2 ? ", " + form.line2 : ""}
   🏙️ City    : ${form.city}
   🗺️ State   : ${form.state} — ${form.zip}
   🌏 Country : ${form.country}

━━━━━━━━━━━━━━━━━━
💬 *Payment via WhatsApp*
Please confirm this order and share payment details. Thank you! 💕`
        );

        setTimeout(() => {
          window.open(`https://wa.me/919288467633?text=${msg}`, "_blank", "noopener,noreferrer");
        }, 1800);
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const set = (field: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field: keyof ShippingForm) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
      errors[field] ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-200 focus:ring-brand-rose focus:border-brand-rose"
    }`;

  // ─── Success Screen ───────────────────────────────────────────────────────

  if (step === "success") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-brand-sand via-white to-brand-blush">
        <div className="text-center space-y-6 max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="relative w-28 h-28 mx-auto">
            <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping opacity-40" style={{ animationDuration: "2s" }} />
          </div>

          <div>
            <h1 className="font-serif text-4xl font-bold text-brand-ink mb-2">🎉 Order Placed!</h1>
            <p className="text-gray-600 text-lg">Your order has been placed successfully!</p>
          </div>

          {orderId && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm text-gray-500">Your Order ID</p>
              <p className="text-2xl font-mono font-bold text-brand-rose tracking-widest mt-1">
                #{orderId.slice(-10).toUpperCase()}
              </p>
            </div>
          )}

          <p className="text-gray-500 text-sm">
            {paymentMethod === "WHATSAPP"
              ? "We've opened WhatsApp for you to confirm your order payment. Our team will get back to you soon! 💕"
              : "Your order is confirmed and will be shipped shortly. You'll receive an email confirmation."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/account/orders"
              className="px-6 py-3 bg-brand-ink text-white font-medium rounded-full hover:bg-gray-900 transition-colors shadow-sm"
            >
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 bg-white text-brand-ink font-medium rounded-full border border-gray-200 hover:border-brand-rose hover:text-brand-rose transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Checkout Layout ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold text-brand-ink hover:text-brand-rose transition-colors">Ranique</Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <StepBadge label="Cart" icon={ShoppingBag} active={false} done={true} onClick={openCart} />
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
            <StepBadge 
              label="Address" 
              icon={MapPin} 
              active={step === "address"} 
              done={step === "payment"} 
              onClick={step === "payment" ? () => setStep("address") : undefined} 
            />
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
            <StepBadge 
              label="Payment" 
              icon={CreditCard} 
              active={step === "payment"} 
              done={false} 
            />
          </div>
        </div>
      </div>

      <div className="bg-brand-rose/10 py-2 border-b border-brand-rose/20 text-center">
        <p className="text-sm font-medium text-brand-ink">
          ⏳ Checkout reserved for <span className="font-bold text-brand-rose">{formatTime(timeLeft)}</span> minutes! Complete your order now.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT: Forms ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── STEP 1: ADDRESS ──────────────────────────────────────── */}
            {step === "address" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="font-serif text-2xl font-bold text-brand-ink mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-rose text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input value={form.name} onChange={set("name")} className={inputClass("name")} placeholder="e.g. Mariyam Siddiqui" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Phone Number *</label>
                      <input value={form.phone} onChange={set("phone")} type="tel" className={inputClass("phone")} placeholder="+91 98765 43210" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email Address *</label>
                      <input value={form.email} onChange={set("email")} type="email" className={inputClass("email")} placeholder="you@example.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Address Line 1 *</label>
                    <input value={form.line1} onChange={set("line1")} className={inputClass("line1")} placeholder="House/Flat No., Building, Street" />
                    {errors.line1 && <p className="text-red-500 text-xs mt-1">{errors.line1}</p>}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Address Line 2 (Optional)</label>
                    <input value={form.line2} onChange={set("line2")} className={inputClass("line2")} placeholder="Landmark, Area, Colony" />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">City *</label>
                      <input value={form.city} onChange={set("city")} className={inputClass("city")} placeholder="e.g. Mumbai" />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">State *</label>
                      <select value={form.state} onChange={set("state")} className={inputClass("state")}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">PIN Code *</label>
                      <input value={form.zip} onChange={set("zip")} type="text" inputMode="numeric" maxLength={6} className={inputClass("zip")} placeholder="400001" />
                      {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Country</label>
                    <input value={form.country} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                </div>

                <button
                  onClick={() => { if (validateAddress()) setStep("payment"); }}
                  className="mt-8 w-full py-4 bg-brand-ink text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors shadow-sm flex items-center justify-center gap-2 text-base"
                >
                  Continue to Payment <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ── STEP 2: PAYMENT ──────────────────────────────────────── */}
            {step === "payment" && (
              <div className="space-y-6">
                {/* Filled address summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-brand-ink flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-rose" /> Shipping to
                    </h3>
                    <button onClick={() => setStep("address")} className="text-xs text-brand-rose font-medium hover:underline">Change</button>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{form.name}</p>
                  <p className="text-sm text-gray-500">{form.line1}{form.line2 ? `, ${form.line2}` : ""}</p>
                  <p className="text-sm text-gray-500">{form.city}, {form.state} - {form.zip}</p>
                  <p className="text-sm text-gray-500">{form.phone} | {form.email}</p>
                </div>

                {/* Payment Options */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                  <h2 className="font-serif text-2xl font-bold text-brand-ink mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-rose text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    Choose Payment
                  </h2>

                  <div className="space-y-4">
                    {/* WhatsApp */}
                    <div className="border-2 border-[#25D366]/30 rounded-2xl p-6 bg-[#25D366]/5 hover:border-[#25D366] transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-brand-ink text-lg">Order via WhatsApp</h4>
                          <p className="text-gray-600 text-sm mt-1">Place your order through WhatsApp. Our team will confirm and process your payment manually. Perfect for custom orders!</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">✓ Personal Service</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">✓ Flexible Payment</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">✓ Instant Confirmation</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => placeOrder("WHATSAPP")}
                        disabled={loading}
                        className="mt-5 w-full py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:brightness-105 transition-all shadow-sm flex items-center justify-center gap-2 text-base disabled:opacity-60"
                      >
                        {loading && paymentMethod === "WHATSAPP" ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Phone className="w-5 h-5" />
                        )}
                        Place Order & Open WhatsApp
                      </button>
                    </div>

                    {/* COD */}
                    <div className="border-2 border-brand-slate/20 rounded-2xl p-6 bg-brand-slate/5 hover:border-brand-slate/40 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-slate text-white flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-brand-ink text-lg">Cash on Delivery (COD)</h4>
                          <p className="text-gray-600 text-sm mt-1">Pay with cash when your order is delivered to your doorstep. Note: COD orders may take slightly longer to process.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => placeOrder("COD")}
                        disabled={loading}
                        className="mt-5 w-full py-3.5 bg-brand-ink text-white font-bold rounded-xl hover:bg-gray-900 transition-all shadow-sm flex items-center justify-center gap-2 text-base disabled:opacity-60"
                      >
                        {loading && paymentMethod === "COD" ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                        Place Order via COD
                      </button>
                    </div>

                    {/* Online payment (coming soon) */}
                    <div className="border-2 border-gray-100 rounded-2xl p-6 bg-gray-50 opacity-70 relative overflow-hidden">
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Coming Soon</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                          <CreditCard className="w-7 h-7 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-500 text-lg">Online Payment</h4>
                          <p className="text-gray-400 text-sm mt-1">Pay securely via UPI, Credit/Debit Card, Net Banking. (Launching soon!)</p>
                          <div className="flex gap-2 mt-3">
                            {["UPI", "Visa", "Mastercard", "RuPay"].map(m => (
                              <span key={m} className="px-2 py-1 bg-white border border-gray-200 text-gray-400 text-xs rounded-md">{m}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button disabled className="mt-5 w-full py-3.5 bg-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed text-base">
                        Online Payment — Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Summary ───────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <OrderSummary 
              items={items} 
              subtotal={subtotal} 
              shipping={shipping} 
              discount={discount} 
              finalTotal={finalTotal} 
              couponCode={couponCode}
              setCouponCode={(c) => { setCouponCode(c); setCouponError(null); }}
              applyCoupon={applyCoupon}
              removeCoupon={removeCoupon}
              appliedCoupon={appliedCoupon}
              validatingCoupon={validatingCoupon}
              discountLabel={discountLabel}
              couponError={couponError}
            />
          </div>
        </div>
      </div>

      {/* ── COD Confirmation Modal ────────────────────────────────────────────── */}
      {showCODConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-ink mb-2">Confirm Cash on Delivery</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Are you sure you want Cash on Delivery? <br/><br/>
              It takes some time to deliver. <strong>Use prepaid for fast delivery.</strong>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCODConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => placeOrder("COD", true)}
                className="flex-1 py-3 bg-brand-ink text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors shadow-sm"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
