// account/loading.js
// This file provides skeleton UI while data is loading
// Next.js automatically shows this while the page is being rendered

export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto px-3 py-4 space-y-6">
      {/* Personal Info Card Skeleton */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="h-6 w-40 bg-gray-300 rounded animate-pulse" />
          <div className="h-5 w-16 bg-gray-300 rounded animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Email Field */}
          <div>
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Last Updated */}
          <div className="pt-3 border-t border-gray-100">
            <div className="h-4 w-48 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Account Status Info Skeleton */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="h-5 w-48 bg-blue-300 rounded animate-pulse mb-2" />
        <div className="h-4 w-40 bg-blue-300 rounded animate-pulse" />
      </div>

      {/* Enterprise Profile Card Skeleton (if applicable) */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header Skeleton */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
            </div>
            <div className="h-6 w-24 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-6 space-y-5">
          {/* Alert Skeleton */}
          <div className="h-16 bg-yellow-50 border border-yellow-200 rounded animate-pulse" />

          {/* Business Name */}
          <div>
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          {/* GST Number */}
          <div>
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Phone */}
          <div>
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}