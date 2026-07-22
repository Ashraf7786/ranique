"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Shield, ShieldOff, Copy, CheckCheck } from "lucide-react";

interface StaffMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: string;
  createdAt: string;
  staffProfile: { staffCode: string; isActive: boolean };
  _count: { listedProducts: number };
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "STAFF" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/staff");
      if (res.ok) setStaff(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || "Failed to create account"); return; }
      setShowForm(false);
      setForm({ firstName: "", lastName: "", email: "", password: "", role: "STAFF" });
      fetchStaff();
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this staff account? Their listed products will remain.")) return;
    setActionLoading(id);
    try {
      await fetch(`/api/staff/${id}`, { method: "DELETE" });
      setStaff(prev => prev.filter(s => s.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) {
        setStaff(prev => prev.map(s =>
          s.id === id ? { ...s, staffProfile: { ...s.staffProfile, isActive: !current } } : s
        ));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-ink">Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage Staff and Admin accounts.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-ink/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Account
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">New Team Account</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <input required placeholder="First Name" value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
            <input placeholder="Last Name" value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
            <input required type="email" placeholder="Email Address" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold col-span-2" />
            <input required type="password" placeholder="Set Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold" />
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold bg-white"
            >
              <option value="STAFF">Staff (Limited Access)</option>
              <option value="ADMIN">Admin (Full Access)</option>
            </select>
            {formError && <p className="col-span-2 text-sm text-red-600">{formError}</p>}
            <div className="col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={formLoading}
                className="px-4 py-2 text-sm bg-brand-ink text-white rounded-lg hover:bg-brand-ink/90 flex items-center gap-2">
                {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">ID & Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Name / Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Products Listed</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
              </td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-500">No staff accounts yet.</td></tr>
            ) : staff.map((s, idx) => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-brand-gold bg-brand-gold/10 px-2 py-1 rounded">
                      {s.staffProfile?.staffCode || s.id.slice(0,8)}
                    </span>
                    {s.staffProfile && (
                      <button onClick={() => copyToClipboard(s.staffProfile.staffCode, s.id)}
                        className="text-gray-400 hover:text-brand-gold transition-colors">
                        {copiedId === s.id ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                  <p className="text-xs font-semibold mt-1 text-gray-500">{s.role}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{s.firstName} {s.lastName}</p>
                  <p className="text-xs text-gray-500">{s.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-brand-ink">{s._count.listedProducts}</span>
                  <span className="text-xs text-gray-500 ml-1">products</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    s.staffProfile?.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}>
                    {s.staffProfile?.isActive ? "Active" : "Suspended"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => handleToggleActive(s.id, s.staffProfile?.isActive ?? true)}
                      disabled={actionLoading === s.id || !s.staffProfile}
                      title={s.staffProfile?.isActive ? "Suspend" : "Activate"}
                      className="text-gray-400 hover:text-brand-gold transition-colors p-1 disabled:opacity-50"
                    >
                      {actionLoading === s.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : s.staffProfile?.isActive ? (
                        <ShieldOff className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={actionLoading === s.id}
                      title="Delete staff account"
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
