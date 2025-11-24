"use client";

import { useState } from "react";
import { Share2, Phone, MessageCircle, Check, Copy, ShoppingCart } from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import ProductVariants from "./ProductVariants";

export default function ProductPageClient({ product, variants, userRole }) {
  const [showCopied, setShowCopied] = useState(false);
  const [showNumberCopied, setShowNumberCopied] = useState(false);
  
  const isEnterprise = userRole === "enterprise";
  const phoneNumber = "+916299811965";

 // 🔥 New logic
let displayPrice;

if (product.showPerSqFtPrice) {
  displayPrice = product.perSqFtPrice;
} else {
  displayPrice = isEnterprise
    ? (product.enterpriseDiscountPrice || product.enterprisePrice)
    : (product.retailDiscountPrice || product.retailPrice);
}


  const originalPrice = isEnterprise
    ? product.enterprisePrice
    : product.retailPrice;

  const hasDiscount = isEnterprise
    ? product.enterpriseDiscountPrice && product.enterpriseDiscountPrice < product.enterprisePrice
    : product.retailDiscountPrice && product.retailDiscountPrice < product.retailPrice;

  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setShowNumberCopied(true);
      setTimeout(() => setShowNumberCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in ${product.name}. Link: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Left: Image Gallery - Smaller */}
        <div className="max-w-md mx-auto w-full">
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Product Details */}
        <div className="space-y-3">
          {/* Brand & Share */}
          <div className="flex items-center justify-between">
            {product.brand && (
              <p className="text-neutral-500 font-semibold text-xs uppercase tracking-wide">
                {product.brand}
              </p>
            )}
            <button
              onClick={handleShare}
              className="relative flex items-center gap-1.5 text-gray-600 hover:text-orange-600 transition-colors text-xs font-medium"
            >
              {showCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Product Name */}
          <h1 className="text-xl md:text-xl font-semibold text-gray-900 leading-tight">
            {product.name}
          </h1>

          
          {/* Price Section */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2.5">

  {product.showPerSqFtPrice ? (
    <>
      {/* MAIN PRICE PER SQ FT */}
      <span className="text-2xl font-bold text-gray-900">
        ₹{product.perSqFtPrice} / SqFt
      </span>

      {/* OLD PRICE RIGHT SIDE */}
      <span className="text-sm text-gray-400 ml-auto">
        ₹{originalPrice} / {product.sellBy}
      </span>
    </>
  ) : (
    // OLD LOGIC
    <>
      {hasDiscount ? (
        <>
          <span className="text-2xl font-bold text-gray-900">
            ₹{displayPrice}
          </span>
          <span className="text-base text-gray-400 line-through">
            ₹{originalPrice}
          </span>
        </>
      ) : (
        <span className="text-2xl font-bold text-gray-900">
          ₹{displayPrice}
        </span>
      )}
    </>
  )}
</div>

            {isEnterprise && (
              <p className="text-xs text-orange-600 mt-1.5 font-medium">
                ✓ Enterprise Price Applied
              </p>
            )}
            <p className="text-xs text-gray-600 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Add to Cart Button */}
          <button
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>

          {/* Order Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-lg font-semibold transition-colors text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg font-semibold transition-colors text-xs"
            >
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button
              onClick={handleCopyNumber}
              className="relative flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white p-2.5 rounded-lg transition-colors"
              title="Copy Number"
            >
              {showNumberCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Product Attributes */}
          <div className="grid grid-cols-2 gap-2 bg-white rounded-lg p-3 border border-gray-200">
            {product.color && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Color</p>
                <p className="font-semibold text-gray-900 text-xs">{product.color}</p>
              </div>
            )}
            {product.size && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Size</p>
                <p className="font-semibold text-gray-900 text-xs">{product.size}</p>
              </div>
            )}
            {product.thickness && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Thickness</p>
                <p className="font-semibold text-gray-900 text-xs">{product.thickness}mm</p>
              </div>
            )}
            {product.material?.length > 0 && (
  <div>
    <p className="text-xs text-gray-600 mb-0.5">Material</p>
    <p className="font-semibold text-gray-900 text-xs">
      {product.material.join(", ")}
    </p>
  </div>
)}

{product.pattern?.length > 0 && (
  <div>
    <p className="text-xs text-gray-600 mb-0.5">Pattern</p>
    <p className="font-semibold text-gray-900 text-xs">
      {product.pattern.join(", ")}
    </p>
  </div>
)}

{product.finish?.length > 0 && (
  <div>
    <p className="text-xs text-gray-600 mb-0.5">Finish</p>
    <p className="font-semibold text-gray-900 text-xs">
      {product.finish.join(", ")}
    </p>
  </div>
)}

{product.coverageArea && (
  <div>
    <p className="text-xs text-gray-600 mb-0.5">Coverage Area</p>
    <p className="font-semibold text-gray-900 text-xs">
      {product.coverageArea}
    </p>
  </div>
)}

{product.application?.length > 0 && (
  <div>
    <p className="text-xs text-gray-600 mb-0.5">Application</p>
    <p className="font-semibold text-gray-900 text-xs">
      {product.application.join(", ")}
    </p>
  </div>
)}

            {product.stock !== undefined && (
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Stock</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {product.stock > 0 ? `${product.stock} Available` : "Out of Stock"}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                Product Description
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5">
              <p className="text-orange-700 font-medium flex items-center gap-2 text-xs">
                <span>⭐</span>
                Featured Product
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Variants Section */}
      {variants && variants.length > 0 && (
        <div className="mt-6">
          <ProductVariants variants={variants} currentSlug={product.slug} />
        </div>
      )}
    </div>
  );
}