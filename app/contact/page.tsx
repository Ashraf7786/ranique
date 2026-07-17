"use client";

import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Mail, MessageSquare, Bug, Phone, MapPin, UploadCloud, X, CheckCircle, Loader2 } from "lucide-react";

type FormType = "QUERY" | "BUG_REPORT";

export default function ContactUsPage() {
  const [formType, setFormType] = useState<FormType>("QUERY");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: formType,
          imageUrl: formType === "BUG_REPORT" ? imageUrl : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit request.");

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setImageUrl(null);

      // Auto clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-sand/10 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-ink mb-4">
            How can we help you?
          </h1>
          <p className="text-brand-slate text-lg">
            Whether you have a question about our collections or need to report a technical issue, we are here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-border">
              <h3 className="font-serif text-2xl font-bold text-brand-ink mb-6">Contact Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-mist flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand-rose" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-ink">Email Us</p>
                    <p className="text-brand-slate text-sm mt-1">support@ranique.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-mist flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-brand-rose" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-ink">Call Us</p>
                    <p className="text-brand-slate text-sm mt-1">+91 98765 43210</p>
                    <p className="text-xs text-brand-slate mt-0.5">Mon-Sat, 10 AM - 7 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-mist flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand-rose" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-ink">Visit Us</p>
                    <p className="text-brand-slate text-sm mt-1 leading-relaxed">
                      123 Ranique Boutique Avenue,<br />
                      Fashion District, Mumbai,<br />
                      Maharashtra 400001
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust badge */}
            <div className="bg-brand-ink rounded-3xl p-8 text-white text-center">
              <h4 className="font-serif text-xl font-bold mb-2">Ranique Guarantee</h4>
              <p className="text-gray-300 text-sm">
                We typically respond to all queries and bug reports within 24 hours. Your satisfaction is our priority.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-brand-border">
              
              {/* Tabs */}
              <div className="flex p-1 bg-brand-mist rounded-xl mb-8">
                <button
                  type="button"
                  onClick={() => setFormType("QUERY")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                    formType === "QUERY" ? "bg-white text-brand-ink shadow-sm" : "text-brand-slate hover:text-brand-ink"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" /> General Query
                </button>
                <button
                  type="button"
                  onClick={() => setFormType("BUG_REPORT")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                    formType === "BUG_REPORT" ? "bg-white text-brand-rose shadow-sm" : "text-brand-slate hover:text-brand-rose"
                  }`}
                >
                  <Bug className="w-4 h-4" /> Report a Bug
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Full Name *</label>
                    <input 
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Email Address *</label>
                    <input 
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Phone Number (Optional)</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    {formType === "QUERY" ? "How can we help? *" : "Describe the Bug *"}
                  </label>
                  <textarea 
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose transition-all resize-none"
                    placeholder={formType === "QUERY" ? "Write your query here..." : "Please describe what happened, what you expected, and steps to reproduce..."}
                  />
                </div>

                {/* Bug Reporter: File Upload */}
                {formType === "BUG_REPORT" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Attach Screenshot (Optional)</label>
                    
                    {!imageUrl ? (
                      <CldUploadWidget
                        uploadPreset="ranique_products" // reusing existing preset
                        onSuccess={(result: any) => {
                          setImageUrl(result.info.secure_url);
                        }}
                        options={{
                          maxFiles: 1,
                          resourceType: "image",
                          clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
                        }}
                      >
                        {({ open }) => (
                          <button
                            type="button"
                            onClick={() => open()}
                            className="w-full py-8 border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-brand-rose hover:bg-brand-rose/5 transition-colors group"
                          >
                            <UploadCloud className="w-8 h-8 mb-2 group-hover:text-brand-rose transition-colors" />
                            <span className="text-sm font-medium">Click to upload a screenshot</span>
                            <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                          </button>
                        )}
                      </CldUploadWidget>
                    ) : (
                      <div className="relative inline-block border border-gray-200 rounded-xl p-2 bg-gray-50">
                        <img src={imageUrl} alt="Uploaded screenshot" className="h-32 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => setImageUrl(null)}
                          className="absolute -top-3 -right-3 bg-white text-gray-500 hover:text-red-500 rounded-full p-1 shadow-md border border-gray-100 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Thank you for reaching out!</p>
                      <p className="mt-0.5 text-green-600">
                        {formType === "BUG_REPORT" 
                          ? "We have received your bug report. We will fix this bug as soon as possible!"
                          : "We've received your query and will get back to you shortly."}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand-ink text-white font-semibold rounded-xl hover:bg-gray-900 transition-all shadow-sm flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : formType === "BUG_REPORT" ? (
                    "Submit Bug Report"
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
