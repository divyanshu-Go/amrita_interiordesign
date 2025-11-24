const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";



    
/**
 * Get all products with optional filters
 */
export async function getAllProducts(filters = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.category) params.append("category", filters.category);
    if (filters.color) params.append("color", filters.color);
    if (filters.size) params.append("size", filters.size);
    if (filters.thickness) params.append("thickness", filters.thickness);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    // 🔥 NEW FILTERS (arrays allowed)
if (filters.material) params.append("material", filters.material);
if (filters.pattern) params.append("pattern", filters.pattern);
if (filters.finish) params.append("finish", filters.finish);
if (filters.application) params.append("application", filters.application);


    const queryString = params.toString();
    const url = `${BASE_URL}/api/products${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      console.error("Fetch products failed:", json.error || "Unknown error");
      return [];
    }

    return json.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Get single product by slug with variants
 */
export async function getProductBySlug(slug) {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${slug}`, {
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      console.error("Fetch product failed:", json.error || "Unknown error");
      return null;
    }

    return json.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * Create a new product (client-side)
 */
export async function createProduct(productData) {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to create product");
    } 

    return json.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Update product (client-side)
 */
export async function updateProduct(slug, updates) {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to update product");
    }

    return json.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete product (client-side)
 */
export async function deleteProduct(slug) {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${slug}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to delete product");
    }

    return json;
  } catch (error) {
    throw error;
  }
}