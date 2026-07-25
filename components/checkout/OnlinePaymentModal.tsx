"use client";

import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { X, UploadCloud, Loader2, IndianRupee, Image as ImageIcon, CheckCircle } from "lucide-react";

interface OnlinePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onSubmit: (data: { paymentProofUrl: string; utrNumber: string }) => void;
  isSubmitting: boolean;
}

export function OnlinePaymentModal({ isOpen, onClose, totalAmount, onSubmit, isSubmitting }: OnlinePaymentModalProps) {
  const [utrNumber, setUtrNumber] = useState("");
  const [images, setImages] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please upload at least one payment screenshot.");
      return;
    }
    if (!utrNumber.trim()) {
      alert("Please enter the UTR / Transaction number.");
      return;
    }
    // Pass the images as a JSON string since it's stored as String? in the DB
    onSubmit({
      paymentProofUrl: JSON.stringify(images),
      utrNumber: utrNumber.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <h3 className="font-serif text-xl font-bold text-brand-ink">Online Payment</h3>
          <button onClick={onClose} disabled={isSubmitting} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-500 font-medium">Amount to Pay</p>
            <p className="text-3xl font-bold text-brand-rose">₹{totalAmount.toLocaleString("en-IN")}</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-brand-ink mb-4 text-center">Scan QR Code using any UPI App</p>
            <div className="w-48 h-48 bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
              {/* Placeholder QR Code Image - Replace with actual store QR */}
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                alt="Store Payment QR" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Pay to: Ranique Official</p>
          </div>

          <form id="payment-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                UTR / Transaction Number *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. 123456789012"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blush focus:border-brand-rose transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                <span>Payment Screenshot *</span>
                <span className="text-xs font-normal text-gray-500">{images.length}/2 Uploaded</span>
              </label>
              
              {images.length > 0 && (
                <div className="flex gap-3 mb-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                      <img src={img} alt={`Proof ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full shadow-sm hover:bg-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length < 2 && (
                !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                  <div className="w-full py-4 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600 flex flex-col items-center gap-2 text-center p-3">
                    <span>Cloudinary is not configured.</span>
                    <span className="text-xs font-normal">Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to Vercel env variables.</span>
                  </div>
                ) : (
                  <CldUploadWidget 
                    signatureEndpoint="/api/upload-payment"
                    onSuccess={(result: any) => {
                      if (result.info?.secure_url) {
                        setImages(prev => [...prev, result.info.secure_url]);
                      }
                    }}
                    options={{
                      maxFiles: 2 - images.length,
                      resourceType: "image",
                      clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                      folder: "payment_proofs"
                    }}
                  >
                    {({ open }) => (
                      <button 
                        type="button" 
                        onClick={() => open()} 
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-brand-blush hover:text-brand-rose transition-all flex flex-col items-center gap-2"
                      >
                        <UploadCloud className="w-6 h-6 text-gray-400" />
                        <span>Click to upload screenshot</span>
                      </button>
                    )}
                  </CldUploadWidget>
                )
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 shrink-0">
          <button
            type="submit"
            form="payment-form"
            disabled={isSubmitting || images.length === 0 || !utrNumber.trim()}
            className="w-full py-3.5 bg-brand-ink text-white font-bold rounded-xl hover:bg-gray-900 transition-all shadow-sm flex items-center justify-center gap-2 text-base disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Payment & Place Order
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
