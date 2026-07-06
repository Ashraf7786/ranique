"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{title: string, type: 'success'|'error'} | null>(null);
  
  const router = useRouter();

  const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setPendingStatus(newStatus);
    setShowConfirm(true);
    e.target.value = status; // Visually revert until confirmed
  };

  const confirmUpdate = async () => {
    if (!pendingStatus) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: pendingStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      
      setStatus(pendingStatus);
      setToastMsg({ title: `Status successfully updated to ${pendingStatus}`, type: 'success' });
      router.refresh();
    } catch (error) {
      console.error(error);
      setToastMsg({ title: "Failed to update order status", type: 'error' });
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setPendingStatus(null);
      setTimeout(() => setToastMsg(null), 3000); // Hide toast after 3s
    }
  };

  const cancelUpdate = () => {
    setShowConfirm(false);
    setPendingStatus(null);
  };

  return (
    <>
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={cn(
          "text-sm rounded-lg border-gray-300 py-1.5 px-3 bg-white shadow-sm focus:border-brand-rose focus:ring-brand-rose disabled:opacity-50 transition-colors",
          status === 'PENDING' ? 'text-yellow-700' :
          status === 'CONFIRMED' ? 'text-blue-700' :
          status === 'SHIPPED' ? 'text-purple-700' :
          status === 'DELIVERED' ? 'text-green-700' :
          'text-red-700'
        )}
      >
        {statuses.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Confirm Update</h3>
              <p className="text-gray-600 text-sm">
                Are you sure you want to update this order's status to <span className="font-bold text-brand-ink">{pendingStatus}</span>?
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={cancelUpdate} 
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmUpdate} 
                disabled={loading} 
                className="px-4 py-2 text-sm font-medium text-white bg-brand-rose rounded-lg shadow-sm hover:bg-brand-rose-dark transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Yes, update'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={cn(
            "px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium",
            toastMsg.type === 'success' 
              ? "bg-green-50 border-green-200 text-green-800" 
              : "bg-red-50 border-red-200 text-red-800"
          )}>
            {toastMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            {toastMsg.title}
          </div>
        </div>
      )}
    </>
  );
}
