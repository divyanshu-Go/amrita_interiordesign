// lib/fetchers/products.js

/**
 * Create a new product (client-side)
 */
export async function createProduct(productData) {
    const res = await fetch("/api/products", {
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
}

/**
 * Update product (client-side)
 */
export async function updateProduct(slug, updates) {
    const res = await fetch(`/api/products/${slug}`, {
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
}

/**
 * Delete product (client-side)
 */
export async function deleteProduct(slug) {
    const res = await fetch(`/api/products/${slug}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to delete product");
    }

    return json;
}














