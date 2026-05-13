// app/(customer)/layout.js

import WhatsAppFloating from "@/components/ui/WhatsAppFloating";
import { getSiteConfig } from "@/lib/fetchers/siteConfig";

export default async function CustomerLayout({ children }) {
  const config = await getSiteConfig();
  const { whatsapp } = config;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>

      {/* Global WhatsApp Button */}
      <WhatsAppFloating phone={whatsapp} />
    </div>
  );
}