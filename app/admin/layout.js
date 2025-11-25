// admin/layout.js

import Sidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage categories and products",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar/>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}