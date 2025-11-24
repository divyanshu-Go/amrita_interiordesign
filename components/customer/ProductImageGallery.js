"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageGallery({ images, productName }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-7xl">📦</span>
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
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square rounded-sm border border-gray-100 
                      bg-white pattern-dots-sm text-gray-300 flex flex-col justify-center">
        <img
          src={images[selectedImage]}
          alt={`${productName} image ${selectedImage + 1}`}
          className="w-full object-contain rounded-xs"
        />

        {/* Prev Button */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 
                       bg-black/20 hover:bg-black/40 text-white 
                       p-2 rounded-full backdrop-blur-sm transition-all 
                       hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 
                       bg-black/20 hover:bg-black/40 text-white 
                       p-2 rounded-full backdrop-blur-sm transition-all 
                       hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 w-full flex justify-center gap-2 ">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === selectedImage
                      ? "w-6 bg-gray-800"
                      : "w-2 bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-[4/3] rounded-sm overflow-hidden 
                          border border-gray-200 transition-all 
                          hover:scale-[1.02] ${selectedImage === index ? "ring-2 ring-gray-400/40" : ""}`}
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

