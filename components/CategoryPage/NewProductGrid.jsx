// components/CategoryPage/NewProductGrid.jsx

import NewProductCard from "./NewProductCard";

export default function NewProductGrid({ products, user = null }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-md border-2 border-dashed border-gray-300 p-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
      {products.map((product) => (
        <NewProductCard
          key={product._id || product.slug}
          product={product}
          user={user}
        />
      ))}
    </div>
  );
}