// components/customer/RelatedProductsRow.jsx
//


import ScrollRow       from "@/components/ui/ScrollRow";
import ProductCardGrid from "@/components/customer/ProductCardGrid";

export default function RelatedProductsRow({ title, products = [] }) {
  if (!products.length) return null;

  return (
    <section className="w-full mx-auto py-4 sm:py-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 px-1">
        {title}
      </h3>

      <ScrollRow scrollAmount={280}>
        {products.map((product) => (
          <div
            key={product._id}
            className="flex-shrink-0 w-[48%] sm:w-[38%] md:w-[26%] lg:w-[20%]"
          >
            {/* ProductCardGrid is "use client" and handles userRole internally */}
            <ProductCardGrid product={product} />
          </div>
        ))}
      </ScrollRow>
    </section>
  );
}