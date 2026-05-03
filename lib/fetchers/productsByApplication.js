// lib/fetchers/productsByApplication.js
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";
import Application from "@/models/application";

export async function getProductsByApplication() {
  await DbConnect();

  // 1. Fetch all applications
  const applications = await Application.find()
    .select("name slug image desc")
    .lean();

  // 2. Fetch all products that have at least one application assigned
  const products = await Product.find({
    application: { $exists: true, $ne: [] }
  })
    .select(
  "name slug images brand retailPrice retailDiscountPrice " +
  "enterprisePrice enterpriseDiscountPrice " +
  "sellBy showPerSqFtPrice perSqFtPriceRetail perSqFtPriceEnterprise " +
  "application"
)
    .lean();

  // 3. Build mapping: { applicationId: [products...] }
  const map = {};

  

  // Initialize empty arrays for all applications
  for (const app of applications) {
    map[app._id.toString()] = [];
  }

  // Assign products into the correct application group(s)
  for (const p of products) {
    if (!p.application) continue;

    p.application.forEach((appId) => {
      const key = appId.toString();
      if (map[key]) {
        map[key].push(p);
      }
    });
  }

  const result = {
    applications,
    map,
  };
  
  // Return the fully serialized and parsed object
  return JSON.parse(JSON.stringify(result));
}
