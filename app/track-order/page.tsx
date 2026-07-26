import { Metadata } from "next";
import { TrackOrderForm } from "@/components/orders/TrackOrderForm";
import { MapPin, Package, Truck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Track Your Order | Ranique",
  description: "Track the status of your Ranique order using your Order ID and Email Address.",
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-5xl font-semibold text-brand-ink mb-4">
            Track Your <em className="text-brand-rose not-italic">Order</em>
          </h1>
          <p className="text-brand-slate max-w-xl mx-auto text-sm md:text-base">
            Enter your Order ID and the Email Address used during checkout to get real-time updates on your delivery status.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* Left Side: Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <TrackOrderForm />
          </div>

          {/* Right Side: Visuals/Info */}
          <div className="w-full md:w-1/2 bg-brand-rose/5 p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100">
            <h3 className="font-serif text-xl font-medium text-brand-ink mb-6">
              How it works
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 bg-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm text-brand-rose">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Order Placed</h4>
                  <p className="text-xs text-gray-500 mt-1">We receive your order and begin processing it immediately.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1 bg-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm text-orange-500">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Shipped</h4>
                  <p className="text-xs text-gray-500 mt-1">Your package is handed over to our trusted delivery partners.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 bg-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm text-brand-slate">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Out for Delivery</h4>
                  <p className="text-xs text-gray-500 mt-1">The delivery executive is on the way to your address.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 bg-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Delivered</h4>
                  <p className="text-xs text-gray-500 mt-1">Your beautiful order has reached you successfully.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
