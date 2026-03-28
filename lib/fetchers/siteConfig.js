// lib/fetchers/siteConfig.js
//
// Two fetch strategies:
//
// 1. getSiteConfig()       — used by Footer, ProductPage (server components).
//    Goes through the API route so Next.js can cache + revalidate it (ISR).
//    revalidate: 3600 = cached for 1 hour, rebuilt in background on next request after.
//
// 2. getSiteConfigDirect() — used by the admin page only.
//    Hits MongoDB directly, bypasses cache, always returns the latest saved value.
//    Mirrors the pattern of your getInspiredCarousel() fetcher.

import DbConnect    from "@/lib/Db/DbConnect";
import SiteConfig   from "@/models/siteConfig";
import { getBaseUrl } from "../utils/getBaseUrl";

// ── Default shape — returned when no document exists yet ──────────────────
export const DEFAULT_SITE_CONFIG = {
  companyName: "Amrita",
  tagline:     "Interior & Design",
  logoUrl:     "",
  email:       "",
  phone:       "",
  whatsapp:    "",
  address:     "",
  instagram:   "",
  linkedin:    "",
  twitter:     "",
};

// ── 1. ISR fetch (for Footer, ProductPage, etc.) ──────────────────────────
// Uses Next.js extended fetch so the response is cached at the framework level.
// After 1 hour, the cache is stale and Next.js rebuilds it on the next request.
// Call revalidatePath("/api/site-config") from the PUT route to bust early.
export async function getSiteConfig() {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/site-config`, {
      next: { revalidate: 3600, tags: ["site-config"] },
    });

    if (!res.ok) return DEFAULT_SITE_CONFIG;

    const data = await res.json();
    return data ?? DEFAULT_SITE_CONFIG;
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}


// ── 2. Direct DB fetch (for admin panel only) ─────────────────────────────
export async function getSiteConfigDirect() {
  await DbConnect();

  const doc = await SiteConfig.findOne().lean();

  if (!doc) return DEFAULT_SITE_CONFIG;

  // lean() returns a plain JS object — stringify/parse strips Mongoose internals
  return JSON.parse(JSON.stringify(doc));
}