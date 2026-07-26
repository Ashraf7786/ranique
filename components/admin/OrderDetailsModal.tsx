"use client";

import { useState } from "react";
import { X, Eye } from "lucide-react";

export function OrderDetailsModal({ order }: { order: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const customerName = order.shippingName || (order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Unknown Customer');
  const customerEmail = order.shippingEmail || order.user?.email || 'No email';
  const customerPhone = order.shippingPhone || order.user?.mobileNumber || 'No phone';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-rose bg-brand-rose/5 hover:bg-brand-rose/10 border border-brand-rose/20 rounded-md transition-colors whitespace-nowrap"
      >
        <Eye className="w-3.5 h-3.5" />
        View Full Order
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-900">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Customer Details */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Customer Details</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="font-medium text-gray-900">{customerName}</p>
                    <p className="text-sm text-gray-600 mt-1">{customerEmail}</p>
                    <p className="text-sm text-gray-600">{customerPhone}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Delivery Address</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {order.shippingLine1 ? (
                        <>
                          {order.shippingLine1}
                          {order.shippingLine2 ? `, ${order.shippingLine2}` : ''}
                          <br />
                          {order.shippingCity}, {order.shippingState} {order.shippingZip}
                          <br />
                          {order.shippingCountry || 'India'}
                        </>
                      ) : order.user?.addresses?.[0] ? (
                        <>
                          {order.user.addresses[0].line1}
                          {order.user.addresses[0].line2 ? `, ${order.user.addresses[0].line2}` : ''}
                          <br />
                          {order.user.addresses[0].city}, {order.user.addresses[0].state} {order.user.addresses[0].zip}
                          <br />
                          {order.user.addresses[0].country || 'India'}
                        </>
                      ) : (
                        'Address not provided'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Online Payment Details */}
              {order.paymentMethod === 'ONLINE' && (order.utrNumber || order.paymentProofUrl) && (
                <div className="mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Online Payment Details</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                    {order.utrNumber && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">UTR / Transaction Number</p>
                        <p className="font-mono text-sm font-semibold text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 inline-block">{order.utrNumber}</p>
                      </div>
                    )}
                    {order.paymentProofUrl && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Payment Proof(s)</p>
                        <div className="flex flex-wrap gap-3">
                          {(() => {
                            let images: string[] = [];
                            try {
                              images = JSON.parse(order.paymentProofUrl);
                              if (!Array.isArray(images)) images = [order.paymentProofUrl];
                            } catch (e) {
                              images = [order.paymentProofUrl];
                            }
                            return images.map((img, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => setSelectedImage(img)}
                                className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:ring-2 hover:ring-brand-rose transition-all inline-block focus:outline-none"
                              >
                                <img src={img} alt={`Payment Proof ${idx + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Eye className="w-5 h-5 text-white" />
                                </div>
                              </button>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Order Items ({order.items.length})</h4>
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                      {item.product?.images?.[0]?.url ? (
                        <img 
                          src={item.product.images[0].url} 
                          alt={item.product.title} 
                          className="w-16 h-16 object-cover rounded-lg border border-gray-100 shadow-sm" 
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                          <Eye className="w-6 h-6 opacity-20" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 truncate">{item.product?.title || 'Unknown Product'}</h5>
                        {item.sku && <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>}
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-sm font-medium text-gray-900">₹{item.price}</span>
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500">Payment Mode</p>
                  <p className="font-medium text-gray-900 mt-0.5">{order.paymentMethod}</p>
                </div>
                {order.couponCode && (
                  <div>
                    <p className="text-xs text-gray-500">Coupon Applied</p>
                    <p className="font-medium text-brand-rose mt-0.5">{order.couponCode}</p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">₹{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-all">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center animate-in fade-in zoom-in duration-200">
            <img 
              src={selectedImage} 
              alt="Payment Proof Full Size" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
