import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy | Ranique",
  description: "Read about Ranique's order cancellation policy.",
};

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-sand/30 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-brand-border/30 p-8 sm:p-12 lg:p-16">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ink mb-8 text-center border-b border-gray-100 pb-8">Cancellation Policy</h1>
        
        <div className="prose prose-brand max-w-none text-gray-600">
          <p className="lead text-lg mb-8 text-brand-ink">
            We understand that you may occasionally change your mind after placing an order. Our cancellation policy is designed to be as flexible as possible while ensuring fast processing times for all customers.
          </p>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">1. Cancellations Before Dispatch</h2>
          <p>
            You can cancel your order free of charge <strong>before it has been dispatched</strong> from our warehouse. Typically, orders are dispatched within 24 hours of placement. 
          </p>
          <p>To cancel an order before dispatch:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Log in to your Ranique account, navigate to "My Orders," and click on the "Cancel Order" button next to your recent purchase.</li>
            <li>Alternatively, email us immediately at <strong>support@ranique.in</strong> or WhatsApp us with your Order ID.</li>
          </ul>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">2. Cancellations After Dispatch</h2>
          <p>
            Once an order has been handed over to our courier partner and a tracking number has been generated, it <strong>cannot be cancelled</strong> directly from the website.
          </p>
          <p>If you wish to cancel a dispatched order:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Prepaid Orders:</strong> You can refuse the delivery when the courier attempts to deliver it. Once the package is returned to our warehouse, we will initiate a refund to your original payment method, deducting a nominal flat fee of ₹100 for reverse shipping.</li>
            <li><strong>COD Orders:</strong> You may politely refuse the package at the time of delivery. However, repeated refusal of COD orders will result in the disabling of the COD option for your future purchases.</li>
          </ul>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">3. Cancellations by Ranique</h2>
          <p>
            Ranique reserves the right to cancel any order under the following circumstances:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>The product is suddenly out of stock or fails our quality check prior to dispatch.</li>
            <li>Inaccuracies or errors in product or pricing information on the website.</li>
            <li>Suspicion of fraudulent transactions.</li>
            <li>Service unserviceability at the provided delivery pin code.</li>
          </ul>
          <p>If your prepaid order is cancelled by us, you will receive a full 100% refund immediately.</p>

          <hr className="my-10 border-gray-100" />
          
          <p className="text-sm text-gray-500">
            For further assistance, please contact us at <a href="mailto:support@ranique.in" className="text-brand-rose hover:underline">support@ranique.in</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
