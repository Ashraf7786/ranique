import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, PackageSearch, Truck, Gift, Home, Banknote, Smartphone, CreditCard, Building2, Package, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "My Orders | Ranique — Track Your Order",
  description:
    "Track your Ranique order status or place a new order via WhatsApp. COD available across India including Tier 2, Tier 3 cities, and villages.",
  keywords: ["Ranique order tracking", "track order India", "WhatsApp order status", "COD order India"],
  openGraph: {
    title: "My Orders | Ranique",
    description: "Track your Ranique orders. Order via WhatsApp with COD available pan-India.",
    type: "website",
    locale: "en_IN",
  },
};

const WA_NUMBER = "919288467633";
const WA_TRACK_MSG = encodeURIComponent("Hii Ranique! 🌸 Mujhe apna order track karna hai. Order ID: ");
const WA_NEW_ORDER_MSG = encodeURIComponent("Hii Ranique! 🌸 Mujhe ek naya order place karna hai.");

const ORDER_STEPS = [
  { icon: CheckCircle2, label: "Order Confirmed", desc: "Aapka order receive ho gaya" },
  { icon: PackageSearch, label: "Packing in Progress", desc: "Hum aapka order pack kar rahe hain" },
  { icon: Truck, label: "Shipped", desc: "Order dispatch ho gaya — tracking link milega" },
  { icon: Gift, label: "Out for Delivery", desc: "Aaj aapke paas pahunch jaayega!" },
  { icon: Home, label: "Delivered", desc: "Order pahunch gaya! Enjoy karein 💕" },
];

const PAYMENT_MODES = [
  { icon: Banknote, label: "Cash on Delivery", desc: "Sabse popular — order aane pe pay karo" },
  { icon: Smartphone, label: "UPI / PhonePe / GPay", desc: "Instant payment — koi charges nahi" },
  { icon: CreditCard, label: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay sab chalega" },
  { icon: Building2, label: "Net Banking", desc: "Direct bank transfer" },
];

export default function OrdersPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blush via-white to-brand-gold-light/30 py-20">
        <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
            My Orders
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-brand-ink mb-4">
            Apna Order{" "}
            <em className="not-italic text-brand-rose">Track Karein</em>
          </h1>
          <p className="font-sans text-base text-brand-slate max-w-xl mx-auto">
            Abhi hum WhatsApp pe orders handle karte hain — iska fayda ye hai ki aap seedha humse baat kar ke real-time update paa sakte hain! 🚚
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">

        {/* ── Track Order Card ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6 sm:p-8 max-w-2xl mx-auto text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-brand-rose" />
          <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">Order Track Karna Hai?</h2>
          <p className="font-sans text-sm text-brand-slate mb-6 leading-relaxed">
            WhatsApp pe apna <strong className="text-brand-ink">Order ID ya naam</strong> bhejo — hum turant shipping update de denge. Tracking link bhi milega jab order dispatch ho jaaye!
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_TRACK_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#25D366] text-white font-sans font-semibold text-sm hover:brightness-105 active:scale-95 transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp pe Track Karo
          </a>
          <p className="font-sans text-xs text-brand-slate mt-3">
            +91 92884 67633 · Working hours: Mon–Sat 9 AM–8 PM
          </p>
        </div>

        {/* ── Order Status Timeline ─────────────────────────────────── */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-xl font-semibold text-brand-ink text-center mb-6">
            Order Ka Safar
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-4 bottom-4 w-px bg-brand-border" />
            <div className="space-y-6">
              {ORDER_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-start gap-5 pl-1">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-brand-border flex items-center justify-center text-xl shrink-0 shadow-sm text-brand-ink">
                    <step.icon className="w-5 h-5 text-brand-rose" />
                  </div>
                  <div className="pt-1.5 pb-4">
                    <p className="font-sans font-semibold text-sm text-brand-ink">{step.label}</p>
                    <p className="font-sans text-xs text-brand-slate mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Payment Methods ───────────────────────────────────────── */}
        <section className="bg-brand-mist rounded-2xl border border-brand-border p-6 sm:p-8 max-w-3xl mx-auto">
          <h2 className="font-serif text-xl font-semibold text-brand-ink text-center mb-2">
            Payment Ke Tarike
          </h2>
          <p className="font-sans text-xs text-brand-slate text-center mb-6">
            Koi bhi option choose karo — sab secure hain! COD bhi available hai 🎉
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PAYMENT_MODES.map((m) => (
              <div key={m.label} className="bg-white rounded-xl border border-brand-border p-4 text-center hover:border-brand-rose hover:shadow-card transition-all duration-200">
                <m.icon className="w-8 h-8 text-brand-rose mx-auto mb-3" />
                <p className="font-sans font-semibold text-xs text-brand-ink">{m.label}</p>
                <p className="font-sans text-[10px] text-brand-slate mt-1 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-xl bg-brand-blush border border-brand-rose-light flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-rose" />
            <p className="font-sans text-xs text-brand-rose-dark font-semibold">
              100% Secure Payment · GST Registered Business · ₹999+ pe Free Shipping
            </p>
          </div>
        </section>

        {/* ── New Order CTA ─────────────────────────────────────────── */}
        <div className="text-center py-6">
          <p className="font-sans text-sm text-brand-slate mb-4">Naya order karna hai?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center h-11 px-7 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm"
            >
              Products Browse Karo
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_NEW_ORDER_MSG}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center h-11 px-7 rounded-full border border-brand-border bg-white text-brand-ink font-sans font-semibold text-sm hover:border-brand-rose hover:text-brand-rose active:scale-95 transition-all"
            >
              WhatsApp pe Order Karo
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
