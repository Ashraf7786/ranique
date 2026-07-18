"use client";

import React, { useState } from "react";
import { Search, Edit2, Trash2, Ticket, Plus, X } from "lucide-react";
import { formatDateIST } from "@/lib/utils";

export function CouponDataTable({ initialCoupons, products }: { initialCoupons: any[], products: any[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountPercent: 10,
    productId: "", // Keeping this for backwards compatibility if needed during state transition, but we'll use productIds
    productIds: [] as string[],
    minOrderValue: 0,
    maxUses: "",
    endsAt: "",
    isActive: true
  });

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (coupon?: any) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setForm({
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        productId: "",
        productIds: coupon.products ? coupon.products.map((p: any) => p.id) : [],
        minOrderValue: coupon.minOrderValue,
        maxUses: coupon.maxUses || "",
        endsAt: coupon.endsAt ? new Date(coupon.endsAt).toISOString().slice(0, 16) : "",
        isActive: coupon.isActive
      });
    } else {
      setEditingCoupon(null);
      setForm({
        code: "", discountPercent: 10, productId: "", productIds: [], minOrderValue: 0, maxUses: "", endsAt: "", isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      alert("Failed to delete.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        endsAt: form.endsAt || null
      };

      let res;
      if (editingCoupon) {
        res = await fetch(`/api/coupons/${editingCoupon.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/coupons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error((await res.json()).error || "Failed to save");
      const saved = await res.json();
      
      if (editingCoupon) {
        setCoupons(prev => prev.map(c => c.id === saved.id ? {...c, ...saved} : c));
      } else {
        setCoupons(prev => [saved, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blush"
            />
          </div>
          <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-brand-ink text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Coupon
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Applies To</th>
                <th className="px-6 py-4">Uses</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCoupons.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No coupons found.</td></tr>
              ) : (
                filteredCoupons.map((coupon: any) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{coupon.code}</td>
                    <td className="px-6 py-4 font-bold text-brand-rose">{coupon.discountPercent}%</td>
                    <td className="px-6 py-4">
                      {coupon.products && coupon.products.length > 0 ? (
                        <span className="text-xs truncate max-w-[150px] inline-block" title={coupon.products.map((p:any)=>p.title).join(', ')}>
                          {coupon.products.length} Product(s)
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Entire Order</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {coupon.currentUses} {coupon.maxUses ? `/ ${coupon.maxUses}` : ''}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenModal(coupon)} className="p-1.5 text-gray-400 hover:text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(coupon.id)} className="p-1.5 text-gray-400 hover:text-red-600">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
              <h3 className="font-bold text-gray-900">{editingCoupon ? 'Edit Coupon' : 'New Coupon'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Code *</label>
                <input required type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full px-3 py-2 border rounded-lg uppercase" placeholder="e.g. SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Discount % *</label>
                  <input required type="number" min="1" max="100" value={form.discountPercent} onChange={e => setForm({...form, discountPercent: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Min Order Value (₹)</label>
                  <input type="number" min="0" value={form.minOrderValue} onChange={e => setForm({...form, minOrderValue: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Applies to Products (Optional)</label>
                <div className="border rounded-lg max-h-48 overflow-y-auto p-2 bg-gray-50 border-gray-200">
                  <label className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer text-sm">
                    <input 
                      type="checkbox" 
                      checked={form.productIds.length === 0}
                      onChange={() => setForm({...form, productIds: []})}
                      className="rounded border-gray-300 text-brand-rose focus:ring-brand-rose"
                    />
                    <span className="font-medium text-gray-900">Entire Order (All Products)</span>
                  </label>
                  <div className="my-1 border-t border-gray-200"></div>
                  {products.map(p => (
                    <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer text-sm">
                      <input 
                        type="checkbox"
                        checked={form.productIds.includes(p.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setForm(prev => ({
                            ...prev,
                            productIds: checked 
                              ? [...prev.productIds, p.id]
                              : prev.productIds.filter(id => id !== p.id)
                          }))
                        }}
                        className="rounded border-gray-300 text-brand-rose focus:ring-brand-rose"
                      />
                      <span className="truncate text-gray-700">{p.title}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">If no products are selected, the coupon applies to the entire cart.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Max Uses (Optional)</label>
                  <input type="number" min="1" value={form.maxUses} onChange={e => setForm({...form, maxUses: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Unlimited" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Ends At (Optional)</label>
                  <input type="datetime-local" value={form.endsAt} onChange={e => setForm({...form, endsAt: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Status</label>
                <select value={form.isActive ? "true" : "false"} onChange={e => setForm({...form, isActive: e.target.value === "true"})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <button type="submit" disabled={isSaving} className="w-full py-2 bg-brand-ink text-white rounded-lg mt-4">
                {isSaving ? "Saving..." : "Save Coupon"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
