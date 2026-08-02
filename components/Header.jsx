"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  Search,
  User2,
  ShoppingCart,
  PhoneCall,
  Truck,
  Star,
  Flame,
  Home,
  Grid,
  Layers,
  FileText,
  Boxes,
  Maximize2,
  Menu,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Header({ config = {} }) {
  const {
    tagline = "",
    logoUrl = "",
    phone = "",
    whatsapp = "",
  } = config;

  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Clean WhatsApp number to ensure valid link format
  const cleanWhatsapp = whatsapp ? whatsapp.replace(/\D/g, "") : "";
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}`
    : "https://wa.me/919354813449";

  const displayPhone = phone || "+91 98765 43210";

  const categories = [
    { label: "Home", href: "/", icon: Home },
    { label: "PVC Panels", href: "/category/pvc-panels", icon: Grid },
    { label: "WPC Panels", href: "/category/wpc-panels", icon: Layers },
    { label: "Wallpapers", href: "/category/wallpapers", icon: FileText },
    { label: "Flooring", href: "/category/flooring", icon: Boxes },
    { label: "Louvers", href: "/category/louvers", icon: Menu },
  ];

  return (
    <header className="bg-white w-full fixed top-0 z-50 shadow-sm border-b border-gray-100 font-sans">
      {/* ── Layer 1: Top Announcement Bar ── */}
      <div className="bg-[#18181b] text-white text-[11px] py-1.5 px-4 border-b border-zinc-800">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-6 md:gap-10 font-medium tracking-wide">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-orange-500" />
            <span>Delivery Across Delhi NCR</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <div className="flex text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span>Trusted by 1500+ Customers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PhoneCall className="w-3 h-3 text-orange-500" />
            <span>Call Now : {displayPhone}</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Get Free Interior Consultation</span>
          </div>
        </div>
      </div>

      {/* ── Layer 2: Main Navigation Bar ── */}
      <div className=" w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-2">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-around gap-3 lg:gap-5">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <img
              src={logoUrl || "/logo.png"}
              alt="Interio97"
              className="w-9 h-9 object-contain"
            />
            <div className="flex flex-col justify-center">
              <span className="text-xl font-extrabold tracking-wider text-gray-900 leading-none">
                Interio<span className="text-orange-500">97</span>
              </span>
              {tagline && (
                <span className="text-[7px] text-gray-500 font-semibold tracking-wide mt-0.5">
                  {tagline}
                </span>
              )}
            </div>
          </Link>

          {/* Search Bar — full-width row of its own below `lg`, inline (order-none) from `lg` up */}
          <form onSubmit={handleSearch} className="order-4 lg:order-none w-full lg:flex-1 lg:max-w-2xl">
            <div className="flex w-full h-10 rounded-md border border-gray-200 overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all bg-gray-50/50">
              <div className="flex items-center pl-3 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, categories, collections..."
                className="w-full pl-2.5 pr-3 bg-transparent text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#ff5722] hover:bg-orange-600 text-white px-5 text-xs font-semibold transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Call + WhatsApp — centered in available space on mobile/tablet, inline (order-none) on desktop */}
          <div className="hidden sm:flex order-2 lg:order-none flex-1 lg:flex-none justify-center lg:justify-start items-center gap-2">
            <a
              href={`tel:${displayPhone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 h-10 px-3 rounded-md bg-orange-50/60 border border-orange-100/80 hover:bg-orange-100/70 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-orange-600" strokeWidth={2.5} />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-gray-500 font-medium">Call Now</span>
                <span className="text-[11px] font-bold text-gray-900">{displayPhone}</span>
              </div>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-md bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-colors shadow-sm flex-shrink-0"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp className="w-4.5 h-4.5" />
            </a>
          </div>

          {/* Login + Cart — two separate components, wrapped only to cap the gap between them */}
          <div className="order-3 lg:order-none flex items-center gap-2 flex-shrink-0 ml-auto lg:ml-0">
            <Link
              href={user ? "/account" : "/login"}
              className="flex flex-col items-center justify-center gap-0.5 w-10 h-10 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              title={user ? "My Account" : "Login"}
            >
              <User2 className="w-[18px] h-[18px]" strokeWidth={2.5} />
              <span className="text-[9px] font-medium leading-none">
                {user ? user.name?.split(" ")[0] || "Account" : "Login"}
              </span>
            </Link>
            <Link
              href="/cart"
              className="flex flex-col items-center justify-center gap-0.5 w-10 h-10 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              title="Cart"
            >
              <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2.5} />
              <span className="text-[9px] font-medium leading-none">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Layer 3: Category Links Navigation (single-select, route-driven) ── */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-[1600px] mx-auto px-2 lg:px-8">
          <nav className="flex items-center justify-between w-full overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = pathname === cat.href;
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className={`flex items-center justify-center gap-1 lg:gap-1.5 flex-1 px-1.5 py-1 lg:py-1.5 text-[9px] lg:text-[11px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-700 hover:text-orange-600"
                  }`}
                >
                  <Icon className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}