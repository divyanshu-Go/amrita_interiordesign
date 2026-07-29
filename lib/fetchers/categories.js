// lib/fetchers/categories.js


/**
 * Create a new category (client-side)
 */
export async function createCategory(categoryData) {
  const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to create category");
    }

    return json.data;
}

/**
 * Update category (client-side)
 */
export async function updateCategory(slug, updates) {
    const res = await fetch(`/api/categories/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to update category");
    }

    return json.data;
}

/**
 * Delete category (client-side)
 */
export async function deleteCategory(slug) {
    const res = await fetch(`/api/categories/${slug}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to delete category");
    }

    return json;
}



