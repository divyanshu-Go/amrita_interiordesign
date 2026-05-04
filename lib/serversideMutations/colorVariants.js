import DbConnect from "@/lib/Db/DbConnect";
import ColorVariant from "@/models/colorVariant";
import Product from "@/models/product";

export async function deleteColorVariantById(id) {
  await DbConnect();

  // Remove reference from products
  await Product.updateMany(
    { colorVariant: id },
    { $set: { colorVariant: null } }
  );

  await ColorVariant.findByIdAndDelete(id);

  return { success: true };
}