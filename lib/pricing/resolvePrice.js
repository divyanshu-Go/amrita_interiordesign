/**
 * Central pricing resolver
 * This is the ONLY place price logic should exist
 */
// lib/pricing/resolvePrice.js
export function resolvePrice({
  product,
  role,
  quantity,
}) {
  if (!product) {
    throw new Error("Product is required for pricing");
  }

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  let basePrice;
  let discountApplied = 0;

  if (role === "enterprise") {
    if (
      product.enterpriseDiscountPrice != null &&
      product.enterpriseDiscountPrice < product.enterprisePrice
    ) {
      basePrice = product.enterpriseDiscountPrice;
      discountApplied =
        product.enterprisePrice - product.enterpriseDiscountPrice;
    } else {
      basePrice = product.enterprisePrice;
    }
  } else {
    if (
      product.retailDiscountPrice != null &&
      product.retailDiscountPrice < product.retailPrice
    ) {
      basePrice = product.retailDiscountPrice;
      discountApplied =
        product.retailPrice - product.retailDiscountPrice;
    } else {
      basePrice = product.retailPrice;
    }
  }

  const lineTotal = basePrice * quantity;

  return {
    unitPrice: basePrice,
    discountApplied,        // per-unit discount
    finalUnitPrice: basePrice,
    quantity,
    lineTotal,
  };
}
