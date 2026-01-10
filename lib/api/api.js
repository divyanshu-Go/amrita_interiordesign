//  lib/api/api.js
import { cookies } from "next/headers";
import { verifyToken } from "../auth/token";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://pan-tasks.vercel.app";
    

export async function getUserProfile() {
  const cookieStore = await cookies(); // 🟢 This reads cookies on the server
  const token = cookieStore.get("auth_token")?.value ;

  if (!token) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/api/user/profile`, {
    method: "GET",
    headers: {
      Cookie: `auth_token=${token}`, // 🟢 Pass the cookie to the backend API
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.user) {
    console.error("User fetch failed. API responded with: " + (json.message || "Unknown error"));
  }

  return json.user;
}





/**
 * Get all users (Admin only)
 */
export async function getAllUsers() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || '';

  // if (!token) {
  //   return null;
  // }

  const res = await fetch(`${BASE_URL}/api/user`, {
    method: "GET",
    headers: {
      Cookie: `auth_token=${token}`,
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok || !json.users) {
    console.error(
      "Fetch all users failed. API responded with: " +
        (json.error || json.message || "Unknown error")
    );
    return null;
  }

  return json.users;
}

/**
 * Get a specific user by ID (Admin only)
 */
export async function getUserById(id) {
  if (!id) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/api/user/${id}`, {
    method: "GET",
    headers: {
      Cookie: `auth_token=${token}`,
    },
    cache: "no-store",
  });

  const json = await res.json();
  console.log(json);

  if (!res.ok || !json.user) {
    console.error(
      `Fetch user ${id} failed. API responded with: ` +
        (json.error || json.message || "Unknown error")
    );
    return null;
  }

  return json.user;
}




