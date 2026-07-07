import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Ranique",
  description: "Learn about Ranique's shipping methods, delivery timelines, and costs.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-sand/30 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-brand-border/30 p-8 sm:p-12 lg:p-16">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ink mb-8 text-center border-b border-gray-100 pb-8">Shipping Policy</h1>
        
        <div className="prose prose-brand max-w-none text-gray-600">
          <p className="lead text-lg mb-8 text-brand-ink">
            At Ranique, we are committed to delivering your favorite premium cosmetics and accessories safely and on time. We partner with reliable courier services to ensure a seamless unboxing experience.
          </p>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">1. Processing Time</h2>
          <p>
            All orders are processed within <strong>24 to 48 business hours</strong> (excluding Sundays and national holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped containing your tracking link.
          </p>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">2. Shipping Rates & Delivery Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Prepaid Orders above ₹999:</strong> Free Standard Shipping (3-7 Business Days)</li>
            <li><strong>Prepaid Orders below ₹999:</strong> Flat ₹99 Shipping (3-7 Business Days)</li>
            <li><strong>Cash on Delivery (COD):</strong> Same conditions apply. Please note that high-value orders may require a small advance payment to confirm the COD booking.</li>
          </ul>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">3. Shipment Tracking</h2>
          <p>
            Once your order has dispatched, you will receive a Shipment Confirmation email and SMS containing your tracking number(s). The tracking link will be active within 24 hours.
          </p>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">4. Delivery Issues & Delays</h2>
          <p>
            While we strive for timely deliveries, occasional delays may occur due to unforeseen circumstances (e.g., severe weather, regional lockdowns, or high courier volume). If your order is significantly delayed, please contact our support team, and we will escalate the issue with our logistics partners.
          </p>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">5. Missing or Damaged Packages</h2>
          <p>
            If your order arrives damaged in transit, please DO NOT accept the package from the courier if the outer box is completely crushed or torn. If you notice damage after opening, you must share an <strong>unboxing video</strong> within 48 hours to claim a replacement. 
          </p>

          <hr className="my-10 border-gray-100" />
          
          <p className="text-sm text-gray-500">
            For more information regarding shipping, please reach out to us at <a href="mailto:support@ranique.in" className="text-brand-rose hover:underline">support@ranique.in</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
