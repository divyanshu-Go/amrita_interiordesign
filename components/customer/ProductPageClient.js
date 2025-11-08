"use client";

import { useState } from "react";
import { Share2, Phone, MessageCircle, Check } from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import ProductVariants from "./ProductVariants";

export default function ProductPageClient({ product, variants, userRole }) {
  const [showCopied, setShowCopied] = useState(false);
  
  const isEnterprise = userRole === "enterprise";

  const displayPrice = isEnterprise
    ? product.enterpriseDiscountPrice || product.enterprisePrice
    : product.retailDiscountPrice || product.retailPrice;

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

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in ${product.name}. Link: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/916299811965?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    window.location.href = "tel:+919876543210";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left: Image Gallery */}
        <div>
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Product Details */}
        <div className="space-y-4">
          {/* Brand & Share */}
          <div className="flex items-center justify-between">
            {product.brand && (
              <p className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
                {product.brand}
              </p>
            )}
            <button
              onClick={handleShare}
              className="relative flex items-center gap-1.5 text-gray-600 hover:text-orange-600 transition-colors text-sm font-medium"
            >
              {showCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* SKU */}
          <p className="text-sm text-gray-600">SKU: {product.sku}</p>

          {/* Price Section */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{displayPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{originalPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-orange-500 text-white px-2.5 py-1 rounded-md text-sm font-bold">
                    {discountPercentage}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  ₹{displayPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {isEnterprise && (
              <p className="text-sm text-orange-600 mt-2 font-medium">
                ✓ Enterprise Price Applied
              </p>
            )}
            <p className="text-xs text-gray-600 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Order Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Order on WhatsApp
            </button>
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              Order on Call
            </button>
          </div>

          {/* Product Attributes */}
          <div className="grid grid-cols-2 gap-3 bg-white rounded-lg p-4 border border-gray-200">
            {product.color && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Color</p>
                <p className="font-semibold text-gray-900 text-sm">{product.color}</p>
              </div>
            )}
            {product.size && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Size</p>
                <p className="font-semibold text-gray-900 text-sm">{product.size}</p>
              </div>
            )}
            {product.thickness && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Thickness</p>
                <p className="font-semibold text-gray-900 text-sm">{product.thickness}mm</p>
              </div>
            )}
            {product.stock !== undefined && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Stock</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {product.stock > 0 ? `${product.stock} Available` : "Out of Stock"}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Product Description
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-orange-700 font-medium flex items-center gap-2 text-sm">
                <span className="text-lg">⭐</span>
                Featured Product
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Variants Section */}
      {variants && variants.length > 0 && (
        <div className="mt-8">
          <ProductVariants variants={variants} currentSlug={product.slug} />
        </div>
      )}
    </div>
  );
}