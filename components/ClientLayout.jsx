// components/ClientLayout.jsx
//
// Async server component — fetches site config once per request (ISR, revalidate: 3600).
// Passes `config` to both Header and Footer so branding is dynamic in both places.
// Cache is busted instantly when admin saves via PUT /api/site-config (revalidateTag).

import Footer          from "./Footer";
import Header          from "./Header";
import { getSiteConfig } from "@/lib/fetchers/siteConfig";

export default async function ClientLayout({ children }) {
  const config = await getSiteConfig();

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header config={config} />
      <main className="mt-32 sm:mt-18 flex-1">
        {children}
      </main>
      <Footer config={config} />
    </div>
  );
}