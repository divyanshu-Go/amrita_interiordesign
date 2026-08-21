// lib/auth/getCurrentUser.js

import { headers } from "next/headers";

/**
 * Server-side helper to read and decode the structured user payload
 * injected by middleware into the x-user request header.
 *
 * @returns {Promise<{ id: string, name: string, email: string, role: string, enterpriseStatus: string } | null>}
 */
export async function getCurrentUser() {
  const headersList = await headers();
  const rawUser = headersList.get("x-user");

  if (!rawUser) return null;

  try {
    return JSON.parse(decodeURIComponent(rawUser));
  } catch (error) {
    console.error("Failed to parse x-user header:", error);
    return null;
  }
}