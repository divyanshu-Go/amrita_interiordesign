export default function AccountLoader() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Personal Information Card Skeleton */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1">
            <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-64 bg-gray-100 rounded" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-10 w-full bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise Card Skeleton */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="mb-5">
          <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-64 bg-gray-100 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-10 w-full bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}