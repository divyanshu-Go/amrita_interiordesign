// components/customer/PopularProducts.jsx
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// BEFORE: "use client" + received userRole as a prop.
//   Had zero hooks, zero state, zero effects.
//   Passed userRole down to ProductCardGrid.
//
// AFTER: No "use client" = server component.
//   ProductCardGrid now calls useAuth() internally and resolves
//   userRole itself — no prop needed here.
//   The section structure, heading, and ScrollRow wrapper are
//   server-rendered HTML. Only ProductCardGrid ships client JS.
// ─────────────────────────────────────────────────────────────────────────

import Section        from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollRow      from "@/components/ui/ScrollRow";
import ProductCardGrid from "./ProductCardGrid";

export default function PopularProducts({ products = [] }) {
  if (!products.length) return null;

  return (
    <Section>
      <SectionHeading
        title="Explore Popular Products from"
        accent="Amrita Interior Design"
        subtitle="Top-rated picks customers love the most"
      />

      <ScrollRow autoplayMs={2500} scrollAmount={280}>
        {products.map((product) => (
          <div
            key={product._id}
            className="flex-shrink-0 w-[62%] sm:w-[38%] md:w-[28%] lg:w-[22%]"
          >
            {/* ProductCardGrid handles userRole internally via useAuth() */}
            <ProductCardGrid product={product} />
          </div>
        ))}
      </ScrollRow>
    </Section>
  );
}