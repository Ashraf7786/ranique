"use client";

import React, { useState } from "react";
import { Star, Trash2, CheckCircle2, ShieldCheck, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function ReviewsDataTable({ initialReviews, products }: { initialReviews: any[], products: any[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    productId: "",
    customerName: "",
    rating: 5,
    comment: "",
    isVerified: true,
    isGenuine: false
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      alert("Failed to delete review.");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const newReview = await res.json();
        // Optimistically add to UI, but missing product info, so just refresh
        router.refresh();
        setIsModalOpen(false);
        setFormData({
          productId: "",
          customerName: "",
          rating: 5,
          comment: "",
          isVerified: true,
          isGenuine: false
        });
        
        // Wait a bit and refresh local state manually to show immediately if router.refresh is slow
        setTimeout(() => {
            window.location.reload();
        }, 500);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add review.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-brand-ink text-white font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Manual Review
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">PRODUCT</th>
                <th className="px-6 py-4">RATING</th>
                <th className="px-6 py-4 max-w-xs">COMMENT</th>
                <th className="px-6 py-4 text-center">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No reviews yet. Add one to get started!
                  </td>
                </tr>
              ) : (
                reviews.map((review: any) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {review.customerName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {review.product?.title || 'Unknown Product'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-500" title={review.comment}>
                      {review.comment || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-center justify-center">
                        {review.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        {review.isGenuine && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Genuine
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Add Manual Review</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select 
                  required
                  value={formData.productId}
                  onChange={e => setFormData({...formData, productId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input 
                  required
                  type="text"
                  value={formData.customerName}
                  onChange={e => setFormData({...formData, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <input 
                  required
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea 
                  rows={3}
                  value={formData.comment}
                  onChange={e => setFormData({...formData, comment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={e => setFormData({...formData, isVerified: e.target.checked})}
                    className="rounded border-gray-300 text-brand-rose focus:ring-brand-rose"
                  />
                  <span className="text-sm text-gray-700">Show Verified Badge</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isGenuine}
                    onChange={e => setFormData({...formData, isGenuine: e.target.checked})}
                    className="rounded border-gray-300 text-brand-rose focus:ring-brand-rose"
                  />
                  <span className="text-sm text-gray-700">Mark as Genuine (Internal)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-ink rounded-lg hover:bg-gray-800 disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Add Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
