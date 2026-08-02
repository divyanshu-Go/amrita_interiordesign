// components/customer/NewProductGrid.jsx
//
// ── WHY THIS IS A SERVER COMPONENT ──────────────────────────────────────
// This only maps an array it already received to a grid of cards. No
// fetching, no loading state, no error state — those belong to the page
// (the page either has products or it doesn't, by the time this renders).
// ─────────────────────────────────────────────────────────────────────────

import NewProductCard from "./NewProductCard";

export default function NewProductGrid({ products, userRole, enterpriseStatus }) {
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
          userRole={userRole}
          enterpriseStatus={enterpriseStatus}
        />
      ))}
    </div>
  );
}