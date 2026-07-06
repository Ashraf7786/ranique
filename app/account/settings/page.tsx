"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, MapPin, Loader2, Save, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    dob: "",
    gender: "",
    address: {
      name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (res.ok) {
        const address = data.addresses?.find((a: any) => a.isDefault) || {};
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          mobileNumber: data.mobileNumber || "",
          dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
          gender: data.gender || "",
          address: {
            name: address.name || "",
            phone: address.phone || "",
            line1: address.line1 || "",
            line2: address.line2 || "",
            city: address.city || "",
            state: address.state || "",
            zip: address.zip || "",
            country: address.country || "India",
          }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addrField = name.split(".")[1];
      setForm(prev => ({ ...prev, address: { ...prev.address, [addrField]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to save profile");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-rose" /></div>;
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-transparent transition-all";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/account" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-ink mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-ink">Profile Settings</h1>
        <p className="text-gray-500 mt-2">Manage your personal information and default shipping address.</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Profile saved successfully!
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{error}</div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-brand-ink mb-6">
            <User className="w-5 h-5 text-brand-rose" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} placeholder="Jane" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} placeholder="Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Mobile Number</label>
              <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} className={inputClass} placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                <option value="">Select Gender</option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Email Address</label>
              <input value={session?.user?.email || ""} readOnly className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>
          </div>
        </div>

        {/* Saved Address */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-brand-ink mb-6">
            <MapPin className="w-5 h-5 text-brand-rose" /> Default Shipping Address
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Recipient Name</label>
                <input name="address.name" value={form.address.name} onChange={handleChange} className={inputClass} placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Contact Phone</label>
                <input name="address.phone" value={form.address.phone} onChange={handleChange} className={inputClass} placeholder="Phone for delivery" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Address Line 1</label>
              <input name="address.line1" value={form.address.line1} onChange={handleChange} className={inputClass} placeholder="House/Flat No., Building, Street" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Address Line 2 (Optional)</label>
              <input name="address.line2" value={form.address.line2} onChange={handleChange} className={inputClass} placeholder="Landmark, Area, Colony" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">City</label>
                <input name="address.city" value={form.address.city} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">State</label>
                <input name="address.state" value={form.address.state} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">PIN Code</label>
                <input name="address.zip" value={form.address.zip} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="px-8 py-3.5 bg-brand-ink text-white font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 min-w-[200px]">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
