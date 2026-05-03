// components/HomePage/ProductByApplicationSection.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightCircle } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCardGrid from "@/components/customer/ProductCardGrid";

const MAX_APPS = 6;
const MAX_PRODUCTS = 5; // +1 "Explore All" card fills the 6th slot

export default function ProductByApplicationSection({ applications, map }) {
  const apps = applications.slice(0, MAX_APPS);
  const [selectedId, setSelectedId] = useState(apps?.[0]?._id ?? null);

  const products = selectedId ? (map[selectedId] ?? []) : [];
  const selectedApp = apps.find((a) => a._id === selectedId);
  
  if (!apps.length) return null;
  
  
  

  return (
    <Section>
      <SectionHeading
        title="Products by"
        accent="Application"
        subtitle="Choose where you want to use the product"
      />

      {/* ── Application tab selector ── */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-10">
        {apps.map((app) => {
          const isActive = selectedId === app._id;
          return (
            <button
              key={app._id}
              onClick={() => setSelectedId(app._id)}
              className={`flex flex-col items-center gap-1.5 transition-all ${isActive ? "scale-105" : "opacity-70 hover:opacity-100"
                }`}
            >
              {/* Icon tile */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${isActive
                    ? "border-orange-500 ring-4 ring-orange-100 shadow-md"
                    : "border-gray-200 hover:border-orange-300"
                  }`}
              >
                {app.image && app.image.trim() !== "" ? (
                  <Image
                    src={app.image || "/logo.png"}
                    alt={app.name || "Application"}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center p-2 text-gray-400">
                    <span className="text-xl">🏠</span>
                  </div>
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${isActive ? "text-orange-600" : "text-gray-600"
                  }`}
              >
                {app.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Product grid ── */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400">
          No products found for this application.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.slice(0, MAX_PRODUCTS).map((product) => (
            <ProductCardGrid key={product._id} product={product} />
          ))}

          {/* Explore All card */}
          <Link
            href={`/applications/${selectedApp?.slug ?? ""}`}
            className="
              border-2 border-dashed border-gray-200 rounded-xl
              flex flex-col items-center justify-center p-5 text-center
              hover:border-orange-400 hover:bg-orange-50/50 transition-all group
            "
          >
            <ArrowRightCircle className="w-9 h-9 text-orange-400 group-hover:text-orange-500 mb-2 transition-colors" />
            <p className="text-sm font-semibold text-gray-700">Explore All</p>
            <p className="text-xs text-gray-400 mt-0.5">View more products</p>
          </Link>
        </div>
      )}
    </Section>
  );
}