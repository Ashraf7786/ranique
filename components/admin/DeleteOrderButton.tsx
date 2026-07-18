"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete order");
      
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Order"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
