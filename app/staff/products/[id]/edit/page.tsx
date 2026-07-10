"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, AlertTriangle } from "lucide-react";

export default function StaffEditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", shortDescription: "",
    sellingPrice: "", originalPrice: "", currentStock: "",
  });

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(data => {
      setProduct(data);
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        shortDescription: data.shortDescription || "",
        sellingPrice: String(data.sellingPrice || ""),
        originalPrice: String(data.originalPrice || ""),
        currentStock: String(data.currentStock || ""),
      });
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        sellingPrice: Number(form.sellingPrice),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        currentStock: Number(form.currentStock),
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.status === 202) {
        // Edit request submitted
        setSuccess(true);
        setTimeout(() => router.push("/staff/products"), 2500);
        return;
      }
      if (!res.ok) {
        setError(data.error || "Failed to submit edit request.");
        return;
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );

  if (!product) return (
    <div className="py-12 text-center text-gray-500">Product not found or you do not have permission to edit it.</div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/staff/products" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-ink">Edit Product</h1>
          <p className="text-sm text-yellow-600 font-medium mt-0.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Changes require Admin approval before going live
          </p>
        </div>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-green-800 mb-1">Edit Request Submitted!</h2>
          <p className="text-sm text-green-600">Your changes are pending Admin approval. You will be redirected shortly...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Edit Request Workflow</p>
              <p className="text-sm text-yellow-700 mt-0.5">
                Submitting this form will send an edit request to the Admin for approval.
                The product will <strong>not</strong> update until Admin approves.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Product Title</label>
              <input value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Short Description</label>
              <textarea rows={3} value={form.shortDescription}
                onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Pricing & Inventory</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Selling Price (₹)</label>
                <input type="number" min={0} value={form.sellingPrice}
                  onChange={e => setForm({ ...form, sellingPrice: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Original Price (₹)</label>
                <input type="number" min={0} value={form.originalPrice}
                  onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                <input type="number" min={0} value={form.currentStock}
                  onChange={e => setForm({ ...form, currentStock: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

          <div className="flex justify-end">
            <button type="submit" disabled={submitting}
              className="bg-brand-gold text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-gold/90 transition-colors flex items-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Edit Request
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
