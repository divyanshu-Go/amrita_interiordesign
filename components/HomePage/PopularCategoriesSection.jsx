import Link from "next/link";
import Image from "next/image";
import {
  Blinds,
  Wallpaper,
  AlignJustify,
  Layers,
  Grid3x3,
  TreePine,
  Package,
  MoveRight,
} from "lucide-react";
import { getPopularCategories } from "@/lib/serversideFetchers/categories";

const CATEGORY_ICONS = {
  "pvc-panels": Blinds,
  "wallpaper": Wallpaper,
  "louvers": AlignJustify,
  "charcoal-panels": Layers,
  "wooden-flooring": Grid3x3,
  "pvc-fluted": TreePine,
};

export default async function PopularCategoriesSection() {
  const categories = await getPopularCategories(6);
  if (!categories || categories.length === 0) return null;

  return (
    <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Title Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Shop by <span className="text-[#ff5722]">Category</span>
        </h2>
        <span className="block w-12 h-1 bg-[#ff5722] rounded-full mx-auto mt-1.5 mb-2.5" />
        <p className="text-xs sm:text-sm text-neutral-500 font-medium">
          Explore our wide range of premium interior products
        </p>
      </div>

      {/* Grid — 3 items per row on Mobile, 6 on Desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 lg:gap-5">
        {categories.map((cat, index) => {
          const IconComponent = CATEGORY_ICONS[cat.slug] || Package;

          return (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center text-center bg-white border border-neutral-200/80 rounded-md p-1.5 sm:p-2.5 hover:shadow-md transition-all duration-200"
            >
              {/* Image Box */}
              <div className="relative w-full aspect-[4/4.2] rounded-sm overflow-hidden bg-neutral-100">
                <Image
                  src={cat.image || "/placeholder.jpg"}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={index < 3}
                />
              </div>

              {/* Overlapping Circle Icon */}
              <div className="relative -mt-5 sm:-mt-6 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#fff4f0] border border-white flex items-center justify-center shadow-sm">
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" strokeWidth={1.8} />
              </div>

              {/* Text Info */}
              <div className="mt-2 sm:mt-3 mb-1 flex flex-col items-center">
                <h3 className="text-[11px] sm:text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-[#ff5722] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 font-medium">
                  <span className="text-[#ff5722] font-bold">{cat.productCount}</span> Products
                </p>

                <MoveRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-2 text-[#ff5722] transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}