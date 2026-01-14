// components/customer/RelatedProductsRow.jsx
"use client";

import Link from "next/link";
import ProductCardGrid from "@/components/customer/ProductCardGrid"; // adjust path if your card lives elsewhere
import { useAuth } from "@/app/providers/AuthProvider";

export default function RelatedProductsRow({ title, products = [] }) {
   const { userRole, loading } = useAuth();
  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
      {/* Title Row */}
      <div className=" flex items-center justify-between mb-3 px-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          {title}
        </h3>

        {/* Optional: view more link (disabled for now, can be added later) */}
        {/* <Link href="/" className="text-sm text-gray-600 hover:underline">View all</Link> */}
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-hide -mx-1 py-1">
        <div
          className="
            grid 
            auto-cols-[150px] 
            sm:auto-cols-[180px] 
            md:auto-cols-[220px] 
            grid-flow-col 
            gap-8 lg:gap-10
            px-1
          "
        >
          {products.map((product) => (
            <div key={product._id}>
              <ProductCardGrid product={product} userRole={userRole} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
