"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateAndProfile from "./CreateAndProfile";
import HamburgerIcon from "./HamburgerIcon";
import AnimatedSearchBar from "./AnimatedSearchBar";

export default function Header({ user, open, setOpen, toggleRef }) {
  const pathname = usePathname();

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

        <AnimatedSearchBar/>

        {/* Actions */}
        <CreateAndProfile user={user} />
      </div>
    </header>
  );
}
