import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";
import PatternVariant from "@/models/patternVariant";

export async function getAllPatternVariantProducts() {
  await DbConnect();

  const variants = await PatternVariant.find().lean();

  const products = await Product.find({
    patternVariant: { $ne: null }
  })
    .select("name slug images patternVariant")
    .lean();

  const map = {};

  for (const v of variants) {
    map[v._id.toString()] = [];
  }

  for (const p of products) {
    const vid = p.patternVariant?.toString();
    if (vid && map[vid]) {
      map[vid].push(p);
    }
  }

  return {
    variants,
    map,
  };
}
