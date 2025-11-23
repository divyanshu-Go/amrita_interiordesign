import { getAllCategories } from "@/lib/fetchers/categories";
import CategoryCard from "@/components/customer/CategoryCard";

export default async function HomePage() {
  const categories = await getAllCategories();

  return (
    <div className="bg-white">
      

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Popular Categories
          </h2>
          <p className="text-gray-600">
            Explore our curated collection
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories available
            </h3>
            <p className="text-gray-600">Check back soon for new products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Indicators - Minimal */}
      <section className="bg-gray-50 border-y border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Premium Quality</h3>
              <p className="text-sm text-gray-600">Curated from top brands</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Across India</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Best Prices</h3>
              <p className="text-sm text-gray-600">Special enterprise rates</p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}