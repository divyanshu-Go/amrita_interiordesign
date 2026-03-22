// components/customer/CategoryCard.jsx
//
// ── WHAT CHANGED & WHY — LCP FIX ─────────────────────────────────────────
// BEFORE: All category images used default lazy loading.
// The Popular Categories section is the first image grid visible on the
// homepage. The browser was discovering these images late — only after
// parsing the JS — and loading them lazily. This is why Lighthouse
// reported LCP of 25.8s. The first visible image on the page was being
// treated as low priority.
//
// AFTER: Accepts a `priority` prop (boolean). When true, next/image
// sets fetchpriority="high" and preloads the image in the <head>.
// The browser fetches it immediately, parallel to everything else.
// PopularCategoriesSection passes priority={true} for index 0, 1, 2
// (the first 3 cards, which are above the fold on mobile).
// All other cards remain lazy. This is the correct pattern.
//
// Expected LCP improvement: from ~25s → ~3-5s on mobile.
// ─────────────────────────────────────────────────────────────────────────

import Link  from "next/link";
import Image from "next/image";

export default function CategoryCard({ category, priority = false }) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <div className="flex flex-col gap-1.5 hover:-translate-y-1 transition-transform duration-200">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-orange-50 border border-gray-200 group-hover:border-orange-400 group-hover:shadow-md transition-all duration-250">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={priority}          // ← LCP FIX: first 3 cards load eagerly
              loading={priority ? undefined : "lazy"} // explicit lazy for the rest
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">📁</span>
            </div>
          )}
        </div>

        {/* Name */}
        <div className="rounded-md px-2 py-1.5 text-center border border-gray-100 group-hover:border-orange-200 bg-white transition-all duration-200">
          <h3 className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors leading-snug line-clamp-2">
            {category.name}
          </h3>
        </div>

      </div>
    </Link>
  );
}