// /lib/fetchers/applications.js

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000" // Local development URL
    : `https://amrita-interiordesign.vercel.app`; // Vercel's absolute URL in production


// 🟢 Get all applications
export async function getAllApplications() {
  
  try {
    const res = await fetch(`${BASE_URL}/api/applications`, {
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok || !json.success) return [];

    if (process.env.NODE_ENV === "production") {
  console.log("[DEBUG] Response status:", res.status);
}

    return json.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

// 🟢 Get single application by ID
export async function getApplicationById(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/applications/${id}`, {
      cache: "no-store",
    });

    const json = await res.json();
    if (!json.success) return null;

    return json.data;
  } catch (error) {
    console.error("Error fetching application:", error);
    return null;
  }
}

// 🟢 Create application
export async function createApplication(payload) {
  try {
    const res = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Create failed");

    return json.data;
  } catch (error) {
    throw error;
  }
}

// 🟢 Update application
export async function updateApplication(id, payload) {
  try {
    const res = await fetch(`${BASE_URL}/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Update failed");

    return json.data;
  } catch (error) {
    throw error;
  }
}

// 🟢 Delete application
export async function deleteApplication(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/applications/${id}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Delete failed");

    return json;
  } catch (error) {
    throw error;
  }
}
