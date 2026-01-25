// components/customer/ProductPageClient.js
"use client";

import { useState } from "react";
import {
  Share2,
  Phone,
  MessageCircle,
  Check,
  Copy,
  ShoppingCart,
} from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetails from "./ProductDetails";
import ApplicationsGallery from "./ApplicationsGallery";
import TrustBadges from "./TrustBadges";
import { useAuth } from "@/app/providers/AuthProvider";
import { addToCart } from "@/lib/actions/cart";



export default function ProductPageClient({
  product,
  variants,
  colorVariants,
  patternVariants,
}) {
  const [showCopied, setShowCopied] = useState(false);
  const [showNumberCopied, setShowNumberCopied] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);


  const handleAddToCart = async () => {
  try {
    setAdding(true);
    await addToCart(product._id, 1);
    setAdded(true);

    // reset success state after a moment
    setTimeout(() => setAdded(false), 2000);
  } catch (err) {
    alert(err.message || "Failed to add to cart");
  } finally {
    setAdding(false);
  }
};



   const { userRole, loading } = useAuth();

  const phoneNumber = "+916299811965";
  const isEnterprise = userRole === "enterprise";

  // ✅ CLEAN PRICE LOGIC
  const discounted = isEnterprise
    ? product.enterpriseDiscountPrice
    : product.retailDiscountPrice;

  const original = isEnterprise ? product.enterprisePrice : product.retailPrice;

  const perSqFt = isEnterprise
    ? product.perSqFtPriceEnterprise
    : product.perSqFtPriceRetail;

  const hasDiscount = discounted && discounted < original;

  let primaryPrice;
  let secondaryPrice = null;

  if (product.showPerSqFtPrice) {
    primaryPrice = perSqFt;
    secondaryPrice = {
      discounted: discounted || original,
      original: hasDiscount ? original : null,
      discountPercent: hasDiscount
        ? Math.round(((original - discounted) / original) * 100)
        : 0,
      savings: hasDiscount ? original - discounted : 0,
    };
  } else {
    primaryPrice = discounted || original;
    secondaryPrice = hasDiscount
      ? {
          original,
          discountPercent: Math.round(
            ((original - discounted) / original) * 100
          ),
          savings: original - discounted,
        }
      : null;
  }

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
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
      {/* ===== PRODUCT SECTION ===== */}
      <div
        className="
    grid grid-cols-1 
    sm:grid-cols-[auto_1fr] 
    gap-4 sm:gap-6 mb-4 
  "
      >
        {/* LEFT: Image Gallery */}
        <div
          className="max-w-md w-full mx-auto md:mx-0"
        >
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* RIGHT: Product Info */}
        <div className="space-y-2.5 w-full">
          {/* Brand & Share */}
          <div className="flex items-center justify-between">
            {product.brand && (
              <p className="text-neutral-500 font-semibold text-[10px] uppercase tracking-wide">
                {product.brand}
              </p>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors text-[10px] font-medium"
            >
              {showCopied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Product Name */}
          <h1 className="text-md sm:text-lg font-medium text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* PRICE BOX - Enhanced */}
          <div className="bg-orange-50 rounded-md p-2.5 border border-orange-200">
            <div className="flex items-center justify-between gap-3">
              {/* LEFT: Primary Price */}
              <div>
                {product.showPerSqFtPrice ? (
                  <span className="text-[1.2rem] font-bold text-gray-900">
                    ₹{primaryPrice} / SqFt
                  </span>
                ) : (
                  <span className="text-[1.2rem] font-bold text-gray-900">
                    ₹{primaryPrice}
                  </span>
                )}

                {secondaryPrice?.savings > 0 && (
                  <p className="text-[10px] text-green-600 font-semibold mt-0.5">
                    Save ₹{secondaryPrice.savings}
                  </p>
                )}
              </div>

              {/* RIGHT: Original/Discount */}
              {secondaryPrice && (
                <div className="text-right">
                  {product.showPerSqFtPrice && (
                    <>
                      <span className="text-[15px] font-medium text-gray-700 block">
                        ₹{secondaryPrice.discounted} / {product.sellBy}
                      </span>
                      {secondaryPrice.original && (
                        <span className="text-[12px] text-gray-400 line-through block">
                          ₹{secondaryPrice.original} / {product.sellBy}
                        </span>
                      )}
                    </>
                  )}

                  {!product.showPerSqFtPrice && secondaryPrice.original && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{secondaryPrice.original}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Discount % & Tags */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {secondaryPrice?.discountPercent > 0 && (
                <span className="inline-block bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {secondaryPrice.discountPercent}% OFF
                </span>
              )}
              {isEnterprise && (
                <span className="inline-block bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  Enterprise
                </span>
              )}
              <p className="text-[9px] text-gray-600">Incl. all taxes</p>
            </div>
          </div>

          {/* Color Variants */}
          {colorVariants?.length > 0 && (
            <div>
              <p className="text-[9px] font-semibold text-gray-700 mb-1.5">
                COLOR
              </p>
              <div className="flex gap-2 flex-wrap">
                {colorVariants.map((c) => (
                  <a
                    key={c._id}
                    href={`/product/${c.slug}`}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-10 h-10 border border-gray-300 rounded overflow-hidden">
                      <img
                        src={c.images?.[0]}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[8px] text-center text-gray-600 max-w-[40px] line-clamp-1">
                      {c.color || c.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Pattern Variants */}
          {patternVariants?.length > 0 && (
            <div>
              <p className="text-[9px] font-semibold text-gray-700 mb-1.5">
                PATTERN
              </p>
              <div className="flex gap-2 flex-wrap">
                {patternVariants.map((p) => (
                  <a
                    key={p._id}
                    href={`/product/${p.slug}`}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-10 h-10 border border-gray-300 rounded overflow-hidden">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[8px] text-center text-gray-600 max-w-[40px] line-clamp-1">
                      {p.pattern?.[0] || p.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-2 inline-block">
              <p className="text-orange-700 font-semibold flex items-center gap-1 text-[9px]">
                <span>⭐</span>
                Featured
              </p>
            </div>
          )}




          {/* Add to Cart Button */}
          <button
  onClick={handleAddToCart}
  disabled={adding}
  className={`
    w-full flex items-center justify-center gap-2
    px-3 py-2.5 rounded-sm font-semibold text-sm
    transition-colors
    ${
      added
        ? "bg-green-600 text-white"
        : "bg-orange-500 hover:bg-orange-600 text-white"
    }
    ${adding ? "opacity-70 cursor-not-allowed" : ""}
  `}
>
  {added ? (
    <>
      <Check className="w-4 h-4" />
      <span>Added to Cart</span>
    </>
  ) : (
    <>
      <ShoppingCart className="w-4 h-4" />
      <span>{adding ? "Adding…" : "Add to Cart"}</span>
    </>
  )}
</button>





          {/* Contact Buttons */}
          <div className="grid grid-cols-12 gap-1.5">
            <button
              onClick={handleWhatsApp}
              className="col-span-5 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-2.5 rounded-sm font-semibold transition-colors text-[12px]"
            >
              <MessageCircle className="w-3 h-3" />
              WhatsApp
            </button>
            <button
              onClick={handleCall}
              className="col-span-5 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-2.5 rounded-sm font-semibold transition-colors text-[12px]"
            >
              <Phone className="w-3 h-3" />
              Call
            </button>
            <button
              onClick={handleCopyNumber}
              className="col-span-2 flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white py-2.5 rounded-sm transition-colors"
              title="Copy Phone Number"
            >
              {showNumberCopied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===== DETAILS SECTION ===== */}
      <ProductDetails product={product} />

      <TrustBadges />
    </div>
  );
}
