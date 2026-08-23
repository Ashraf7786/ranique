"use client";

import { useState } from "react";
import { X, Loader2, Save, Image as ImageIcon } from "@/components/admin/AdminIcons";
import { CldUploadWidget } from "next-cloudinary";
import { API_URL } from "@/lib/config";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  href: string | null;
  storeType: string;
  sortOrder: number;
  isVisible: boolean;
}

interface CategoryEditModalProps {
  category: Category;
  onClose: () => void;
  onSuccess: () => void;
}

export function CategoryEditModal({ category, onClose, onSuccess }: CategoryEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string>(category.image || "");
  const [tempUrl, setTempUrl] = useState("");

  const [formData, setFormData] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    href: category.href || "",
    storeType: category.storeType || "STORE",
    sortOrder: category.sortOrder || 0,
    isVisible: category.isVisible ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: name === "isVisible" ? (value === "true") : name === "sortOrder" ? Number(value) : value };
      // Auto-generate slug from name ONLY if the user hasn't touched/modified the slug manually from the original
      if (name === "name" && prev.slug === category.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: image || null,
          href: formData.href || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to update category");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-serif font-semibold text-gray-900">Edit Category</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Category Name *</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-colors text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">URL Slug *</label>
              <input
                type="text"
                required
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-colors text-sm font-mono text-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Store Placement Type *</label>
              <select
                name="storeType"
                value={formData.storeType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-colors text-sm bg-white"
              >
                <option value="STORE">🛍️ Ranique Store (Main Hub)</option>
                <option value="CLOTHING">👗 Ranique Clothing (Clothing Hub)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Custom Href Link (Optional)</label>
              <input
                type="text"
                name="href"
                value={formData.href}
                onChange={handleChange}
                placeholder="e.g. /shop?category=salwar-kameez"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Sort Order Position</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-colors text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Visibility Status</label>
              <select
                name="isVisible"
                value={formData.isVisible ? "true" : "false"}
                onChange={(e) => setFormData(p => ({ ...p, isVisible: e.target.value === "true" }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-colors text-sm bg-white"
              >
                <option value="true">Visible on Storefront</option>
                <option value="false">Hidden (Draft)</option>
              </select>
            </div>
          </div>

          {/* Image Upload section */}
          <div className="space-y-2 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              Category Cover Image
            </label>

            {image && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 shadow-sm mx-auto group">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex flex-col items-center gap-2 pt-1">
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
                      className="px-4 py-1.5 bg-brand-rose/10 text-brand-rose text-xs font-semibold rounded-lg hover:bg-brand-rose/20 transition-colors"
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
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (tempUrl) {
                      setImage(tempUrl);
                      setTempUrl("");
                    }
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-colors text-sm resize-none"
              placeholder="Describe this category..."
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-ink rounded-lg hover:bg-brand-ink/90 transition-colors flex items-center gap-1.5"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
