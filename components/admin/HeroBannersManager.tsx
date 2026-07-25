"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Zap, Star, Gift,
  GripVertical, ChevronUp, ChevronDown, Image as ImageIcon,
  Loader2, X, Check, AlertTriangle, Sparkles
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroBanner {
  id: string;
  type: "REGULAR" | "FLASH_SALE" | "FESTIVE_SALE";
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
  image: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  bgColor: string;
  bgGradient?: string;
  isSale: boolean;
  saleLabel?: string;
  saleEndDate?: string;
  discountPercent?: number;
  saleBadge?: string;
  festiveTheme?: string;
  sortOrder: number;
  isActive: boolean;
}

const EMPTY_BANNER: Omit<HeroBanner, "id" | "sortOrder" | "isActive"> = {
  type: "REGULAR",
  eyebrow: "",
  title: "",
  emphasis: "",
  description: "",
  image: "",
  primaryLabel: "Shop Now",
  primaryHref: "/shop",
  secondaryLabel: "",
  secondaryHref: "",
  bgColor: "#FAFAFA",
  bgGradient: "",
  isSale: false,
  saleLabel: "",
  saleEndDate: "",
  discountPercent: undefined,
  saleBadge: "",
  festiveTheme: "",
};

const TYPE_STYLES: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  REGULAR: { label: "Regular", color: "bg-blue-100 text-blue-700", icon: <ImageIcon className="w-3 h-3" /> },
  FLASH_SALE: { label: "Flash Sale", color: "bg-red-100 text-red-700", icon: <Zap className="w-3 h-3" /> },
  FESTIVE_SALE: { label: "Festive Sale", color: "bg-orange-100 text-orange-700", icon: <Sparkles className="w-3 h-3" /> },
};

const FESTIVE_THEMES = ["DIWALI", "EID", "HOLI", "CHRISTMAS", "NAVRATRI", "RAKSHA_BANDHAN", "DURGA_PUJA"];
const SALE_BADGES = ["LIVE", "HOT", "LIMITED", "EXCLUSIVE", "MEGA", "BUMPER"];

// ─── Main Component ────────────────────────────────────────────────────────────

