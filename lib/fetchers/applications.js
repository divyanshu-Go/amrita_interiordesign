// /lib/fetchers/applications.js


// 🟢 Create application
export async function createApplication(payload) {
  try {
    const res = await fetch(`/api/applications`, {
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
    const res = await fetch(`/api/applications/${id}`, {
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

