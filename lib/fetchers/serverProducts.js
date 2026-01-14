// lib/fetchers/serverProducts.js
"use server";

import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";

/**
 * Pure server-side: Get all products with filters
 */
export async function getAllProducts(filters = {}) {
  await DbConnect();

  const query = {};

  if (filters.category) query.category = filters.category;
  if (filters.color) query.color = filters.color;
  if (filters.size) query.size = filters.size;
  if (filters.thickness) query.thickness = filters.thickness;

  if (filters.minPrice || filters.maxPrice) {
    query.retailPrice = {};
    if (filters.minPrice) query.retailPrice.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.retailPrice.$lte = Number(filters.maxPrice);
  }

  if (filters.material) query.material = filters.material;
  if (filters.pattern) query.pattern = filters.pattern;
  if (filters.finish) query.finish = filters.finish;
  if (filters.application) query.application = filters.application;

  try {
    const products = await Product.find(query).lean().populate("category").populate("application");
    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error("Error (server getAllProducts):", err);
    return [];
  }
}

/**
 * Pure server-side: Get product by slug
 */
export async function getProductBySlug(slug) {
  await DbConnect();

  try {
    // 1. Find the product
    const product = await Product.findOne({ slug })
      .populate("category")
      .populate("application")
      .lean();

    if (!product) return null;

    const productId = product._id;

    // 2. Variants with same variantGroupId
    let variants = [];
    if (product.variantGroupId) {
      variants = await Product.find({
        variantGroupId: product.variantGroupId,
        _id: { $ne: productId },
      }).lean();
    }

    // 3. Color variants - same colorVariant ID
    let colorVariants = [];
    if (product.colorVariant) {
      colorVariants = await Product.find({
        colorVariant: product.colorVariant,
        _id: { $ne: productId },
      }).lean();
    }

    // 4. Pattern variants - same patternVariant ID
    let patternVariants = [];
    if (product.patternVariant) {
      patternVariants = await Product.find({
        patternVariant: product.patternVariant,
        _id: { $ne: productId },
      }).lean();
    }

    return {
      product: JSON.parse(JSON.stringify(product)),
      variants: JSON.parse(JSON.stringify(variants)),
      colorVariants: JSON.parse(JSON.stringify(colorVariants)),
      patternVariants: JSON.parse(JSON.stringify(patternVariants)),
    };
  } catch (err) {
    console.error("Error in getProductBySlugServer:", err);
    return null;
  }
}

/**
 * PURE SERVER-SIDE FETCHER
 * Get popular products
 */
export async function getPopularProducts(limit = 8) {
  await DbConnect();

  try {
    const popularProducts = await Product.find({ isPopular: true })
      .select(
        "name slug images retailPrice retailDiscountPrice enterprisePrice enterpriseDiscountPrice"
      )
      .limit(limit)
      .lean();

    const parsedPopularProducts = JSON.parse(JSON.stringify(popularProducts));
    return parsedPopularProducts;
  } catch (err) {
    console.error("Error fetching popular products:", err);
    return [];
  }
}
