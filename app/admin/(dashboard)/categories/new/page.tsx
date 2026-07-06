"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";

export default function NewCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
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
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/admin/categories");
      } else {
        const err = await res.json();
        alert(`Error: ${err.message || 'Failed to create category'}`);
      }
    } catch (err) {
      alert("Failed to create category. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
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
          <div>
            <label className="block text-sm font-semibold text-brand-ink mb-1.5">Category Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm"
              placeholder="e.g. Lipsticks"
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
              placeholder="e.g. lipsticks"
            />
            <p className="text-xs text-gray-500 mt-1">The URL-friendly version of the name.</p>
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
