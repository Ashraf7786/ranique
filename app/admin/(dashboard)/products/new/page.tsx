"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState<{label: string, hex: string}[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    sku: "",
    sellingPrice: "",
    originalPrice: "",
    currentStock: "",
    status: "DRAFT",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.warn("Failed to fetch categories (backend might be offline)", err));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from title if title is changed
      ...(name === 'title' ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare payload mapping to backend schema
      const payload = {
        title: formData.title,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        sku: formData.sku,
        sellingPrice: Number(formData.sellingPrice),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        currentStock: Number(formData.currentStock),
        status: formData.status,
        categoryId: formData.categoryId ? formData.categoryId : null,
        images: formData.imageUrl ? [{ url: formData.imageUrl, isCover: true }] : [],
        colors: colors.length > 0 ? JSON.stringify(colors) : null,
      };

      const { API_URL } = await import("@/lib/config");
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (err) {
      alert("Failed to create product. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pb-24 relative">
      {/* Header with Sticky Save */}
      <div className="flex items-center justify-between mb-6 sticky top-16 bg-gray-50 z-10 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Add Product</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 mr-2">Unsaved changes</span>
          <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Discard
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-brand-ink rounded-lg hover:bg-gray-800 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Basic Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
                <input 
                  required
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Velvet Rose Lip Serum"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea 
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="A brief summary of the product..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              Media
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
              <div className="max-w-md mx-auto">
                <p className="text-sm text-gray-500 mb-4">Paste an image URL for Phase 1. (File upload coming in Phase 2)</p>
                <input 
                  type="url" 
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
                {formData.imageUrl && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 inline-block h-32">
                    <img src={formData.imageUrl} alt="Preview" className="h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-gray-400" />
              Pricing
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
                <input 
                  required
                  type="number" 
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare-at Price (₹)</label>
                <input 
                  type="number" 
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">To show a crossed-out 'SALE' price.</p>
              </div>
            </div>
          </div>

          {/* Variants Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Variants (Colors)
            </h2>
            
            <div className="space-y-4">
              {colors.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: c.hex }} />
                  <input 
                    type="text" 
                    value={c.label} 
                    onChange={e => { const newC = [...colors]; newC[i].label = e.target.value; setColors(newC); }} 
                    placeholder="Color Name (e.g. Rosewood)" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input 
                    type="text" 
                    value={c.hex} 
                    onChange={e => { const newC = [...colors]; newC[i].hex = e.target.value; setColors(newC); }} 
                    placeholder="#HexCode" 
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase"
                  />
                  <button type="button" onClick={() => setColors(colors.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    X
                  </button>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={() => setColors([...colors, { label: "", hex: "#000000" }])}
                className="text-sm font-medium text-brand-rose hover:text-brand-rose-dark"
              >
                + Add Color Variant
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Status</h2>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Organization / Identifiers */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Organization & Inventory</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                >
                  <option value="">Select Category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.parentId ? `— ${cat.name}` : cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Subcategories will appear indented if they exist.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input 
                  required
                  type="text" 
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. COS-001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                <input 
                  required
                  type="text" 
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock *</label>
                <input 
                  required
                  type="number" 
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
