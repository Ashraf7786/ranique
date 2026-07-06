"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Edit2, Trash2, Eye, Package, ChevronLeft, ChevronRight, X } from "lucide-react";

export function ProductDataTable({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Derived State
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handlers
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingProduct.title,
          sellingPrice: Number(editingProduct.sellingPrice),
          originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : null,
          currentStock: Number(editingProduct.currentStock),
          status: editingProduct.status,
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");
      
      const updatedProduct = await res.json();
      
      // Update local state
      setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
      setEditingProduct(null);
    } catch (error) {
      alert("Failed to save product. Check console.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name or SKU..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blush focus:border-brand-rose transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none w-full sm:w-auto"
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                currentItems.map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{product.title}</p>
                          <p className="text-xs text-gray-500">{product.category?.name || 'Uncategorized'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.sku}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        product.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
                        product.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${product.currentStock < product.minStockAlert ? 'text-red-600 font-semibold' : ''}`}>
                        {product.currentStock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>₹{product.sellingPrice?.toLocaleString('en-IN')}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/product/${product.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-brand-ink transition-colors" title="View Storefront">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setEditingProduct(product)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Quick Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
          <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products</span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-medium text-gray-700">Page {currentPage} of {totalPages || 1}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-serif font-bold text-gray-900 text-lg">Quick Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={editingProduct.title}
                  onChange={e => setEditingProduct({...editingProduct, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Selling Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={editingProduct.sellingPrice}
                    onChange={e => setEditingProduct({...editingProduct, sellingPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Offer/Orig Price (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={editingProduct.originalPrice || ''}
                    onChange={e => setEditingProduct({...editingProduct, originalPrice: e.target.value})}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Inventory Stock</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={editingProduct.currentStock}
                    onChange={e => setEditingProduct({...editingProduct, currentStock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Status</label>
                  <select 
                    value={editingProduct.status}
                    onChange={e => setEditingProduct({...editingProduct, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>
            </form>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => setEditingProduct(null)}
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
