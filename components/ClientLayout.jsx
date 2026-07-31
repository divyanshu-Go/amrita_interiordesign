// components/ClientLayout.jsx

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