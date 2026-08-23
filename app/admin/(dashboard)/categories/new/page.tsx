"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon } from "@/components/admin/AdminIcons";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { API_URL } from "@/lib/config";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [tempUrl, setTempUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    href: "",
    storeType: "STORE", // 'STORE' | 'CLOTHING'
    sortOrder: "0",
    isVisible: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let val = value;
      if (name === "slug") {
        val = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      const updated = {
        ...prev,
        [name]: name === "isVisible" ? (value === "true") : val
      };
      if (name === "name" && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sortOrder: Number(formData.sortOrder) || 0,
          image: image || null,
          href: formData.href || null,
        }),
      });

      if (res.ok) {
        router.push("/admin/categories");
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || err.message || 'Failed to create category'}`);
      }
    } catch (err) {
      alert("Failed to create category. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/categories" className="p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-ink">Add Category</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new product category</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">Category Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm"
                placeholder="e.g. Lehenga Choli"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">URL Slug *</label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm font-mono text-gray-600"
                placeholder="e.g. lehenga-choli"
              />
              <p className="text-xs text-gray-500 mt-1">The URL-friendly identifier.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">Store Placement Type *</label>
              <select
                name="storeType"
                value={formData.storeType}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm bg-white"
              >
                <option value="STORE">🛍️ Ranique Store (Main Hub)</option>
                <option value="CLOTHING">👗 Ranique Clothing (Clothing Hub)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">Custom Link Override (Optional)</label>
              <input
                type="text"
                name="href"
                value={formData.href}
                onChange={handleChange}
                placeholder="e.g. /shop?category=lehenga-choli"
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">If blank, defaults to auto slug redirection.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">Sort Order Position</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers display first.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">Visibility status</label>
              <select
                name="isVisible"
                value={formData.isVisible ? "true" : "false"}
                onChange={(e) => setFormData(p => ({ ...p, isVisible: e.target.value === "true" }))}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm bg-white"
              >
                <option value="true">Visible on Storefront</option>
                <option value="false">Hidden (Draft)</option>
              </select>
            </div>
          </div>

          {/* Cloudinary upload & pastable URL */}
          <div className="space-y-3 border border-gray-200 rounded-xl p-5 bg-gray-50/50">
            <label className="block text-sm font-semibold text-brand-ink flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              Category Cover Image
            </label>

            {image && (
              <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-200 shadow-md mx-auto group">
                <img src={image} alt="Upload preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex flex-col items-center gap-2.5">
              {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
                <CldUploadWidget
                  signatureEndpoint="/api/upload"
                  onSuccess={(result: any) => {
                    if (result.info?.secure_url) {
                      setImage(result.info.secure_url);
                    }
                  }}
                  options={{
                    maxFiles: 1,
                    resourceType: "image",
                    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"]
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="px-4 py-2 bg-brand-rose/10 text-brand-rose text-sm font-semibold rounded-lg hover:bg-brand-rose/20 transition-colors"
                    >
                      Upload via Cloudinary
                    </button>
                  )}
                </CldUploadWidget>
              )}

              <div className="w-full flex items-center gap-2">
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Or paste direct image URL..."
                  className="flex-1 h-9 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (tempUrl) {
                      setImage(tempUrl);
                      setTempUrl("");
                    }
                  }}
                  className="px-4 h-9 text-sm bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-ink mb-1.5">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm resize-y"
              placeholder="Brief description of this category..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            href="/admin/categories"
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-brand-ink font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-ink text-white rounded-lg font-semibold text-sm hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
