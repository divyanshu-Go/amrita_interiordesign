"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import CreateAndProfile from "./CreateAndProfile";
import axios from "axios";
import {
  LogIn,
  LogOut,
  Home,
  Users,
  ClipboardList,
  UserCog,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar({ user, open, setOpen, toggleRef }) {
  const pathname = usePathname();
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen, toggleRef]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (href) => pathname === href;

  const menuItems = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/user", label: "Users", icon: <Users className="w-4 h-4" /> },
    {
      href: "/tasks",
      label: "Task",
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      href: "/create-task",
      label: "Create Task",
      icon: <Plus className="w-4 h-4" />,
      special: true,
    },
  ];

  if (user?.role === "admin") {
    menuItems.push({
      href: "/admin-dashboard",
      label: "Admin Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    });
  }

  return (
    <aside
      ref={sidebarRef}
      className={`flex flex-col justify-between h-[calc(100%-4rem)] blurred-bg fixed top-[3.3rem] left-0 w-64 rounded
         bg-orange-50 shadow-md z-40 transform transition-transform duration-150 ease-in-out border border-orange-500 
         ${open ? "translate-x-1" : "-translate-x-full"}`}
    >
      {/* Top - Navigation */}
      <div className="p-4 flex-grow overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-orange-700">
          Navigation
        </h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                  : "text-orange-500 hover:bg-orange-200 hover:text-orange-700"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom - Actions & Auth */}
      <div className="p-4 flex items-center gap-4 border-t border-orange-100">
        {user ? (
          <button
            className="flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        ) : (
          <Link
            className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            href="/login"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Link>
        )}
        <CreateAndProfile user={user} />
      </div>
    </aside>
  );
}
