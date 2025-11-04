"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Categories", path: "/admin/categories", icon: "📁" },
    { name: "Products", path: "/admin/products", icon: "📦" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-orange-500">Admin Panel</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your store</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-800 absolute bottom-6">
        <p className="text-gray-500 text-sm">© 2025 Admin Dashboard</p>
      </div>
    </aside>
  );
}