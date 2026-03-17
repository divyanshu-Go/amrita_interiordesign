// components/customer/GetInspiredCarousel.js
"use client";

import { useState, useEffect, useRef } from "react";

export default function GetInspiredCarousel({
  slides = [],
  autoplayMs = 4000,
  title,
}) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);
  const timerRef = useRef(null);
  const total = slides.length;

  useEffect(() => {
    if (total < 2) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, autoplayMs);

    return () => clearInterval(timerRef.current);
  }, [autoplayMs, total]);

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + total) % total);
    resetTimer();
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % total);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (dx > 40) goPrev();
    else if (dx < -40) goNext();
  };

  if (!slides.length) return null;

  const wrap = (i) => (i + total) % total;
  const leftIdx = wrap(index - 1);
  const centerIdx = wrap(index);
  const rightIdx = wrap(index + 1);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ---------------- Title Block ---------------- */}
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}<span className="text-orange-600"> from Amrita Interior Design</span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Handpicked inspirations curated for modern homes
          </p>
        </div>
      )}

      {/* Carousel */}
      <div
        className="relative flex items-center justify-center gap-4 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* LEFT (small) */}
        <div
          className="hidden sm:block w-[18%] opacity-70 rounded-md overflow-hidden transition-all duration-300"
          style={{ height: "200px" }}
        >
          <img
            src={slides[leftIdx].url}
            alt={slides[leftIdx].caption || ""}
            className="w-full h-full object-cover rounded-md blur-[1px] brightness-90"
          />
        </div>

        {/* CENTER */}
        <div
          className="relative w-11/12 sm:w-1/2 rounded-md overflow-hidden shadow-md transition-all duration-300"
          style={{ height: "260px" }}
        >
          <img
            src={slides[centerIdx].url}
            alt={slides[centerIdx].caption || ""}
            className="w-full h-full object-cover rounded-md"
          />

          {slides[centerIdx].caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-2 px-3">
              <p className="text-white text-xs font-medium">
                {slides[centerIdx].caption}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT (small) */}
        <div
          className="hidden sm:block w-[18%] opacity-70 rounded-md overflow-hidden transition-all duration-300"
          style={{ height: "200px" }}
        >
          <img
            src={slides[rightIdx].url}
            alt={slides[rightIdx].caption || ""}
            className="w-full h-full object-cover rounded-md blur-[1px] brightness-90"
          />
        </div>

        {/* ARROWS */}
        {total > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md rounded-full p-2 shadow-sm hover:bg-white transition"
            >
              ‹
            </button>

            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md rounded-full p-2 shadow-sm hover:bg-white transition"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* DOTS */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === index ? "bg-gray-800 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
