"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon, IndianRupee } from "@/components/admin/AdminIcons";
import { useRouter, useParams } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { API_URL } from "@/lib/config";
import { ALL_COLORS, POPULAR_COLORS } from "@/lib/colors";
import { SizeVariantsInput, SizeVariant } from "@/components/admin/SizeVariantsInput";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedColor, setSelectedColor] = useState<{label: string, hex: string} | null>(null);
  const [searchColor, setSearchColor] = useState("");
  const [variantGroupId, setVariantGroupId] = useState("");
  const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [tempUrl, setTempUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "", slug: "", shortDescription: "", sku: "",
    sellingPrice: "", originalPrice: "", currentStock: "",
    status: "DRAFT", categoryId: "", boughtLastWeek: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.warn("Failed to fetch categories", err));

    if (id) {
      fetch(`${API_URL}/products/${id}`)
        .then(res => { if (!res.ok) throw new Error("Failed to fetch product"); return res.json(); })
        .then(data => {
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            shortDescription: data.shortDescription || "",
            sku: data.sku || "",
            sellingPrice: data.sellingPrice?.toString() || "",
            originalPrice: data.originalPrice?.toString() || "",
            currentStock: data.currentStock?.toString() || "",
            status: data.status || "DRAFT",
            categoryId: data.categoryId || "",
            boughtLastWeek: data.boughtLastWeek?.toString() || "",
          });
          setVariantGroupId(data.variantGroupId || "");
          if (data.images) setImages(data.images.map((img: any) => img.url));
          if (data.colors) {
            try {
              const parsed = JSON.parse(data.colors);
              if (parsed.length > 0) setSelectedColor(parsed[0]);
            } catch {}
          }
          if (data.sizeVariants) {
            try {
              const parsed = JSON.parse(data.sizeVariants);
              if (Array.isArray(parsed)) setSizeVariants(parsed);
            } catch {}
          }
        })
        .catch(err => { console.error(err); alert("Failed to load product details."); })
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "title" ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        sku: formData.sku,
        sellingPrice: Number(formData.sellingPrice),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        currentStock: sizeVariants.length > 0
          ? sizeVariants.reduce((sum, sv) => sum + sv.stock, 0)
          : formData.currentStock ? Number(formData.currentStock) : 0,
        sizeVariants: sizeVariants.length > 0 ? sizeVariants : null,
        status: formData.status,
        categoryId: formData.categoryId || null,
        images: images.map((img, index) => ({ url: img, isCover: index === 0 })),
        colors: selectedColor ? JSON.stringify([selectedColor]) : null,
        variantGroupId: variantGroupId || null,
        boughtLastWeek: formData.boughtLastWeek ? Number(formData.boughtLastWeek) : null,
      };

      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || err.message || "An unknown error occurred"}`);
      }
    } catch {
      alert("Failed to update product. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const totalStock = sizeVariants.length > 0
    ? sizeVariants.reduce((s, sv) => s + sv.stock, 0)
    : null;

  if (fetching) {
    return <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading Product Data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="pb-24 relative">
      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 sticky top-16 bg-gray-50 z-10 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Edit Product</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 mr-2">Unsaved changes</span>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-brand-ink rounded-lg hover:bg-gray-800 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">

        {/* ════ LEFT COLUMN (2/3) ════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
                <input
                  required type="text" name="title" value={formData.title} onChange={handleChange}
                  placeholder="e.g. Velvet Rose Lip Serum"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea
                  name="shortDescription" value={formData.shortDescription} onChange={handleChange}
                  rows={3} placeholder="A brief summary of the product..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Media */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Media ({images.length}/5)</h2>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                    <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-brand-ink text-white text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Cover</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 bg-white/90 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg text-left">
                    <strong>Cloudinary Error:</strong> Add <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> to your environment variables.
                  </div>
                ) : (
                  <CldUploadWidget
                    signatureEndpoint="/api/upload"
                    onSuccess={(result: any) => {
                      if (result.info?.secure_url) setImages(prev => [...prev, result.info.secure_url]);
                    }}
                    options={{ maxFiles: 5 - images.length, resourceType: "image", clientAllowedFormats: ["jpg", "jpeg", "png", "webp"] }}
                  >
                    {({ open }) => (
                      <button type="button" onClick={() => open()} className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-rose/10 text-brand-rose font-semibold rounded-lg hover:bg-brand-rose/20 transition-colors">
                        Upload Files
                      </button>
                    )}
                  </CldUploadWidget>
                )}
                <div className="flex items-center gap-2 max-w-sm mx-auto mt-2">
                  <input
                    type="url" value={tempUrl} onChange={e => setTempUrl(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => { if (tempUrl && images.length < 5) { setImages([...images, tempUrl]); setTempUrl(""); } }}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-gray-400" />
              Pricing
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
                <input required type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} min="0" step="0.01" placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare-at Price (₹)</label>
                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} min="0" step="0.01" placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Shows a crossed-out SALE price.</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bought Last Week <span className="font-normal text-gray-400">(Social proof)</span>
                </label>
                <input type="number" name="boughtLastWeek" value={formData.boughtLastWeek} onChange={handleChange} min="0" placeholder="e.g. 23"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate a number.</p>
              </div>
            </div>
          </div>

          {/* 4. Size Variants & Stock */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Size Variants &amp; Stock</h2>
                <p className="text-xs text-gray-500 mt-0.5">Enable to set individual stock per size. Total stock is auto-calculated.</p>
              </div>
              {totalStock !== null && (
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${totalStock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  {totalStock} in stock
                </span>
              )}
            </div>

            <SizeVariantsInput value={sizeVariants} onChange={setSizeVariants} />

            {sizeVariants.length === 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input
                  type="number" name="currentStock" value={formData.currentStock} onChange={handleChange} min="0" placeholder="0"
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
              </div>
            )}
          </div>

          {/* 5. Color & Variant Grouping */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Color &amp; Variant Grouping
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search &amp; Select Color</label>
                <input
                  type="text" placeholder="Search colors (e.g., Maroon, Navy, Pink...)" value={searchColor}
                  onChange={e => setSearchColor(e.target.value)}
                  className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
                <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto p-1">
                  {(searchColor.trim() === "" ? POPULAR_COLORS : ALL_COLORS.filter(c => c.label.toLowerCase().includes(searchColor.toLowerCase()))).map((c, i) => (
                    <button
                      key={i} type="button" title={c.label} onClick={() => setSelectedColor(c)}
                      className={`relative w-10 h-10 rounded-full border shadow-sm transition-transform hover:scale-110 ${selectedColor?.label === c.label ? "ring-2 ring-brand-rose ring-offset-2 border-brand-rose" : "border-gray-200"}`}
                      style={{ background: c.hex }}
                    >
                      {selectedColor?.label === c.label && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg className={`w-5 h-5 ${c.hex === "#FFFFFF" || c.hex === "rgba(255, 255, 255, 0)" || c.hex === "#FFFF00" ? "text-black" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                  {searchColor.trim() !== "" && ALL_COLORS.filter(c => c.label.toLowerCase().includes(searchColor.toLowerCase())).length === 0 && (
                    <p className="text-sm text-gray-500 w-full text-center py-4">No colors found matching &quot;{searchColor}&quot;</p>
                  )}
                </div>
                {selectedColor && <p className="text-sm font-medium text-brand-ink mt-2">Selected: {selectedColor.label} ({selectedColor.hex})</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variant Group ID <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text" value={variantGroupId} onChange={e => setVariantGroupId(e.target.value)}
                  placeholder="e.g. stones-bangle-01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Link different colored products together on the storefront with the same Group ID.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ════ RIGHT COLUMN — SIDEBAR (1/3) ════════════════════════════════ */}
        <div className="space-y-6">

          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Status</h2>
            <select
              name="status" value={formData.status} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="categoryId" value={formData.categoryId} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                >
                  <option value="">Select Category...</option>
                  {categories.filter(c => !c.parentId && c.slug !== "womens-clothing").length > 0 && (
                    <optgroup label="🛍️ Ranique Store">
                      {categories.filter(c => !c.parentId && c.slug !== "womens-clothing").map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </optgroup>
                  )}
                  {categories.filter(c => !!c.parentId).length > 0 && (
                    <optgroup label="👗 Ranique Clothing">
                      {categories.filter(c => !!c.parentId).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">Clothing categories auto-apply S / M / L / XL sizing.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input
                  required type="text" name="sku" value={formData.sku} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                <input
                  required type="text" name="slug" value={formData.slug} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blush focus:border-brand-rose outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from title.</p>
              </div>
            </div>
          </div>

          {/* Live stock summary — shown when size variants are active */}
          {sizeVariants.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-green-800 mb-3">Stock Summary</h3>
              <div className="space-y-1.5">
                {sizeVariants.map(sv => (
                  <div key={sv.id} className="flex items-center justify-between text-sm">
                    <span className="text-green-700 font-medium">{sv.label}</span>
                    <span className={`font-bold tabular-nums ${sv.stock === 0 ? "text-red-500" : "text-green-800"}`}>{sv.stock}</span>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-green-200 flex items-center justify-between text-sm font-bold">
                  <span className="text-green-800">Total</span>
                  <span className="text-green-800">{totalStock}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
