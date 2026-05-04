import DbConnect from "@/lib/Db/DbConnect";
import PatternVariant from "@/models/patternVariant";
import Product from "@/models/product";

export async function deletePatternVariantById(id) {
  await DbConnect();

  // Remove reference from products
  await Product.updateMany(
    { patternVariant: id },
    { $set: { patternVariant: null } }
  );

  await PatternVariant.findByIdAndDelete(id);

  return { success: true };
}