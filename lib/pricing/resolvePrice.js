// lib/pricing/resolvePrice.js  
//
// Pure function — no hooks, no "use client". Moved out of ProductPageClient
// so it can be called from the Server Component (page.js) where userRole
// is already known from request headers, instead of waiting on client-side
// auth to resolve.

export function resolvePrice(product, isEnterprise) {
  const original = isEnterprise ? product.enterprisePrice : product.retailPrice;
  const discounted = isEnterprise ? product.enterpriseDiscountPrice : product.retailDiscountPrice;
  const perSqFt = isEnterprise ? product.perSqFtPriceEnterprise : product.perSqFtPriceRetail;

  const hasDiscount = discounted && discounted < original;
  const sellBy = product.sellBy ?? "unit";

  if (product.showPerSqFtPrice) {
    return {
      primaryPrice: perSqFt,
      primaryLabel: "/ SqFt",
      salePrice: discounted || original,
      salePriceLabel: `/ ${sellBy}`,
      strikePrice: hasDiscount ? original : null,
      discountPct: hasDiscount ? Math.round(((original - discounted) / original) * 100) : 0,
      savingsAmt: hasDiscount ? original - discounted : 0,
    };
  }

  return {
    primaryPrice: discounted || original,
    primaryLabel: `/ ${sellBy}`,
    salePrice: null,
    salePriceLabel: null,
    strikePrice: hasDiscount ? original : null,
    discountPct: hasDiscount ? Math.round(((original - discounted) / original) * 100) : 0,
    savingsAmt: hasDiscount ? original - discounted : 0,
  };
}

export const fmtINR = (n) => Number(n).toLocaleString("en-IN");