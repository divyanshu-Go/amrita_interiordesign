// components/customer/TrendingCollections.js
"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TrendingCollections({ categories = [] }) {
  const scrollRef = useRef(null);
  if (!categories.length) return null;

  const scrollLeft = () =>
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });

  const scrollRight = () =>
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">

      {/* ----------------------------------------
          Heading
      ----------------------------------------- */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Trending Collections <span className="text-orange-600">of the Year</span>
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Explore the most-loved styles curated by our customers
        </p>
      </div>

      <div className="relative">

        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 hidden sm:flex
            bg-white shadow-md rounded-full p-2 hover:bg-gray-100 z-10 transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>

        {/* ----------------------------------------
            Scrollable Row
        ----------------------------------------- */}
        <div
          ref={scrollRef}
          className="
            flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-3
          "
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="
                min-w-[60%] sm:min-w-[40%] md:min-w-[30%] lg:min-w-[22%]
                bg-white rounded-md border border-gray-300 shadow-sm hover:shadow-md
                transition-all duration-200 overflow-hidden flex-shrink-0
              "
            >
              {/* Image */}
              <div className="h-36 sm:h-40 md:h-44 w-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                  {cat.name}
                </h3>

                {cat.trendingTagline && (
                  <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2 leading-snug">
                    {cat.trendingTagline}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:flex
            bg-white shadow-md rounded-full p-2 hover:bg-gray-100 z-10 transition"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>
      </div>
    </section>
  );
}
