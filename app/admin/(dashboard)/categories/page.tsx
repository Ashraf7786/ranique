"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from "@/components/admin/AdminIcons";
import { CategoryEditModal } from "@/components/admin/CategoryEditModal";
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"STORE" | "CLOTHING">("STORE");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch categories", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete category.");
      }
    } catch (error) {
      alert("Error deleting category.");
    }
  };

  // Filter categories by type for current active tab
  const filteredCategories = categories
    .filter((cat) => cat.storeType === activeTab)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-ink dark:text-white">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage storefront category navigation & layout options</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-brand-rose text-white rounded-lg text-sm font-medium hover:bg-brand-rose/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("STORE")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "STORE"
              ? "border-brand-rose text-brand-rose"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          🛍️ Ranique Store (Main Hub)
        </button>
        <button
          onClick={() => setActiveTab("CLOTHING")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "CLOTHING"
              ? "border-brand-rose text-brand-rose"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          👗 Ranique Clothing (Clothing Hub)
        </button>
      </div>

      {/* Desktop Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-16">S.No.</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-20">Image</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name & Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Link Redirect</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-20">Order</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    No categories found for this section.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    
                    {/* Index S.No. */}
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {idx + 1}
                    </td>

                    {/* Thumbnail Image */}
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 flex items-center justify-center">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </td>

                    {/* Name & description */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-semibold text-brand-ink dark:text-white text-sm">{cat.name}</p>
                      {cat.description ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{cat.description}</p>
                      ) : (
                        <p className="text-2xs text-gray-400 italic mt-0.5">No description</p>
                      )}
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-800 rounded inline-block mt-4 mb-4">
                      {cat.slug}
                    </td>

                    {/* Link */}
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {cat.href ? (
                        <span className="font-semibold text-brand-rose font-mono break-all">{cat.href}</span>
                      ) : (
                        <span className="italic font-mono text-gray-400">/shop?category={cat.slug}</span>
                      )}
                    </td>

                    {/* Order */}
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {cat.sortOrder}
                    </td>

                    {/* Status Toggle Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          cat.isVisible
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {cat.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-rose dark:hover:text-brand-rose transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center justify-center"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 inline-flex items-center justify-center"
                        title="Delete Category"
                      >
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

      {/* Mobile Cards (Visible only on mobile viewports) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 flex justify-center border border-gray-200 dark:border-gray-800 shadow-sm">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 shadow-sm">
            No categories found for this section.
          </div>
        ) : (
          filteredCategories.map((cat, idx) => (
            <div key={cat.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500">#{idx + 1}</span>
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-brand-ink dark:text-white">{cat.name}</h4>
                    <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mt-0.5">{cat.slug}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    cat.isVisible
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {cat.isVisible ? "Visible" : "Hidden"}
                </span>
              </div>

              {cat.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{cat.description}</p>
              )}

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="space-y-0.5">
                  <p>Sort Order: <span className="font-semibold text-gray-800 dark:text-gray-200">{cat.sortOrder}</span></p>
                  {cat.href && (
                    <p className="text-[10px] text-brand-rose truncate max-w-[200px]" title={cat.href}>Link: {cat.href}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-brand-rose transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editing Category slide-over/modal */}
      {editingCategory && (
        <CategoryEditModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={() => {
            setEditingCategory(null);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}
