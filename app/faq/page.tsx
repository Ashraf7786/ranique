import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about shopping with Ranique.",
};

const faqs = [
  {
    question: "Are your cosmetics 100% authentic?",
    answer: "Yes! At Ranique, we pride ourselves on offering only 100% authentic, premium quality cosmetics. All our products are sourced directly from authorized distributors or the brands themselves."
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer: "Yes, we offer Cash on Delivery (COD) for most pin codes across India. You can select the COD option during checkout."
  },
  {
    question: "How long does shipping take?",
    answer: "Orders are typically dispatched within 24 to 48 hours. Depending on your location within India, delivery usually takes between 3 to 7 business days."
  },
  {
    question: "Is there a shipping charge?",
    answer: "We offer FREE SHIPPING on all prepaid orders and COD orders with a subtotal above ₹999! For orders below ₹999, a nominal shipping fee of ₹99 is applied."
  },
  {
    question: "Can I track my order?",
    answer: "Absolutely. Once your order is dispatched, you will receive an email and SMS with your tracking link. You can also track your order directly from your Ranique account."
  },
  {
    question: "What if I receive a damaged product?",
    answer: "We ensure secure packaging, but if you receive a damaged or incorrect item, please contact our support team within 48 hours of delivery with unboxing photos/videos, and we will arrange a replacement."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-brand-sand/30 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-brand-border/30 p-8 sm:p-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ink mb-2 text-center">Frequently Asked Questions</h1>
        <p className="text-gray-500 text-center mb-10">Everything you need to know about shopping with Ranique.</p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-semibold text-brand-ink mb-2">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-brand-blush/20 p-6 rounded-xl text-center border border-brand-rose/20">
          <h4 className="font-semibold text-brand-ink mb-2">Still have questions?</h4>
          <p className="text-sm text-gray-600 mb-4">We are here to help you 6 days a week.</p>
          <a href="/contact" className="inline-block bg-brand-ink text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
