// lib/serversideFetchers/search.js

import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";
import Category from "@/models/category";
import Application from "@/models/application";

export async function searchProducts(query) {
  await DbConnect();

  if (!query || query.trim().length < 2) {
    return [];
  }

  const pattern = new RegExp(query.trim(), "i");

  // 1. Match Categories
  const categories = await Category.find({ name: pattern }, { _id: 1 });
  const categoryIds = categories.map((c) => c._id);

  // 2. Match Applications
  const applications = await Application.find({ name: pattern }, { _id: 1 });
  const applicationIds = applications.map((a) => a._id);

  // 3. Product search
  const products = await Product.find({
    $or: [
      { name: pattern },
      { description: pattern },
      { brand: pattern },
      { sku: pattern },
      { tags: pattern },

      { material: pattern },
      { pattern: pattern },
      { finish: pattern },
      { coverageArea: pattern },

      ...(categoryIds.length > 0
        ? [{ category: { $in: categoryIds } }]
        : []),

      ...(applicationIds.length > 0
        ? [{ application: { $in: applicationIds } }]
        : []),
    ],
  })
    .populate("category")
    .populate("application")
    .lean();

  return JSON.parse(JSON.stringify(products));
}