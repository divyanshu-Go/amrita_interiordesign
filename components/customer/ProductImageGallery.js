"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageGallery({ images, productName }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-8xl">📦</span>
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image with Navigation */}
      <div className="relative w-full aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        <img
          src={images[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="w-full h-full object-contain"
        />
        
        {/* Navigation Arrows - Only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-xs font-medium">
              {selectedImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-gray-200 hover:border-orange-300"
              }`}
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