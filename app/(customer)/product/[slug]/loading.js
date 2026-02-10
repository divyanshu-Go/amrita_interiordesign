// app/(customer)/product/[slug]/loading.js
export default function ProductLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 animate-pulse">
        {/* Breadcrumb */}
        <div className="h-3 w-64 bg-gray-200 rounded mb-4" />

        {/* ===== PRODUCT SECTION ===== */}
        <div
          className="
            grid grid-cols-1 
            sm:grid-cols-[auto_1fr] 
            gap-4 sm:gap-6 mb-6
          "
        >
          {/* LEFT: Image Gallery */}
          <div className="max-w-md w-full mx-auto md:mx-0">
            <div className="w-full h-[360px] bg-gray-200 rounded-md" />
            <div className="flex gap-2 mt-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-gray-200 rounded"
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-3 w-full">
            {/* Brand + Share */}
            <div className="flex items-center justify-between">
              <div className="h-2 w-24 bg-gray-200 rounded" />
              <div className="h-2 w-12 bg-gray-200 rounded" />
            </div>

            {/* Product Name */}
            <div className="h-4 w-3/4 bg-gray-200 rounded" />

            {/* Price Box */}
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-3 w-12 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Color Variants */}
            <div className="space-y-1">
              <div className="h-2 w-16 bg-gray-200 rounded" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-gray-200 rounded"
                  />
                ))}
              </div>
            </div>

            {/* Pattern Variants */}
            <div className="space-y-1">
              <div className="h-2 w-20 bg-gray-200 rounded" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-gray-200 rounded"
                  />
                ))}
              </div>
            </div>

            {/* Featured badge */}
            <div className="h-4 w-24 bg-gray-200 rounded" />

            {/* Add to cart */}
            <div className="h-10 w-full bg-gray-200 rounded-sm" />

            {/* Contact buttons */}
            <div className="grid grid-cols-12 gap-1.5">
              <div className="col-span-5 h-10 bg-gray-200 rounded-sm" />
              <div className="col-span-5 h-10 bg-gray-200 rounded-sm" />
              <div className="col-span-2 h-10 bg-gray-200 rounded-sm" />
            </div>
          </div>
        </div>

        {/* ===== DETAILS SECTION ===== */}
        <div className="bg-white rounded-md p-4 mb-6 space-y-2">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-3 w-full bg-gray-200 rounded"
            />
          ))}
        </div>

        {/* ===== TRUST BADGES ===== */}
        <div className="flex gap-4 justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-24 h-10 bg-gray-200 rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
