// components/customer/RelatedProductsRow.jsx
//
// Stays a Server Component — no "use client" needed here. ScrollRow (the
// horizontal-scroll wrapper) is a Client Component, but it only needs
// interactivity for the arrow buttons/autoplay/swipe; the cards inside it
// are passed in as `children`, so they can — and should — stay Server
// Components. This is why NewProductCard doesn't need "use client":
// passing a Server Component as another component's children is a normal,
// supported Next.js pattern.
//
// userRole/enterpriseStatus are passed down from the page (already
// resolved from trusted request headers) — no useAuth() call here.
// ─────────────────────────────────────────────────────────────────────────

import ScrollRow from "@/components/ui/ScrollRow";
import NewProductCard from "@/components/CategoryPage/NewProductCard";

export default function RelatedProductsRow({
  title,
  products = [],
  userRole = "user",
  enterpriseStatus = "unverified",
}) {
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
            <NewProductCard
              product={product}
              userRole={userRole}
              enterpriseStatus={enterpriseStatus}
            />
          </div>
        ))}
      </ScrollRow>
    </section>
  );
}