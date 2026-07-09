"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { API_URL } from "@/lib/config";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<{label: string, hex: string} | null>(null);
  const [variantGroupId, setVariantGroupId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [tempUrl, setTempUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    sku: "",
    sellingPrice: "",
    originalPrice: "",
    currentStock: "",
    status: "DRAFT",
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
        images: images.map((img, index) => ({ url: img, isCover: index === 0 })),
        colors: selectedColor ? JSON.stringify([selectedColor]) : null,
        variantGroupId: variantGroupId || null,
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
        alert(`Error: ${err.error || err.message || 'An unknown error occurred'}`);
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
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                Media ({images.length}/5)
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                      <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-brand-ink text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold">Cover</span>
                      )}
                      <button 
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors flex flex-col items-center justify-center">
                  {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg text-left">
                      <strong>Cloudinary Error:</strong> You must add <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> to your Vercel Environment Variables for uploads to work!
                    </div>
                  ) : (
                    <CldUploadWidget 
                      signatureEndpoint="/api/upload"
                      onSuccess={(result: any) => {
                        if (result.info?.secure_url) {
                          setImages(prev => [...prev, result.info.secure_url]);
                        }
                      }}
                      options={{
                        maxFiles: 5 - images.length,
                        resourceType: "image",
                        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"]
                      }}
                    >
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-rose/10 text-brand-rose font-semibold rounded-lg hover:bg-brand-rose/20 transition-colors">
                          Upload Files
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
                  
                  <div className="w-full max-w-sm flex items-center gap-2 mt-2">
                    <input 
                      type="url" 
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                      placeholder="Or paste image URL..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (tempUrl && images.length < 5) {
                          setImages([...images, tempUrl]);
                          setTempUrl("");
                        }
                      }}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
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
              Product Color & Grouping
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Color</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    // Basic & Neutrals
                    { label: "Black", hex: "#000000" },
                    { label: "White", hex: "#FFFFFF" },
                    { label: "Grey", hex: "#808080" },
                    { label: "Silver", hex: "#C0C0C0" },
                    { label: "Charcoal", hex: "#36454F" },
                    
                    // Browns & Tans
                    { label: "Brown", hex: "#8B4513" },
                    { label: "Beige", hex: "#F5F5DC" },
                    { label: "Tan", hex: "#D2B48C" },
                    { label: "Camel", hex: "#C19A6B" },
                    { label: "Bronze", hex: "#CD7F32" },
                    
                    // Reds & Pinks
                    { label: "Red", hex: "#FF0000" },
                    { label: "Maroon", hex: "#800000" },
                    { label: "Burgundy", hex: "#800020" },
                    { label: "Rose Gold", hex: "#B76E79" },
                    { label: "Pink", hex: "#FFC0CB" },
                    { label: "Hot Pink", hex: "#FF69B4" },
                    { label: "Coral", hex: "#FF7F50" },
                    { label: "Peach", hex: "#FFE5B4" },
                    
                    // Oranges & Yellows
                    { label: "Orange", hex: "#FFA500" },
                    { label: "Mustard", hex: "#FFDB58" },
                    { label: "Yellow", hex: "#FFFF00" },
                    { label: "Gold", hex: "#FFD700" },
                    
                    // Greens
                    { label: "Green", hex: "#008000" },
                    { label: "Olive", hex: "#808000" },
                    { label: "Mint", hex: "#98FF98" },
                    { label: "Teal", hex: "#008080" },
                    { label: "Emerald", hex: "#50C878" },
                    
                    // Blues
                    { label: "Blue", hex: "#0000FF" },
                    { label: "Navy", hex: "#000080" },
                    { label: "Light Blue", hex: "#ADD8E6" },
                    { label: "Cyan", hex: "#00FFFF" },
                    { label: "Indigo", hex: "#4B0082" },
                    
                    // Purples
                    { label: "Purple", hex: "#800080" },
                    { label: "Lavender", hex: "#E6E6FA" },
                    { label: "Magenta", hex: "#FF00FF" },
                    { label: "Plum", hex: "#DDA0DD" },
                    
                    // Others
                    { label: "Multi", hex: "linear-gradient(45deg, red, blue, green, yellow)" },
                    { label: "Clear/Transparent", hex: "rgba(255, 255, 255, 0)" },
                  ].map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      title={c.label}
                      onClick={() => setSelectedColor(c)}
                      className={`relative w-10 h-10 rounded-full border shadow-sm transition-transform hover:scale-110 ${
                        selectedColor?.label === c.label ? "ring-2 ring-brand-rose ring-offset-2 border-brand-rose" : "border-gray-200"
                      }`}
                      style={{ background: c.hex }}
                    >
                      {selectedColor?.label === c.label && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg className={`w-5 h-5 ${c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && <p className="text-sm font-medium text-brand-ink mt-2">Selected: {selectedColor.label}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variant Group ID (Optional)</label>
                <input 
                  type="text" 
                  value={variantGroupId}
                  onChange={e => setVariantGroupId(e.target.value)}
                  placeholder="e.g. stones-bangle-01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">If you want to link different colored products together on the storefront, give them the exact same Variant Group ID.</p>
              </div>
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
