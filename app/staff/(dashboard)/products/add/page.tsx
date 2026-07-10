"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

export default function StaffAddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "", slug: "", sku: "", shortDescription: "",
    sellingPrice: "", originalPrice: "", currentStock: "",
    categoryId: "", brandId: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(r => r.ok ? r.json() : []),
      fetch("/api/brands").then(r => r.ok ? r.json() : []),
    ]).then(([cats, brnds]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      setBrands(Array.isArray(brnds) ? brnds : []);
    }).catch(err => {
      console.error(err);
      setCategories([]);
      setBrands([]);
    });
  }, []);

  const handleSlugify = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        sellingPrice: Number(form.sellingPrice),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        currentStock: Number(form.currentStock),
        status: "PUBLISHED", // Staff-added products go live immediately
        images: images.map((url, i) => ({
          url,
          isCover: i === 0,
          altText: form.title,
          sortOrder: i,
        })),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create product.");
        return;
      }

      router.push("/staff/products");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/staff/products" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-ink">Add New Product</h1>
          <p className="text-sm text-green-600 font-medium mt-0.5">✓ Goes live immediately</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Product Title *</label>
              <input required value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value, slug: handleSlugify(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Slug</label>
              <input value={form.slug}
                onChange={e => setForm({ ...form, slug: handleSlugify(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-brand-gold" />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Short Description</label>
              <textarea rows={3} value={form.shortDescription}
                onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Pricing & Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">SKU *</label>
              <input required value={form.sku}
                onChange={e => setForm({ ...form, sku: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Selling Price (₹) *</label>
              <input required type="number" min={0} value={form.sellingPrice}
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
              <label className="text-sm font-medium text-gray-700">Stock Quantity *</label>
              <input required type="number" min={0} value={form.currentStock}
                onChange={e => setForm({ ...form, currentStock: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Classification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <select value={form.brandId}
                onChange={e => setForm({ ...form, brandId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold">
                <option value="">Select brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Images</h2>
          {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg text-left">
              <strong>Cloudinary Error:</strong> You must add <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> to your environment variables for uploads to work!
            </div>
          ) : (
            <CldUploadWidget
              signatureEndpoint="/api/upload"
              options={{ multiple: true, maxFiles: 6 }}
              onSuccess={(result: any) => {
                const url = result.info?.secure_url;
                if (url) setImages(prev => [...prev, url]);
              }}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()}
                  className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-4 text-sm text-gray-500 hover:border-brand-gold hover:text-brand-gold transition-colors w-full">
                  + Upload Images
                </button>
              )}
            </CldUploadWidget>
          )}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                  {i === 0 && <span className="absolute -top-1 -right-1 text-xs bg-brand-gold text-white rounded px-1">Cover</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

        <div className="flex justify-end">
          <button type="submit" disabled={loading}
            className="bg-brand-ink text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-ink/90 transition-colors flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publish Product
          </button>
        </div>
      </form>
    </div>
  );
}
