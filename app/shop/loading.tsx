import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
        <div>
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="w-4 h-4 rounded border border-gray-200 bg-gray-50" />
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <SkeletonGrid count={8} />
        </div>
      </div>
    </div>
  );
}
