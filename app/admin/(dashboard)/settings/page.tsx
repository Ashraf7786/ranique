"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "Ranique",
    supportEmail: "support@ranique.com",
    currency: "INR",
    taxRate: "18",
    freeShippingThreshold: "999",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for settings
    setTimeout(() => {
      setLoading(false);
      alert("Settings saved successfully!");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-brand-ink">Store Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your store's configuration and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Settings */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-brand-ink mb-4 border-b border-gray-100 pb-2">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">Default Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm bg-white"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        </section>

        {/* E-commerce Settings */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-brand-ink mb-4 border-b border-gray-100 pb-2">Checkout & Taxes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">Default Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-1.5">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping.</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 bg-brand-ink text-white rounded-lg font-semibold text-sm hover:bg-black transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
