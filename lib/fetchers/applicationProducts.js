// lib/fetchers/applications.js
import DbConnect from "@/lib/Db/DbConnect";
import Application from "@/models/application";
import Product from "@/models/product";

export async function getApplicationBySlug(slug) {
  await DbConnect();

  const application = await Application.findOne({ slug }).lean();
  if (!application) return null;

  // Fetch products linked to this application
  const products = await Product.find({
    application: application._id,
  })
    .populate("application", "name slug") // useful for filters
    .lean();

  const result = { application, products };

  return JSON.parse(JSON.stringify(result));
}

export async function getAllApplications() {
  await DbConnect();
  try {
    const apps = await Application.find({}, "slug name").lean();
    return JSON.parse(JSON.stringify(apps));
  } catch {
    return [];
  }
}
