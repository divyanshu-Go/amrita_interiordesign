// components/customer/PopularProducts.js
"use client";

import { useRef, useEffect } from "react";
import ProductCardGrid from "./ProductCardGrid";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PopularProducts({ products = [], userRole = "user" }) {
  const scrollRef = useRef(null);
  if (!products.length) return null;

  /* -----------------------------------------
      Auto Scroll + Looping (Best Practice)
  -------------------------------------------*/
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let interval;

    const startAutoScroll = () => {
      interval = setInterval(() => {
        const { scrollLeft, clientWidth, scrollWidth } = container;

        // If reached the end → reset smoothly
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 250, behavior: "smooth" });
        }
      }, 2500);
    };

    const stopAutoScroll = () => clearInterval(interval);

    // Start scrolling
    startAutoScroll();

    // Pause on hover
    container.addEventListener("mouseenter", stopAutoScroll);
    container.addEventListener("mouseleave", startAutoScroll);

    return () => {
      stopAutoScroll();
      container.removeEventListener("mouseenter", stopAutoScroll);
      container.removeEventListener("mouseleave", startAutoScroll);
    };
  }, []);

  /* -----------------------------------------
      Manual Scroll (arrows)
  -------------------------------------------*/
  const scrollLeft = () =>
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });

  const scrollRight = () =>
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">

      {/* -------------------- Heading -------------------- */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Explore Popular Products from <span className="text-orange-600">Amrita Interior Design</span>
        </h2>
        <p className="text-gray-600 text-sm">
          Top-rated picks customers love the most
        </p>
      </div>

      <div className="relative">

        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 hidden sm:flex
            bg-white shadow-md rounded-full p-2 hover:bg-gray-100 z-10"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>

        {/* -------------------- Scrollable Row -------------------- */}
        <div
          ref={scrollRef}
          className="
            flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-3
          "
        >
          {products.map((product, index) => (
            <div
              key={product._id || index}
              className="
                min-w-[60%] sm:min-w-[38%] md:min-w-[28%] lg:min-w-[22%]
              "
            >
              <ProductCardGrid product={product} userRole={userRole} />
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:flex
            bg-white shadow-md rounded-full p-2 hover:bg-gray-100 z-10"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>
      </div>
    </section>
  );
}
