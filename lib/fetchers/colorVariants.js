const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// 🟢 Get all color variants
export async function getAllColorVariants() {
  try {
    const res = await fetch(`${BASE_URL}/api/color-variants`, {
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok || !json.success) return [];

    return json.data;
  } catch (error) {
    console.error("Error fetching color variants:", error);
    return [];
  }
}

// 🟢 Get a single variant by ID
export async function getColorVariantById(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/color-variants/${id}`);
    const json = await res.json();
    if (!json.success) return null;

    return json.data;
  } catch (error) {
    console.error("Error fetching color variant:", error);
    return null;
  }
}

// 🟢 Create variant
export async function createColorVariant(payload) {
  try {
    const res = await fetch(`${BASE_URL}/api/color-variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    return json.data;
  } catch (error) {
    throw error;
  }
}

// 🟢 Update variant
export async function updateColorVariant(id, payload) {
  try {
    const res = await fetch(`${BASE_URL}/api/color-variants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    return json.data;
  } catch (error) {
    throw error;
  }
}

// 🟢 Delete variant
export async function deleteColorVariant(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/color-variants/${id}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    return json;
  } catch (error) {
    throw error;
  }
}
