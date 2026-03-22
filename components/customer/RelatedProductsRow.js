// components/customer/RelatedProductsRow.jsx
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
//
// BEFORE: "use client" to call useAuth() for userRole, then pass it
//   down to ProductCardGrid as a prop.
//
// AFTER: No "use client". No useAuth(). No userRole prop.
//   ProductCardGrid now calls useAuth() internally (see ProductCardGrid.jsx).
//   This component is a pure server component — it renders static HTML
//   on the server. ProductCardGrid is a client component INSIDE it, which
//   is perfectly valid in Next.js App Router.
//
// The key insight: a server component CAN render client components as
// children. The server renders the layout/structure; the client component
// handles the interactive/auth-dependent pricing part.
//
// Net result: the ScrollRow wrapper and section structure are now
// server-rendered HTML. Only ProductCardGrid itself ships client JS.
// ─────────────────────────────────────────────────────────────────────────

import ScrollRow       from "@/components/ui/ScrollRow";
import ProductCardGrid from "@/components/customer/ProductCardGrid";

export default function RelatedProductsRow({ title, products = [] }) {
  if (!products.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
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