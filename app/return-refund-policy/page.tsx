import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Ranique",
  description: "Read about Ranique's return, refund, and exchange policies.",
};

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-sand/30 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-brand-border/30 p-8 sm:p-12 lg:p-16">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ink mb-8 text-center border-b border-gray-100 pb-8">Return & Refund Policy</h1>
        
        <div className="prose prose-brand max-w-none text-gray-600">
          <p className="lead text-lg mb-8 text-brand-ink">
            We want you to love your Ranique purchase. However, if you are not completely satisfied, we are here to help. Please read our Return and Refund Policy carefully to understand your rights.
          </p>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">1. Eligibility for Returns</h2>
          <p>
            Due to strict hygiene standards, <strong>Cosmetics (including lipsticks, foundations, eyeliners) and personalized jewelry/bangles cannot be returned or exchanged</strong> once the original seal is broken or the product is used.
          </p>
          <p>You may return an item only if:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>You received an incorrect product.</li>
            <li>The product arrived damaged or defective.</li>
            <li>The item (such as a purse) is unused, with all original tags, packaging, and dust bags intact, within <strong>7 days</strong> of delivery.</li>
          </ul>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">2. The Unboxing Video Rule</h2>
          <p>
            To process a return for a damaged, defective, or missing item, you <strong>must provide an uninterrupted unboxing video</strong>. The video must clearly show the shipping label, the sealed package before opening, and the damaged item inside. Claims without an unboxing video will unfortunately be rejected to prevent fraud.
          </p>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">3. Return Process</h2>
          <p>To initiate a return:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-2">
            <li>Contact us at <strong>ranique.official@gmail.com</strong> within 48 hours of receiving your order.</li>
            <li>Provide your Order ID and attach the unboxing video/photos.</li>
            <li>Once approved, we will arrange a reverse pickup from your location. If reverse pickup is unavailable in your pin code, you may be asked to ship it back to us (we will reimburse the shipping cost up to ₹100).</li>
          </ol>

          <h2 className="text-xl font-bold text-brand-ink mt-8 mb-4">4. Refunds</h2>
          <p>
            Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Prepaid Orders:</strong> Refunds will be credited back to your original method of payment within 5-7 business days.</li>
            <li><strong>COD Orders:</strong> We will request your UPI ID or Bank Account details to process the refund.</li>
          </ul>
          <p className="mt-2 text-sm italic">Note: Shipping charges paid at the time of placing the order are non-refundable.</p>

          <hr className="my-10 border-gray-100" />
          
          <p className="text-sm text-gray-500">
            For further assistance, please contact us at <a href="mailto:ranique.official@gmail.com" className="text-brand-rose hover:underline">ranique.official@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
