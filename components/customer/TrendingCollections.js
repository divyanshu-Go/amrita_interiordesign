// components/customer/TrendingCollections.jsx
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// BEFORE: "use client" — but this component has:
//   • Zero useState, zero useEffect, zero event handlers
//   • Pure display: receives categories as props → renders JSX
//   • "use client" was there by habit/assumption
//
// AFTER: No "use client" = server component.
//   ScrollRow inside it is "use client" — that's fine.
//   Server components CAN render client components as children.
//   The section heading, card layout, and Link elements are now
//   server-rendered HTML — zero JS shipped for this part.
// ─────────────────────────────────────────────────────────────────────────

import Link           from "next/link";
import Image          from "next/image";
import Section        from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollRow      from "@/components/ui/ScrollRow";

export default function TrendingCollections({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <Section>
      <SectionHeading
        title="Trending Collections"
        accent="of the Year"
        subtitle="Explore the most-loved styles curated by our customers"
      />

      <ScrollRow scrollAmount={300}>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="
              flex-shrink-0 w-[62%] sm:w-[40%] md:w-[30%] lg:w-[22%]
              group bg-white rounded-xl border border-gray-200
              hover:border-orange-300 hover:shadow-md
              transition-all duration-200 overflow-hidden
            "
          >
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-gray-100">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 62vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 22vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-50">
                  <span className="text-4xl">🏠</span>
                </div>
              )}
            </div>

            <div className="p-3.5">
              <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                {cat.name}
              </h3>
              {cat.trendingTagline && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-snug">
                  {cat.trendingTagline}
                </p>
              )}
            </div>
          </Link>
        ))}
      </ScrollRow>
    </Section>
  );
}