// components/customer/VariantRow.jsx
//
// Just renders <a> links to sibling variant products. Navigation via a
// plain anchor tag needs no client-side JS at all — this stays a Server
// Component, same as NewPaginationLinks on the category page.

import Image from "next/image";

export default function VariantRow({ label, variants, nameKey, currentSlug }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <div className="flex gap-2 flex-wrap">
        {variants.map((v) => {
          const isActive = v.slug === currentSlug;
          return (
            <a key={v._id} href={`/product/${v.slug}`} className="flex flex-col items-center gap-1 group">
              <div
                className={`w-10 h-10 rounded-lg overflow-hidden border transition-colors ${
                  isActive
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-gray-200 group-hover:border-orange-400"
                }`}
              >
                {v.images?.[0] ? (
                  <Image src={v.images[0]} alt={v.name} width={40} height={40} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px]">?</div>
                )}
              </div>
              <p className="text-[9px] text-center text-gray-500 max-w-[40px] line-clamp-1">
                {(nameKey === "pattern" ? v.pattern?.[0] : v.color) || v.name}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}