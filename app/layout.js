// app/layout.js
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from "./providers/AuthProvider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Interior Designers in Delhi NCR | Interio97",
  description: "Affordable modular kitchen & home interior design services in Delhi NCR.",
};

export default function RootLayout({ children }) {
  // FIX: Removed getUserProfile() server call.
  // Auth state is now fully managed client-side via AuthProvider + useAuth.
  // This eliminates the production crash caused by server-side cookie/auth
  // errors bubbling up through the entire page tree.
  return (
    <html lang="en">
      <body className={`${poppins.className} relative min-h-screen flex flex-col`}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster richColors position="top-center" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}