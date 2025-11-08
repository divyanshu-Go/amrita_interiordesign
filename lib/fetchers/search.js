const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Search products by query
 * Searches in: name, description, brand, sku, tags
 */
export async function searchProducts(query) {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const res = await fetch(`${BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      console.error("Search failed:", json.error || "Unknown error");
      return [];
    }

    return json.data || [];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}