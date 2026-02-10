export default function AccountLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Compact Header with Icon Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-pulse">
          <div className="flex items-center gap-3">
            {/* Icon Badge */}
            <div className="w-12 h-12 rounded-lg bg-gray-200" />

            {/* Text */}
            <div className="flex-1">
              <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="sticky top-0 bg-white shadow-sm z-20 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="flex gap-0 overflow-x-auto">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="px-6 py-4 flex-1 sm:flex-none"
              >
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Card Skeleton */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded" />
          </div>

          {/* Content Lines */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}