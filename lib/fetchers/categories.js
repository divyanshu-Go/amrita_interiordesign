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









// const BASE_URL =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:3000" // Local development URL
//     : `https://www.interio97.in/`;


// /**
//  * Get all categories
//  */
// export async function getAllCategories() {
//   try {
//     const res = await fetch(`${BASE_URL}/api/categories`, {
//       cache: "no-store",
//     });

//     const json = await res.json();

//     if (!res.ok || !json.success) {
//       console.error("Fetch categories failed:", json.error || "Unknown error");
//       return [];
//     }

//     return json.data || [];
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return [];
//   }
// }
// 
// /**
//  * Get single category by slug with its products
//  */
// export async function getCategoryBySlug(slug) {
//   try {
//     const res = await fetch(`${BASE_URL}/api/categories/${slug}`, {
//       cache: "no-store",
//     });

//     const json = await res.json();

//     if (!res.ok || !json.success) {
//       console.error("Fetch category failed:", json.error || "Unknown error");
//       return null;
//     }

//     return json.data || null;
//   } catch (error) {
//     console.error("Error fetching category:", error);
//     return null;
//   }
// }