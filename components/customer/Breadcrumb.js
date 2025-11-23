"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { truncate } from "@/lib/utils";

export default function Breadcrumb({ items }) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-2 py-1">
        <ol className="flex items-center space-x-1 text-xs text-gray-500">
          {/* Home */}
          <li>
            <Link
              href="/"
              className="hover:text-orange-800/80 transition-colors"
            >
              Home
            </Link>
          </li>

          {/* Other Items */}
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-1">
              <ChevronRight size={14} className="text-gray-400" />

              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-orange-800/80 transition-colors"
                >
                  {truncate(item.label)}
                </Link>
              ) : (
                <span className="text-gray-500 bg-neutral-100 rounded-xs px-2 py-0.5 font-medium">
                  {truncate(item.label)}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
