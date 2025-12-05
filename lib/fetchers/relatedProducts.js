// lib/fetchers/relatedProducts.js
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";
import mongoose from "mongoose";

/* -----------------------------------------------------------
   Helper: Convert any id (ObjectId or string) → string safely
----------------------------------------------------------- */
function idToString(id) {
  if (!id) return null;
  return typeof id === "string" ? id : id.toString();
}

/* -----------------------------------------------------------
   1️⃣ Related by Collection (colorVariant + patternVariant)
----------------------------------------------------------- */
export async function getRelatedByCollection({
  productId,
  colorVariantIds = [],
  patternVariantIds = [],
  limit = 8,
}) {
  if (!productId) return [];

  await DbConnect();

  const pid = idToString(productId);

  const colorIds = colorVariantIds.map(idToString).filter(Boolean);
  const patternIds = patternVariantIds.map(idToString).filter(Boolean);

  // If nothing to compare, skip
  if (colorIds.length === 0 && patternIds.length === 0) return [];

  const queryOr = [];
  if (colorIds.length) queryOr.push({ colorVariant: { $in: colorIds } });
  if (patternIds.length) queryOr.push({ patternVariant: { $in: patternIds } });

  const products = await Product.find({
    _id: { $ne: pid },
    $or: queryOr,
  })
    .limit(limit)
    .select(
      "_id name slug images retailPrice retailDiscountPrice enterprisePrice enterpriseDiscountPrice isFeatured"
    )
    .lean();

  return products || [];
}

/* -----------------------------------------------------------
   2️⃣ Related by Category
----------------------------------------------------------- */
export async function getRelatedByCategory({
  categoryId,
  productId,
  limit = 12,
}) {
  if (!categoryId) return [];

  await DbConnect();

  const cid = idToString(categoryId);
  const pid = idToString(productId);

  const query = { category: cid };
  if (pid) query._id = { $ne: pid };

  const products = await Product.find(query)
    .limit(limit)
    .select(
      "_id name slug images retailPrice retailDiscountPrice enterprisePrice enterpriseDiscountPrice isFeatured"
    )
    .lean();

  return products || [];
}
