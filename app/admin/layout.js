// app/admin/layout.js
import Sidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage categories and products",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 ">
      {/* Sidebar - Top on mobile, Left on desktop */}
      <div className="w-full lg:w-56 bg-gray-900 z-20 rounded-sm">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}