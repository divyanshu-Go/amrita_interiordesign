const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// 🟢 Get all pattern variants
export async function getAllPatternVariants() {
  try {
    const res = await fetch(`${BASE_URL}/api/pattern-variants`, {
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok || !json.success) return [];

    return json.data;
  } catch (error) {
    console.error("Error fetching pattern variants:", error);
    return [];
  }
}

// 🟢 Get one variant by ID
export async function getPatternVariantById(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/pattern-variants/${id}`);
    const json = await res.json();
    if (!json.success) return null;

    return json.data;
  } catch (error) {
    console.error("Error fetching pattern variant:", error);
    return null;
  }
}

// 🟢 Create variant
export async function createPatternVariant(payload) {
  try {
    const res = await fetch(`${BASE_URL}/api/pattern-variants`, {
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
export async function updatePatternVariant(id, payload) {
  try {
    const res = await fetch(`${BASE_URL}/api/pattern-variants/${id}`, {
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
export async function deletePatternVariant(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/pattern-variants/${id}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    return json;
  } catch (error) {
    throw error;
  }
}
