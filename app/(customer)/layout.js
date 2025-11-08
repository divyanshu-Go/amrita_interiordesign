import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import { getUserProfile } from "@/lib/api/api";

export const metadata = {
  title: "Amrita Interior Design - Premium Flooring & Interior Materials",
  description: "Shop premium wooden flooring, tiles, wallpapers, and more",
};

export default async function CustomerLayout({ children }) {
  const user = await getUserProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}