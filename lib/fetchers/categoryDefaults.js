// lib/fetchers/categoryDefaults.js

export async function getCategoryDefaults(categoryId) {
  const res = await fetch(`/api/category-defaults/${categoryId}`);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to fetch category defaults");
  }

  return json.data; // null if none saved yet — caller must handle fallback
}