// components/customer/ProductPageClient.jsx
"use client";

import { useState } from "react";
import { Share2, Phone, MessageCircle, Check, Copy } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import ProductImageGallery from "./ProductImageGallery";
import ProductDetails      from "./ProductDetails";
import TrustBadges         from "./TrustBadges";
import CartButton          from "./CartButton";
import { useAuth }         from "@/app/providers/AuthProvider";

// ── Price resolution ──────────────────────────────────────────────────────
function resolvePrice(product, isEnterprise) {
  const original   = isEnterprise ? product.enterprisePrice         : product.retailPrice;
  const discounted = isEnterprise ? product.enterpriseDiscountPrice  : product.retailDiscountPrice;
  const perSqFt    = isEnterprise ? product.perSqFtPriceEnterprise   : product.perSqFtPriceRetail;

  const hasDiscount = discounted && discounted < original;
  const sellBy      = product.sellBy ?? "unit";

  if (product.showPerSqFtPrice) {
    return {
      primaryPrice:    perSqFt,
      primaryLabel:    "/ SqFt",
      salePrice:       discounted || original,
      salePriceLabel:  `/ ${sellBy}`,
      strikePrice:     hasDiscount ? original : null,
      discountPct:     hasDiscount ? Math.round(((original - discounted) / original) * 100) : 0,
      savingsAmt:      hasDiscount ? original - discounted : 0,
    };
  }

  return {
    primaryPrice:   discounted || original,
    primaryLabel:   `/ ${sellBy}`,
    salePrice:      null,
    salePriceLabel: null,
    strikePrice:    hasDiscount ? original : null,
    discountPct:    hasDiscount ? Math.round(((original - discounted) / original) * 100) : 0,
    savingsAmt:     hasDiscount ? original - discounted : 0,
  };
}

const fmt = (n) => Number(n).toLocaleString("en-IN");

// ─────────────────────────────────────────────────────────────────────────

