// lib/serversideFetchers/applications.js

import DbConnect from "@/lib/Db/DbConnect";
import Application from "@/models/application";

/**
 * Get all applications (SSR-friendly, no API, no dynamic fetch)
 */
export async function getAllApplicationsServer() {
  await DbConnect();

  try {
    const docs = await Application.find().lean();
    return JSON.parse(JSON.stringify(docs));
  } catch (err) {
    console.error("Error fetching applications:", err);
    return [];
  }
}

/**
 * Get single application by ID
 */
export async function getApplicationByIdServer(id) {
  await DbConnect();

  try {
    const doc = await Application.findById(id).lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  } catch (err) {
    console.error("Error fetching application:", err);
    return null;
  }
}
