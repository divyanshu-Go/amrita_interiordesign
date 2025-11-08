"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CreateAndProfile from "./CreateAndProfile";
import HamburgerIcon from "./HamburgerIcon";
import AnimatedSearchBar from "./AnimatedSearchBar";
import { useState } from "react";

export default function Header({ user, open, setOpen, toggleRef }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
  
    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    };

  const navLinks = [
    { name: "Home", href: "/" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white flex w-full fixed z-50 gap-1 px-1 pt-1">
      {/* Hamburger icon */}
      {/* <div className="flex items-center" ref={toggleRef}>
        <HamburgerIcon open={open} setOpen={setOpen} />
      </div> */}

      {/* Navigation bar */}
      <div
        className="b
        flex flex-grow items-center justify-between px-3 h-16
        bg-transparent rounded
        "
      >
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span
            className="
              flex items-center gap-3 font-bold text-lg tracking-wider text-orange-600
            "
          >
            <img src="logo.png" alt="logo" width={48} />
            <div className="b flex flex-col items-center text-orange-700 ">
              <span className="text-2xl font-bold tracking-widest leading-tight">Amrita</span>
              <span className="text-[10px] leading-tight">Interior & Design</span>

            </div>
          </span>
        </Link>

        <div className="bg-gray-200 px-4 py-1 rounded-md text-sm">Delivery to 
          110086
        </div>

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


        {/* Actions */}
        <CreateAndProfile user={user} />
      </div>
    </header>
  );
}
