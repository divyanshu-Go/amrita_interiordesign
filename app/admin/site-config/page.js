// app/admin/site-config/page.js
//
// Server component — fetches the LIVE config from DB (bypasses ISR cache)
// then hands it to the client SiteConfigManager for editing.
// Mirrors your app/admin/carousel/page.js pattern exactly.

import { getSiteConfigDirect } from "@/lib/fetchers/siteConfig";
import SiteConfigManager       from "@/components/admin/SiteConfigManager";
import { Settings }            from "lucide-react";

export const dynamic = "force-dynamic"; // always fetch latest from DB

export default async function SiteConfigAdminPage() {
  const config = await getSiteConfigDirect();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-2 rounded-lg">
          <Settings className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Config</h1>
          <p className="text-sm text-gray-500">
            Update your company details, contact info, and social links shown across the site.
          </p>
        </div>
      </div>

      {/* Manager */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <SiteConfigManager initial={config} />
      </div>
    </div>
  );
}