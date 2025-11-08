"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">MD</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Material Depot
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 pl-10 pr-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* User Icon */}
            <Link
              href="/account"
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-50">
                <span className="text-xl">👤</span>
              </div>
              {user && (
                <span className="hidden md:block text-sm font-medium">
                  {user.name}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-9 h-9 bg-gray-100 rounded-full hover:bg-orange-50 transition-colors"
            >
              <span className="text-xl">🛒</span>
              {/* You can add cart count badge here later */}
              {/* <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span> */}
            </Link>
          </div>
        </div>
      </div>

      {/* User Role Indicator (for testing) */}
      {user && user.role === "enterprise" && (
        <div className="bg-orange-100 border-t border-orange-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
            <p className="text-xs text-orange-800 text-center">
              🏢 Enterprise Pricing Active
            </p>
          </div>
        </div>
      )}
    </header>
  );
}