export function HeroBannersManager() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [form, setForm] = useState<typeof EMPTY_BANNER>(EMPTY_BANNER);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch all banners (admin gets all including inactive)
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hero-banners/admin");
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load banners", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  // ── Open modal for create or edit
  const openCreate = () => {
    setEditingBanner(null);
    setForm({ ...EMPTY_BANNER });
    setModalOpen(true);
  };

  const openEdit = (b: HeroBanner) => {
    setEditingBanner(b);
    setForm({
      type: b.type,
      eyebrow: b.eyebrow,
      title: b.title,
      emphasis: b.emphasis,
      description: b.description,
      image: b.image,
      primaryLabel: b.primaryLabel,
      primaryHref: b.primaryHref,
      secondaryLabel: b.secondaryLabel || "",
      secondaryHref: b.secondaryHref || "",
      bgColor: b.bgColor,
      bgGradient: b.bgGradient || "",
      isSale: b.isSale,
      saleLabel: b.saleLabel || "",
      saleEndDate: b.saleEndDate ? new Date(b.saleEndDate).toISOString().slice(0, 16) : "",
      discountPercent: b.discountPercent,
      saleBadge: b.saleBadge || "",
      festiveTheme: b.festiveTheme || "",
    });
    setModalOpen(true);
  };

  // ── Save (create or update)
  const handleSave = async () => {
    if (!form.eyebrow || !form.title || !form.emphasis || !form.image || !form.primaryLabel || !form.primaryHref) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        saleEndDate: form.saleEndDate ? new Date(form.saleEndDate).toISOString() : null,
        discountPercent: form.discountPercent ? Number(form.discountPercent) : null,
        secondaryLabel: form.secondaryLabel || null,
        secondaryHref: form.secondaryHref || null,
        bgGradient: form.bgGradient || null,
        saleLabel: form.saleLabel || null,
        saleBadge: form.saleBadge || null,
        festiveTheme: form.festiveTheme || null,
      };

      if (editingBanner) {
        await fetch(`/api/hero-banners/${editingBanner.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showToast("Banner updated successfully!");
      } else {
        await fetch("/api/hero-banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, sortOrder: banners.length }),
        });
        showToast("Banner created successfully!");
      }
      setModalOpen(false);
      fetchBanners();
    } catch {
      showToast("Failed to save banner", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active
  const toggleActive = async (b: HeroBanner) => {
    try {
      await fetch(`/api/hero-banners/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !b.isActive }),
      });
      setBanners((prev) => prev.map((x) => x.id === b.id ? { ...x, isActive: !x.isActive } : x));
    } catch {
      showToast("Failed to toggle", "error");
    }
  };

  // ── Move order
  const moveOrder = async (id: string, direction: "up" | "down") => {
    const idx = banners.findIndex((b) => b.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === banners.length - 1)) return;
    const newBanners = [...banners];
    const swap = direction === "up" ? idx - 1 : idx + 1;
    [newBanners[idx], newBanners[swap]] = [newBanners[swap], newBanners[idx]];
    setBanners(newBanners);
    await Promise.all(
      newBanners.map((b, i) =>
        fetch(`/api/hero-banners/${b.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: i }),
        })
      )
    );
  };

  // ── Delete
  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/hero-banners/${id}`, { method: "DELETE" });
      setBanners((prev) => prev.filter((b) => b.id !== id));
      showToast("Banner deleted.");
    } catch {
      showToast("Failed to delete", "error");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  const setField = (key: keyof typeof EMPTY_BANNER, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-gray-900">Hero Banners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage homepage slider slides — Regular, Flash Sale & Festive</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-rose text-white text-sm font-semibold rounded-xl hover:bg-brand-rose-dark transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-rose animate-spin" /></div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No banners yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Banner" to create your first slide.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((b, idx) => {
            const typeStyle = TYPE_STYLES[b.type] || TYPE_STYLES.REGULAR;
            return (
              <div key={b.id} className={`bg-white border rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-sm ${b.isActive ? "border-gray-200" : "border-gray-200 opacity-60"}`}>
                {/* Thumbnail */}
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {b.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-400" /></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${typeStyle.color}`}>
                      {typeStyle.icon} {typeStyle.label}
                    </span>
                    {b.isSale && b.saleBadge && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                        ⚡ {b.saleBadge}
                      </span>
                    )}
                    {b.discountPercent && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        {b.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm truncate">{b.title} <em className="not-italic text-brand-rose">{b.emphasis}</em></p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{b.eyebrow}</p>
                </div>

                {/* Sort Controls */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => moveOrder(b.id, "up")} disabled={idx === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronUp className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => moveOrder(b.id, "down")} disabled={idx === banners.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronDown className="w-4 h-4 text-gray-500" /></button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(b)}
                    title={b.isActive ? "Deactivate" : "Activate"}
                    className={`p-2 rounded-lg transition-colors ${b.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                  >
                    {b.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(b)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(b.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    disabled={deleting === b.id}
                  >
                    {deleting === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
              <div>
                <p className="font-semibold text-gray-900">Delete Banner?</p>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-serif text-lg font-semibold text-gray-900">
                {editingBanner ? "Edit Banner" : "Create New Banner"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="p-5 space-y-5">
              {/* Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Slide Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["REGULAR", "FLASH_SALE", "FESTIVE_SALE"] as const).map((t) => {
                    const s = TYPE_STYLES[t];
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setField("type", t)}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${form.type === t ? "border-brand-rose bg-brand-rose/5 text-brand-rose" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                      >
                        {s.icon} {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Eyebrow Tag *</label>
                  <input value={form.eyebrow} onChange={(e) => setField("eyebrow", e.target.value)} placeholder="e.g. New Summer Collection" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Headline Title *</label>
                  <input value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. Radiate Your" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Emphasis (Pink Text) *</label>
                  <input value={form.emphasis} onChange={(e) => setField("emphasis", e.target.value)} placeholder="e.g. Inner Glow" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description *</label>
                  <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={2} placeholder="Subtext shown below headline..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Image URL * (Cloudinary)</label>
                  <input value={form.image} onChange={(e) => setField("image", e.target.value)} placeholder="https://res.cloudinary.com/..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Primary Button Label *</label>
                  <input value={form.primaryLabel} onChange={(e) => setField("primaryLabel", e.target.value)} placeholder="Shop Now" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Primary Button Link *</label>
                  <input value={form.primaryHref} onChange={(e) => setField("primaryHref", e.target.value)} placeholder="/shop" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Secondary Button Label</label>
                  <input value={form.secondaryLabel} onChange={(e) => setField("secondaryLabel", e.target.value)} placeholder="View All (optional)" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Secondary Button Link</label>
                  <input value={form.secondaryHref} onChange={(e) => setField("secondaryHref", e.target.value)} placeholder="/shop (optional)" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                </div>
              </div>

              {/* Styling */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.bgColor} onChange={(e) => setField("bgColor", e.target.value)} className="h-10 w-12 rounded-lg border border-gray-200 cursor-pointer" />
                    <input value={form.bgColor} onChange={(e) => setField("bgColor", e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Sort Order</label>
                  <input type="number" min={0} value={form.discountPercent ?? ""} onChange={(e) => setField("discountPercent", e.target.value ? Number(e.target.value) : undefined)} placeholder="Discount % (e.g. 40)" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                </div>
              </div>

              {/* Flash / Festive Sale Fields */}
              {(form.type === "FLASH_SALE" || form.type === "FESTIVE_SALE") && (
                <div className={`rounded-2xl p-4 border-2 space-y-4 ${form.type === "FLASH_SALE" ? "border-red-200 bg-red-50/30" : "border-orange-200 bg-orange-50/30"}`}>
                  <div className="flex items-center gap-2">
                    {form.type === "FLASH_SALE" ? <Zap className="w-4 h-4 text-red-600" /> : <Sparkles className="w-4 h-4 text-orange-600" />}
                    <span className={`text-sm font-semibold ${form.type === "FLASH_SALE" ? "text-red-700" : "text-orange-700"}`}>
                      {form.type === "FLASH_SALE" ? "Flash Sale Settings" : "Festive Sale Settings"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Sale Badge</label>
                      <select value={form.saleBadge} onChange={(e) => setField("saleBadge", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose bg-white">
                        <option value="">None</option>
                        {SALE_BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Discount %</label>
                      <input type="number" min={1} max={100} value={form.discountPercent ?? ""} onChange={(e) => setField("discountPercent", e.target.value ? Number(e.target.value) : undefined)} placeholder="e.g. 40" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Countdown Label</label>
                      <input value={form.saleLabel} onChange={(e) => setField("saleLabel", e.target.value)} placeholder="Flash Sale Ends In:" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Sale End Date & Time</label>
                      <input type="datetime-local" value={form.saleEndDate} onChange={(e) => setField("saleEndDate", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-rose" />
                    </div>
                  </div>

                  {form.type === "FESTIVE_SALE" && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Festive Theme</label>
                      <div className="grid grid-cols-4 gap-2">
                        {FESTIVE_THEMES.map((t) => (
                          <button key={t} type="button" onClick={() => setField("festiveTheme", form.festiveTheme === t ? "" : t)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${form.festiveTheme === t ? "border-brand-rose bg-brand-rose text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                            {t.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-rose text-white text-sm font-semibold hover:bg-brand-rose-dark transition-all disabled:opacity-60 active:scale-95">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingBanner ? "Save Changes" : "Create Banner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
