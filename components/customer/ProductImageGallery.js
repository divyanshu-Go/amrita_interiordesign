// components/customer/ProductImageGallery.js
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageGallery({ images, productName }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-sm flex items-center justify-center">
        <span className="text-7xl">📦</span>
      </div>
    );
  }

  const handlePrevious = () =>
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleNext = () =>
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="max-w-lg w-full lg:px-4 mx-auto sm:mx-0 space-y-2">
      {/* ── Main Image ─────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-square rounded-sm border border-gray-100 bg-white overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={`${productName} image ${selectedImage + 1}`}
          className="w-full h-full object-contain"
        />

        {images.length > 1 && (
          <>
            {/* Prev */}
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2
                         bg-black/20 hover:bg-black/40 text-white
                         p-1.5 rounded-full backdrop-blur-sm
                         transition-all hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2
                         bg-black/20 hover:bg-black/40 text-white
                         p-1.5 rounded-full backdrop-blur-sm
                         transition-all hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-2 w-full flex justify-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === selectedImage
                      ? "w-5 bg-gray-800"
                      : "w-1.5 bg-gray-400 hover:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Thumbnails (match square aspect ratio of main image) ─────────── */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-1.5">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`
                relative aspect-square rounded-sm overflow-hidden
                border transition-all hover:scale-[1.03]
                ${selectedImage === index
                  ? "border-orange-500 ring-1 ring-orange-400"
                  : "border-gray-200 hover:border-gray-400"}
              `}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}