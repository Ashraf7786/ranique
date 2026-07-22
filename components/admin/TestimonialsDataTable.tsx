"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Plus } from "lucide-react";
import { AddTestimonialModal } from "./AddTestimonialModal";

export function TestimonialsDataTable() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(testimonials.length / pageSize);
  const paginatedTestimonials = testimonials.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl lg:text-2xl font-serif font-bold text-gray-900">Customer Testimonials</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto bg-brand-ink text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-ink/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-sm">
                <th className="py-4 px-6 font-medium text-gray-500 w-16">S.No.</th>
                <th className="py-4 px-6 font-medium text-gray-500">Name / City</th>
                <th className="py-4 px-6 font-medium text-gray-500">Rating</th>
                <th className="py-4 px-6 font-medium text-gray-500">Content</th>
                <th className="py-4 px-6 font-medium text-gray-500">Status</th>
                <th className="py-4 px-6 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : paginatedTestimonials.length > 0 ? (
                paginatedTestimonials.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-gray-900">{t.name}</p>
                      {t.city && <p className="text-xs text-gray-500">{t.city}</p>}
                    </td>
                    <td className="py-4 px-6 text-sm text-yellow-500 font-medium whitespace-nowrap">
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-sm truncate">{t.content}</td>
                    <td className="py-4 px-6">
                      <select
                        disabled={actionLoading === t.id}
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 ring-1 ring-inset focus:ring-2 focus:ring-brand-gold cursor-pointer ${
                          t.status === "PUBLISHED"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-gray-50 text-gray-600 ring-gray-500/20"
                        }`}
                      >
                        <option value="PUBLISHED">Live</option>
                        <option value="DRAFT">Paused</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={actionLoading === t.id}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete Testimonial"
                      >
                        {actionLoading === t.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">No testimonials yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * pageSize, testimonials.length)}</span> of{" "}
              <span className="font-medium">{testimonials.length}</span> results
            </p>
            <div className="flex space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl p-8 flex justify-center border border-gray-200">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : paginatedTestimonials.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-sm text-gray-500 border border-gray-200">No testimonials yet.</div>
        ) : paginatedTestimonials.map((t, idx) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                {t.city && <p className="text-xs text-gray-500">{t.city}</p>}
                <p className="text-xs text-yellow-500 mt-0.5">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  disabled={actionLoading === t.id}
                  value={t.status}
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 ring-1 ring-inset cursor-pointer ${
                    t.status === "PUBLISHED"
                      ? "bg-green-50 text-green-700 ring-green-600/20"
                      : "bg-gray-50 text-gray-600 ring-gray-500/20"
                  }`}
                >
                  <option value="PUBLISHED">Live</option>
                  <option value="DRAFT">Paused</option>
                </select>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={actionLoading === t.id}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                >
                  {actionLoading === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{t.content}</p>
          </div>
        ))}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50">
                Prev
              </button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddTestimonialModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchTestimonials();
          }}
        />
      )}
    </div>
  );
}
