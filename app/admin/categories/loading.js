export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Form skeleton */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>

      {/* Products list skeleton */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
