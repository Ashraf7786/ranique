"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface EditRequest {
  id: string;
  status: string;
  createdAt: string;
  adminNote: string | null;
  requestedData: Record<string, any>;
  product: {
    id: string;
    title: string;
    images: { url: string; isCover: boolean }[];
  };
  staff: {
    firstName: string;
    lastName: string | null;
    email: string;
    staffProfile: { staffCode: string };
  };
}

export default function AdminProductRequestsPage() {
  const [requests, setRequests] = useState<EditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/product-requests?status=${filter}`);
      if (res.ok) setRequests(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [filter]);

  const handleAction = async (id: string, action: "APPROVED" | "REJECTED", note?: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/product-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminNote: note }),
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const IGNORED_FIELDS = ["id", "staffId", "createdAt", "updatedAt", "deletedAt"];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-ink">Product Edit Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve or reject product changes submitted by staff.</p>
        </div>
        <div className="flex gap-2">
          {["PENDING", "APPROVED", "REJECTED"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === s ? "bg-brand-ink text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" /></div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-sm text-gray-500">
            No {filter.toLowerCase()} requests.
          </div>
        ) : requests.map(req => {
          const coverImg = req.product.images.find(i => i.isCover) || req.product.images[0];
          const isExpanded = expanded === req.id;
          const requestedFields = Object.entries(req.requestedData).filter(
            ([k]) => !IGNORED_FIELDS.includes(k)
          );

          return (
            <div key={req.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-4 p-5">
                {coverImg && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={coverImg.url} alt={req.product.title} width={56} height={56} className="object-cover w-full h-full" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{req.product.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Requested by{" "}
                    <span className="font-medium text-brand-gold">{req.staff.staffProfile.staffCode}</span>
                    {" "}({req.staff.firstName} {req.staff.lastName}) ·{" "}
                    {new Date(req.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    req.status === "PENDING" ? "bg-yellow-50 text-yellow-700"
                    : req.status === "APPROVED" ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                  }`}>{req.status}</span>
                  <button onClick={() => setExpanded(isExpanded ? null : req.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Changes */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-5">
                  <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">Requested Changes</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {requestedFields.map(([key, value]) => (
                      <div key={key} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-600 font-mono mb-1">{key}</p>
                        <p className="text-sm text-gray-900 font-medium break-words">
                          {typeof value === "boolean" ? (value ? "Yes" : "No")
                            : typeof value === "object" ? JSON.stringify(value, null, 2)
                            : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {req.status === "PENDING" && (
                    <div className="flex gap-3 mt-5 justify-end">
                      <button
                        onClick={() => handleAction(req.id, "REJECTED")}
                        disabled={actionLoading === req.id}
                        className="flex items-center gap-2 px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        {actionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "APPROVED")}
                        disabled={actionLoading === req.id}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {actionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve & Apply
                      </button>
                    </div>
                  )}
                  {req.adminNote && (
                    <p className="mt-3 text-sm text-gray-500 italic">Admin note: {req.adminNote}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
