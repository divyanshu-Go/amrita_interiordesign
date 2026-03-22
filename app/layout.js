// app/layout.js
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from "./providers/AuthProvider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

// ── BEFORE: loaded all 9 weights (100–900) = ~600KB of font files
// ── AFTER:  only the 3 weights actually used in Tailwind classes
//            (font-normal=400, font-medium=500, font-semibold=600)
//            saves ~300–400 KB on every page load
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap", // show text in fallback font while Poppins loads (faster FCP)
});

export const metadata = {
  // Title template: child pages set their own title, this becomes the suffix.
  // e.g. product page sets "Wooden Flooring" → browser shows "Wooden Flooring | Interio97"
  title: {
    default: "Interior Designers in Delhi NCR | Interio97",
    template: "%s | Interio97",
  },
  description:
    "Shop premium flooring, tiles, wallpapers & interior design materials in Delhi NCR. Best prices, fast delivery.",
  metadataBase: new URL("https://www.interio97.in"),
  openGraph: {
    siteName: "Interio97",
    locale: "en_IN",
    type: "website",
  },
  // Tells Google which version is canonical when both www and non-www exist
  alternates: {
    canonical: "https://www.interio97.in",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} relative min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster richColors position="top-center" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}