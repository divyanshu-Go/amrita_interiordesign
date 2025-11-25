"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen, Package, LogOut ,Palette, Layers } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Categories", path: "/admin/categories", icon: FolderOpen },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Color Variants", path: "/admin/color-variants", icon: Palette },
    { name: "Pattern Variants", path: "/admin/pattern-variants", icon: Layers },

  ];

  return (
    <aside className="w-56  bg-gray-900 text-white min-h-screen flex flex-col rounded-md">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-bold text-orange-500">Admin Panel</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your store</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? "bg-orange-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
        <p className="text-xs text-gray-500 mt-3">© 2025 Amrita Interior</p>
      </div>
    </aside>
  );
}