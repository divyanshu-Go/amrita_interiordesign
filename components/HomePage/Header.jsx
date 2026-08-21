// components/HomePage/Header.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
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

  const cleanWhatsapp = whatsapp ? whatsapp.replace(/\D/g, "") : "";
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}`
    : "https://wa.me/919354813449";

  const displayPhone = phone || "+91 98765 43210";

  const categories = [
    { label: "Home", href: "/", icon: Home },
    { label: "PVC Panels", href: "/category/pvc-panels", icon: Grid },
    { label: "WPC Panels", href: "/category/louvers", icon: Layers },
    { label: "Wallpapers", href: "/category/wallpapers", icon: FileText },
    { label: "Flooring", href: "/category/flooring", icon: Boxes },
    { label: "Louvers", href: "/category/louvers", icon: Menu },
  ];

  return (
    <header className="bg-white w-full fixed top-0 z-50 shadow-sm border-b border-neutral-100 font-sans">
      {/* ── Layer 1: Top Announcement Bar ── */}
      <div className="bg-neutral-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-6 md:gap-10 font-medium tracking-wide">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-primary-500" />
            <span>Delivery Across Delhi NCR</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <div className="flex text-primary-300">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span>Trusted by 1500+ Customers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PhoneCall className="w-3 h-3 text-primary-500" />
            <span>Call Now : {displayPhone}</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-primary-500" />
            <span>Get Free Interior Consultation</span>
          </div>
        </div>
      </div>

      {/* ── Layer 2: Main Navigation Bar ── */}
      <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-3">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 lg:gap-6">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <Image
              src={logoUrl || "/logo.png"}
              alt="Interio97"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <div className="flex flex-col justify-center leading-none">
              <span className="text-xl font-extrabold tracking-wide text-neutral-900">
                Interio<span className="text-primary-500">97</span>
              </span>
              {tagline && (
                <span className="text-[7px] text-neutral-500 font-semibold tracking-wide">
                  {tagline}
                </span>
              )}
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="order-4 lg:order-none w-full lg:flex-1 lg:max-w-2xl">
            <div className="flex w-full h-10 rounded-md border border-neutral-300 overflow-hidden bg-neutral-50 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <div className="flex items-center pl-3.5 text-neutral-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, categories, collections..."
                className="w-full pl-2.5 pr-3 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-5 text-xs font-semibold tracking-wide transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Call + WhatsApp */}
          <div className="hidden sm:flex order-2 lg:order-none flex-1 lg:flex-none justify-center lg:justify-start items-center gap-2">
            <a
              href={`tel:${displayPhone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 h-10 px-3 rounded-md bg-primary-50 border border-primary-100 hover:bg-primary-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-primary-600" strokeWidth={2.5} />
              <div className="flex flex-col text-left leading-none gap-0.5">
                <span className="text-[10px] text-neutral-500 font-medium">Call Now</span>
                <span className="text-xs font-bold text-neutral-900">{displayPhone}</span>
              </div>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow-sm flex-shrink-0"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
          </div>

          {/* Login + Cart */}
          {/* Login + Cart */}
          <div className="order-3 lg:order-none flex items-center gap-2 flex-shrink-0 ml-auto lg:ml-0">
            <Link
              href={user ? "/account" : "/login"}
              className="inline-flex items-center justify-center p-2.5 rounded-md bg-primary-50 border border-primary-300/50 text-primary-600 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-colors"
              title={user ? "My Account" : "Login"}
            >
              <User2 className="w-[16px] h-[16px]" strokeWidth={2.5} />
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center p-2.5 rounded-md bg-primary-50 border border-primary-300/50 text-primary-600 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-colors"
              title="Cart"
            >
              <ShoppingCart className="w-[16px] h-[16px]" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>




      {/* ── Layer 3: Category Links Navigation ── */}
      <div className="border-t border-neutral-100 bg-white">
        <div className="max-w-[1600px] mx-auto px-2 lg:px-8">
          <nav className="flex items-center justify-start lg:justify-center gap-1 lg:gap-2 w-full overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive =
                cat.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(cat.href);

              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className={`flex-shrink-0 flex items-center justify-center gap-1.5 lg:px-4 px-3 py-2 text-[10px] lg:text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${isActive
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-neutral-700 hover:text-primary-600 hover:border-primary-100"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
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