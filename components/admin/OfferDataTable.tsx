"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Edit2, Trash2, Eye, X, Package } from "lucide-react";
import { formatDateIST } from "@/lib/utils";

export function OfferDataTable({ initialOffers }: { initialOffers: any[] }) {
  const [offers, setOffers] = useState(initialOffers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Edit Modal State
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Derived State
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const p = o.product;
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || 
        (statusFilter === "Active" && o.isActive) ||
        (statusFilter === "Inactive" && !o.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [offers, searchTerm, statusFilter]);

  const handleDelete = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete offer");
      
      setOffers((prev) => prev.filter((o) => o.id !== offerId));
    } catch (error) {
      alert("Failed to delete offer.");
      console.error(error);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/offers/${editingOffer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discount: Number(editingOffer.discount),
          offerPrice: Number(editingOffer.offerPrice),
          endsAt: editingOffer.endsAt,
          isActive: editingOffer.isActive
        }),
      });

      if (!res.ok) throw new Error("Failed to update offer");
      
      const updatedOffer = await res.json();
      
      setOffers((prev) => prev.map((o) => o.id === updatedOffer.id ? { ...o, ...updatedOffer } : o));
      setEditingOffer(null);
    } catch (error) {
      alert("Failed to save offer.");
      console.error(error);
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
              placeholder="Search product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blush"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4 whitespace-nowrap">Original Price</th>
                <th className="px-6 py-4 whitespace-nowrap">Offer Price</th>
                <th className="px-6 py-4 whitespace-nowrap">Ends At</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No offers found.
                  </td>
                </tr>
              ) : (
                filteredOffers.map((offer: any) => (
                  <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                          {offer.product.images?.[0] ? (
                            <img src={offer.product.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{offer.product.title}</p>
                          <p className="text-xs text-brand-rose font-medium">{offer.discount}% OFF</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap line-through text-gray-400">
                      ₹{offer.product.sellingPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      ₹{offer.offerPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDateIST(offer.endsAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/product/${offer.product.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-brand-ink transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setEditingOffer(offer)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(offer.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Edit Modal */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-serif font-bold text-gray-900 text-lg">Edit Offer</h3>
              <button onClick={() => setEditingOffer(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Product</label>
                <input type="text" disabled value={editingOffer.product.title} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Discount (%)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    max="100"
                    value={editingOffer.discount}
                    onChange={e => setEditingOffer({...editingOffer, discount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Offer Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={editingOffer.offerPrice}
                    onChange={e => setEditingOffer({...editingOffer, offerPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Ends At</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={new Date(editingOffer.endsAt).toISOString().slice(0, 16)}
                    onChange={e => setEditingOffer({...editingOffer, endsAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Status</label>
                  <select 
                    value={editingOffer.isActive ? "true" : "false"}
                    onChange={e => setEditingOffer({...editingOffer, isActive: e.target.value === "true"})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </form>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => setEditingOffer(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditSave}
                disabled={isSaving}
                className="px-4 py-2 bg-brand-ink text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
