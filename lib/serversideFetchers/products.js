// lib/fetchers/serverProducts.js


import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";
import Category from '@/models/category';
import Application from '@/models/application';


export async function getAllProducts(filters = {}) {
  await DbConnect();

  const query = {};

  if (filters.category)  query.category  = filters.category;
  if (filters.color)     query.color      = filters.color;
  if (filters.size)      query.size       = filters.size;
  if (filters.thickness) query.thickness  = filters.thickness;

  if (filters.minPrice || filters.maxPrice) {
    query.retailPrice = {};
    if (filters.minPrice) query.retailPrice.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.retailPrice.$lte = Number(filters.maxPrice);
  }

  if (filters.material)    query.material    = filters.material;
  if (filters.pattern)     query.pattern     = filters.pattern;
  if (filters.finish)      query.finish      = filters.finish;
  if (filters.application) query.application = filters.application;

  try {
    const products = await Product.find(query)
      .lean()
      .populate("category")
      .populate("application");
    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error("Error (getAllProducts):", err);
    return [];
  }
}

export async function getProductBySlug(slug) {
  await DbConnect();

  try {
    const product = await Product.findOne({ slug })
      .populate("category")
      .populate("application")
      .lean();

    if (!product) return null;

    const productId = product._id;

    let colorVariants = [];
    if (product.colorVariant) {
      colorVariants = await Product.find({
        colorVariant: product.colorVariant,
        _id: { $ne: productId },
      }).lean();
    }

    let patternVariants = [];
    if (product.patternVariant) {
      patternVariants = await Product.find({
        patternVariant: product.patternVariant,
        _id: { $ne: productId },
      }).lean();
    }

    return {
      product:         JSON.parse(JSON.stringify(product)),
      colorVariants:   JSON.parse(JSON.stringify(colorVariants)),
      patternVariants: JSON.parse(JSON.stringify(patternVariants)),
    };
  } catch (err) {
    console.error("Error in getProductBySlug:", err);
    return null;
  }
}

export async function getPopularProducts(limit = 8) {
  await DbConnect();

  try {
    const products = await Product.find({ isPopular: true })
      .select(
        "name slug images brand " +
        "retailPrice retailDiscountPrice " +
        "enterprisePrice enterpriseDiscountPrice " +
        "sellBy showPerSqFtPrice perSqFtPriceRetail perSqFtPriceEnterprise"
      )
      .limit(limit)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error("Error fetching popular products:", err);
    return [];
  }
}