import DbConnect from "@/lib/Db/DbConnect";
import SiteConfig from "@/models/siteConfig";
import { unstable_cache } from "next/cache";

export const DEFAULT_SITE_CONFIG = {
  companyName: "Interio97",
  tagline: "",
  logoUrl: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  instagram: "",
  linkedin: "",
  twitter: "",
};

// ✅ Cached (ISR-style)
export const getSiteConfig = unstable_cache(
  async () => {
    await DbConnect();

    const doc = await SiteConfig.findOne().lean();

    if (!doc) return DEFAULT_SITE_CONFIG;

    return JSON.parse(JSON.stringify(doc));
  },
  ["site-config"],
  {
    revalidate: 3600,
    tags: ["site-config"],
  }
);

// ✅ Direct (admin only)
export async function getSiteConfigDirect() {
  await DbConnect();

  const doc = await SiteConfig.findOne().lean();

  if (!doc) return DEFAULT_SITE_CONFIG;

  return JSON.parse(JSON.stringify(doc));
}