export default function ProductPageClient({
  product,
  variants,
  colorVariants,
  patternVariants,
  // phone and whatsapp come from the parent server component (fetched via ISR)
  // Fallback to empty string so the buttons are simply hidden if not configured
  phone    = "",
  whatsapp = "",
}) {
  const { userRole } = useAuth();
  const isEnterprise = userRole === "enterprise";
  const price        = resolvePrice(product, isEnterprise);

  const [shareState, setShareState] = useState("idle");
  const [copyState,  setCopyState]  = useState("idle");

  // ── Handlers ─────────────────────────────────────────────────────────
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareState("copied");
      toast.success("Link copied to clipboard!");
      setTimeout(() => setShareState("idle"), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  async function handleCopyNumber() {
    if (!phone) return;
    try {
      await navigator.clipboard.writeText(phone);
      setCopyState("copied");
      toast.success("Phone number copied!");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      toast.error("Could not copy number");
    }
  }

  const handleWhatsApp = () => {
    if (!whatsapp) return;
    const msg = `Hi, I'm interested in ${product.name}. Link: ${window.location.href}`;
    window.open(
      `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const handleCall = () => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* ── Product section: image + info ── */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 sm:gap-8 mb-6">

        {/* LEFT — image gallery */}
        <div className="max-w-md w-full mx-auto sm:mx-0">
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* RIGHT — product info */}
        <div className="flex flex-col gap-3.5">

          {/* Brand + share */}
          <div className="flex items-center justify-between gap-2">
            {product.brand && (
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
                {product.brand}
              </p>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors text-[11px] font-medium ml-auto"
            >
              {shareState === "copied"
                ? <><Check className="w-3 h-3" /><span>Copied!</span></>
                : <><Share2 className="w-3 h-3" /><span>Share</span></>
              }
            </button>
          </div>

          {/* Name */}
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
            {product.name}
          </h1>

          {/* ── Price box ── */}
          <div className="bg-orange-50 rounded-xl p-3.5 border border-orange-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xl font-bold text-gray-900">
                  ₹{fmt(price.primaryPrice)}
                  <span className="text-sm font-medium text-gray-500 ml-1">{price.primaryLabel}</span>
                </span>
                {price.savingsAmt > 0 && (
                  <p className="text-[11px] text-green-600 font-semibold mt-0.5">
                    Save ₹{fmt(price.savingsAmt)}
                  </p>
                )}
              </div>

              {price.salePrice && (
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-700 block">
                    ₹{fmt(price.salePrice)} {price.salePriceLabel}
                  </span>
                  {price.strikePrice && (
                    <span className="text-xs text-gray-400 line-through block">
                      ₹{fmt(price.strikePrice)} {price.salePriceLabel}
                    </span>
                  )}
                </div>
              )}

              {!price.salePrice && price.strikePrice && (
                <span className="text-xs text-gray-400 line-through self-start">
                  ₹{fmt(price.strikePrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {price.discountPct > 0 && (
                <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  {price.discountPct}% OFF
                </span>
              )}
              {isEnterprise && (
                <span className="bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                  Enterprise
                </span>
              )}
              <span className="text-[10px] text-gray-400">Incl. all taxes</span>
            </div>
          </div>

          {/* ── Color variants ── */}
          {colorVariants?.length > 0 && (
            <VariantRow label="Color" variants={colorVariants} nameKey="color" currentSlug={product.slug} />
          )}

          {/* ── Pattern variants ── */}
          {patternVariants?.length > 0 && (
            <VariantRow label="Pattern" variants={patternVariants} nameKey="pattern" currentSlug={product.slug} />
          )}

          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-semibold px-2 py-1 rounded-lg w-fit">
              ⭐ Featured
            </span>
          )}

          <CartButton productId={product._id.toString()} stock={product.stock} userRole={userRole} />

          {/* Contact buttons — only rendered if numbers are configured */}
          {(whatsapp || phone) && (
            <div className="grid grid-cols-12 gap-1.5">
              {whatsapp && (
                <button
                  onClick={handleWhatsApp}
                  className="col-span-5 flex items-center justify-center gap-1.5
                             bg-green-600 hover:bg-green-700 text-white
                             px-2 py-2.5 rounded-lg font-semibold transition-colors text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
              )}

              {phone && (
                <button
                  onClick={handleCall}
                  className={`${whatsapp ? "col-span-5" : "col-span-10"} flex items-center justify-center gap-1.5
                             bg-blue-600 hover:bg-blue-700 text-white
                             px-2 py-2.5 rounded-lg font-semibold transition-colors text-xs`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </button>
              )}

              {phone && (
                <button
                  onClick={handleCopyNumber}
                  title="Copy phone number"
                  className="col-span-2 flex items-center justify-center
                             bg-gray-600 hover:bg-gray-700 text-white
                             py-2.5 rounded-lg transition-colors"
                >
                  {copyState === "copied"
                    ? <Check className="w-3.5 h-3.5" />
                    : <Copy  className="w-3.5 h-3.5" />
                  }
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Details + trust ── */}
      <ProductDetails product={product} />
      <TrustBadges />
    </div>
  );
}

// ── Variant row (colour / pattern thumbnails) ─────────────────────────────
function VariantRow({ label, variants, nameKey, currentSlug }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <div className="flex gap-2 flex-wrap">
        {variants.map((v) => {
          const isActive = v.slug === currentSlug;
          return (
            <a key={v._id} href={`/product/${v.slug}`} className="flex flex-col items-center gap-1 group">
              <div className={`w-10 h-10 rounded-lg overflow-hidden border transition-colors ${
                isActive
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-gray-200 group-hover:border-orange-400"
              }`}>
                {v.images?.[0] ? (
                  <Image src={v.images[0]} alt={v.name} width={40} height={40} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px]">?</div>
                )}
              </div>
              <p className="text-[9px] text-center text-gray-500 max-w-[40px] line-clamp-1">
                {(nameKey === "pattern" ? v.pattern?.[0] : v.color) || v.name}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}