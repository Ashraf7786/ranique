"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Bold, Italic, Underline, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export function AnnouncementForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(initialData?.text || "✨ First 100 Customers: Use coupon RANIQUE100 ✨");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const insertTag = (startTag: string, endTag: string = "") => {
    // Simple helper to append formatting
    setText((prev) => `${prev} ${startTag}Your Text${endTag} `);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, isActive }),
      });

      if (!res.ok) throw new Error("Failed to save announcement");

      toast.success("Announcement updated successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-brand-ink mb-2">
          Announcement Bar Status
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isActive ? "bg-brand-rose" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-600 font-medium">
            {isActive ? "Visible on Storefront" : "Hidden"}
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-brand-ink">
            Announcement Text
          </label>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button type="button" onClick={() => insertTag("<b>", "</b>")} className="p-1.5 hover:bg-white rounded text-gray-700 hover:text-brand-rose transition-colors" title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => insertTag("<i>", "</i>")} className="p-1.5 hover:bg-white rounded text-gray-700 hover:text-brand-rose transition-colors" title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => insertTag("<u>", "</u>")} className="p-1.5 hover:bg-white rounded text-gray-700 hover:text-brand-rose transition-colors" title="Underline">
              <Underline className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => insertTag("✨")} className="p-1.5 hover:bg-white rounded text-gray-700 hover:text-brand-rose transition-colors" title="Sparkle Emoji">
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-brand-border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-rose/20 transition-all font-sans"
          placeholder="e.g. ✨ Free shipping on all orders over ₹499! ✨"
          required
        />
        <p className="text-xs text-gray-500 mt-2">
          You can use standard emojis 😊, numbers 100, and basic HTML tags like &lt;b&gt;bold&lt;/b&gt; or &lt;span style="color: yellow;"&gt;colored text&lt;/span&gt;.
        </p>
      </div>

      {/* Live Preview */}
      <div className="pt-4 border-t border-gray-100">
        <label className="block text-xs font-semibold text-brand-slate uppercase tracking-wider mb-3">
          Live Preview
        </label>
        <div className="bg-brand-ink text-brand-rose py-2 flex items-center w-full overflow-hidden h-10 border-b border-brand-rose/20 rounded-lg">
          <marquee scrollamount="6" className="w-full text-sm font-semibold tracking-wide flex items-center">
            <span dangerouslySetInnerHTML={{ __html: text || "Your announcement will appear here" }} />
          </marquee>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-brand-ink text-white rounded-xl hover:bg-brand-slate transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {loading ? "Saving..." : "Save Announcement"}
        </button>
      </div>
    </form>
  );
}
