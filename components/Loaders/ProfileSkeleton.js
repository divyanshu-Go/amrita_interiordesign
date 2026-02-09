export function ProfileSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Name field skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Email field skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Join date skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function EnterpriseProfileSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 mt-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Business name skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
      </div>

      {/* GST skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Status skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}