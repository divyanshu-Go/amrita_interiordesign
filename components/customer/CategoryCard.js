import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="group flex flex-col gap-1 hover:-translate-y-1 transition-transform duration-200">
        {/* Image Section */}
        {category.image ? (
          <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50 border border-gray-200 group-hover:border-orange-700 group-hover:shadow-md transition-all duration-300">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            />
          </div>
        ) : (
          <div className="aspect-square bg-gradient-to-br from-orange-50 to-orange-100 rounded-md flex items-center justify-center border border-gray-200 group-hover:border-orange-700 group-hover:shadow-md transition-all duration-300">
            <span className="text-5xl">📁</span>
          </div>
        )}
        
        {/* Name Section */}
        <div className="bg-white rounded-md p-2.5 text-center border border-gray-200 group-hover:border-orange-200 group-hover:shadow-2xs transition-all duration-300">
          <h3 className="font-medium text-gray-900 group-hover:text-orange-800 transition-colors text-sm leading-tight line-clamp-2">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}