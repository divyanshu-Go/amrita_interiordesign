// app/(customer)/category/[slug]/test/loading.js

export default function Loading() {
  // simple skeleton for header + cards
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="animate-pulse">
        <div className="h-20 bg-gray-100 rounded-md mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-md border border-gray-200 p-4">
              <div className="h-40 bg-gray-400 rounded mb-3" />
              <div className="h-4 bg-gray-400 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-400 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
