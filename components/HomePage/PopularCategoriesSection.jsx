// components/HomePage/PopularCategoriesSection.jsx
import CategoryCard from "@/components/customer/CategoryCard";
import { getAllCategories } from "@/lib/fetchers/serverCategories";

export default async function PopularCategoriesSection() {
  // Take only top 12 categories
  const categories = await getAllCategories();
  const topCategories = categories.slice(0, 12);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* ---------- Section Heading ---------- */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Popular Categories from <span className="text-orange-600">Amrita Interior Design</span>
        </h2>
        <p className="text-gray-600 text-sm">
          Explore our most loved category selections
        </p>
      </div>

      {/* ---------- Empty State ---------- */}
      {topCategories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No categories available
          </h3>
          <p className="text-gray-600">Check back soon for new products!</p>
        </div>
      ) : (
        /* ---------- Grid Layout ---------- */
        <div
          className="
            grid 
            grid-cols-3
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-6 sm:gap-8 lg:gap-10
          "
        >
          {topCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
