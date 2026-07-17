"use client";

import { useEffect } from "react";

export default function ContactError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Contact page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Something went wrong!</h2>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono text-left break-words">
          {error.message || "Unknown error occurred"}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-brand-ink text-white rounded-full hover:bg-gray-900 transition-colors text-sm font-semibold mt-4"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
