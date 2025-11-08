import Link from "next/link";

export default function ProductVariants({ variants, currentSlug }) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Group variants by color
  const variantsByColor = variants.reduce((acc, variant) => {
    const color = variant.color || "Default";
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push(variant);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Available Variants
      </h3>
      
      <div className="space-y-4">
        {Object.entries(variantsByColor).map(([color, colorVariants]) => (
          <div key={color}>
            <p className="text-sm font-semibold text-gray-700 mb-2">{color}</p>
            <div className="grid grid-cols-2 gap-3">
              {colorVariants.map((variant) => (
                <Link
                  key={variant._id}
                  href={`/product/${variant.slug}`}
                  className={`group p-3 border-2 rounded-lg transition-all ${
                    variant.slug === currentSlug
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {variant.images && variant.images[0] ? (
                      <img
                        src={variant.images[0]}
                        alt={variant.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xl">
                        📦
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {variant.size || "Standard"}
                      </p>
                      {variant.thickness && (
                        <p className="text-xs text-gray-600">
                          {variant.thickness}mm
                        </p>
                      )}
                      {variant.stock > 0 ? (
                        <p className="text-xs text-green-600 font-medium">In Stock</p>
                      ) : (
                        <p className="text-xs text-red-600 font-medium">Out of Stock</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}