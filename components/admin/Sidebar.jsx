// components/admin/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Package,
  LogOut,
  Palette,
  Blocks,
  GalleryHorizontal,
  Settings, // ← new
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard",   path: "/admin",              icon: LayoutDashboard  },
    { name: "Categories",  path: "/admin/categories",   icon: FolderOpen       },
    { name: "Products",    path: "/admin/products",     icon: Package          },
    { name: "Variants",    path: "/admin/variants",     icon: Palette          },
    { name: "Applications",path: "/admin/applications", icon: Blocks           },
    { name: "Carousel",    path: "/admin/carousel",     icon: GalleryHorizontal},
    { name: "Site Config", path: "/admin/site-config",  icon: Settings         }, // ← new
  ];

  return (
    <aside className="w-full h-full lg:w-56 bg-gray-900 text-white flex flex-col justify-between rounded-sm">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-bold text-orange-500">Admin Panel</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your store</p>
      </div>

      {/* Nav */}
      <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2 p-3 auto-rows-max">
        {navItems.map((item) => {
          const isActive =
            item.path === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.path + "/") || pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              prefetch
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? "bg-orange-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 mt-auto">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm w-full">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Logout</span>
        </button>
        <p className="text-xs text-gray-500 mt-3">© 2025 Amrita Interior</p>
      </div>
    </aside>
  );
}