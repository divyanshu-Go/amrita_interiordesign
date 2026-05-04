// lib/fetchers/patternVariants.js

// 🟢 Create variant
export async function createPatternVariant(payload) {
    const res = await fetch("/api/pattern-variants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    return json.data;
}

// 🟢 Update variant
export async function updatePatternVariant(id, payload) {
    const res = await fetch(`/api/pattern-variants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    return json.data;
}










// // 🟢 Delete variant
// export async function deletePatternVariant(id) {
//     const res = await fetch(`/api/pattern-variants/${id}`, {
//       method: "DELETE",
//     });

//     const json = await res.json();
//     if (!json.success) throw new Error(json.error);

//     return json;
// }









// const BASE_URL =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:3000" // Local development URL
//     : `https://www.interio97.in/`;


// // 🟢 Get all pattern variants
// export async function getAllPatternVariants() {
//   try {
//     const res = await fetch(`${BASE_URL}/api/pattern-variants`, {
//       cache: "no-store",
//     });

//     const json = await res.json();
//     if (!res.ok || !json.success) return [];

//     return json.data;
//   } catch (error) {
//     console.error("Error fetching pattern variants:", error);
//     return [];
//   }
// }

// // 🟢 Get one variant by ID
// export async function getPatternVariantById(id) {
//   try {
//     const res = await fetch(`${BASE_URL}/api/pattern-variants/${id}`);
//     const json = await res.json();
//     if (!json.success) return null;

//     return json.data;
//   } catch (error) {
//     console.error("Error fetching pattern variant:", error);
//     return null;
//   }
// }