// app/(customer)/search/loading.js
export default function Loading() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
        {/* ----------------------------------
            LEFT SIDEBAR SKELETON
        ---------------------------------- */}
        <aside className="sm:col-span-4 md:col-span-3 col-span-12">
          <div className="bg-white border border-gray-200 rounded-md p-4 space-y-4">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-gray-200 rounded" />
            ))}
          </div>
        </aside>

        {/* ----------------------------------
            RIGHT SIDE SKELETON
        ---------------------------------- */}
        <main className="sm:col-span-8 md:col-span-9 col-span-12 space-y-6">
          {/* Category Header Skeleton */}
          <div className="bg-white border border-gray-200 rounded-md p-4 flex gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-48 bg-gray-200 rounded" />
              <div className="h-3 w-72 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Results Count Skeleton */}
          <div className="h-4 w-40 bg-gray-200 rounded" />

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-md p-3 space-y-3"
              >
                <div className="h-40 bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}
