// lib/serversideFetchers/colorVariants.js
import DbConnect from "@/lib/Db/DbConnect";
import ColorVariant from "@/models/colorVariant";

/**
 * Get all color variants
 */
export async function getAllColorVariantsServer() {
  await DbConnect();

  try {
    const docs = await ColorVariant.find().lean();
    return JSON.parse(JSON.stringify(docs));
  } catch (err) {
    console.error("Error fetching color variants:", err);
    return [];
  }
}

/**
 * Get one color variant by ID
 */
export async function getColorVariantByIdServer(id) {
  await DbConnect();

  try {
    const doc = await ColorVariant.findById(id).lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  } catch (err) {
    console.error("Error fetching color variant:", err);
    return null;
  }
}
