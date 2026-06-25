// components/customer/SSRProductGrid.js
//
// Pure server component — no "use client".
// Renders the first page of products as real HTML that Google reads
// without executing any JavaScript.
//
// This is intentionally minimal: just product name + link + image.
// CategoryPageClient replaces this grid on hydration with the full
// interactive version (prices, filters, pagination).

import Link from "next/link";
import Image from "next/image";

export default function SSRProductGrid({ products }) {
    if (!products || products.length === 0) return null;

    return (
        <div
            id="ssr-product-grid"
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5"
        >
            {products.map((product, index) => (
                <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    className="block bg-white border border-gray-100 hover:border-orange-100 hover:shadow-md transition-all duration-200"
                >
                    <article className="overflow-hidden flex flex-col">
                        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden shrink-0">
                            {product.images?.[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                                    className="object-contain p-2"
                                    priority={index === 0}          // ← add this
                                    loading={index === 0 ? "eager" : "lazy"}  // ← change this
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <span className="text-3xl">📦</span>
                                </div>
                            )}
                        </div>
                        <div className="px-3 py-2.5 flex flex-col gap-1">
                            {product.brand && (
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider truncate">
                                    {product.brand}
                                </p>
                            )}
                            <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug">
                                {product.name}
                            </h3>
                            <p className="text-sm font-semibold text-gray-900 mt-auto pt-1">
                                ₹{Number(product.retailDiscountPrice || product.retailPrice).toLocaleString("en-IN")}
                            </p>
                        </div>
                    </article>
                </Link>
            ))}
        </div>
    );
}