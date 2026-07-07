import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-100" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
              <div className="h-6 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-[400px]">
          <div className="h-6 w-48 bg-gray-200 rounded mb-8" />
          <div className="w-full h-64 bg-gray-50 rounded-lg" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-[400px]">
          <div className="h-6 w-32 bg-gray-200 rounded mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100" />
                  <div>
                    <div className="h-4 w-24 bg-gray-100 rounded mb-1" />
                    <div className="h-3 w-16 bg-gray-50 rounded" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
