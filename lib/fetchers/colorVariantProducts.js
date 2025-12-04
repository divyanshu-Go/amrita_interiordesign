// lib/fetchers/colorVariantProducts.js
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";
import ColorVariant from "@/models/colorVariant";

export async function getAllColorVariantProducts() {
  await DbConnect();

  // 1. Fetch all color variants
  const variants = await ColorVariant.find().lean();

  // 2. Fetch all products that have a colorVariant assigned
  const products = await Product.find({
    colorVariant: { $ne: null }
  })
    .select("name slug images colorVariant")
    .lean();

  // 3. Build a map: { variantId: [products...] }
  const map = {};

  for (const v of variants) {
    map[v._id.toString()] = [];
  }

  for (const p of products) {
    const vid = p.colorVariant?.toString();
    if (vid && map[vid]) {
      map[vid].push(p);
    }
  }

  return {
    variants,
    map, // key = colorVariantId, value = array of products
  };
}


