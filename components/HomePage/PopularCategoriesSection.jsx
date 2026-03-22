// components/HomePage/PopularCategoriesSection.jsx
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// Passes `priority={i < 3}` to each CategoryCard.
// The first 3 cards (index 0, 1, 2) get priority={true} — these are
// above the fold on mobile and are the LCP candidates.
// Cards 4–12 stay lazy. This is the standard Next.js recommended pattern
// for image grids: eager first viewport, lazy everything else.
// ─────────────────────────────────────────────────────────────────────────

import CategoryCard   from "@/components/customer/CategoryCard";
import Section        from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { getAllCategories } from "@/lib/fetchers/serverCategories";

const MAX_CATEGORIES = 12;

export default async function PopularCategoriesSection() {
  const categories = await getAllCategories();
  const top = categories.slice(0, MAX_CATEGORIES);

  return (
    <Section>
      <SectionHeading
        title="Popular Categories from"
        accent="Amrita Interior Design"
        subtitle="Explore our most loved category selections"
      />

      {top.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5">
          {top.map((cat, i) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              priority={i < 3}   // ← first 3 are above fold: load eagerly
            />
          ))}
        </div>
      )}
    </Section>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <span className="text-5xl mb-4 block">📦</span>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">No categories yet</h3>
      <p className="text-sm text-gray-500">Check back soon for new products!</p>
    </div>
  );
}