// components/HomePage/ProductByApplicationSection.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/customer/ProductCardGrid";
import { ArrowRightCircle } from "lucide-react";

export default function ProductByApplicationSection({ applications, map }) {
  const apps = applications.slice(0, 6); // limit to first 6
  const [selected, setSelected] = useState(apps?.[0]?._id || null);

  const products = selected ? map[selected] || [] : [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* ---------------- Header ---------------- */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Products by <span className="text-orange-600">Application</span>
        </h2>
        <p className="text-gray-600 text-sm">
          Choose where you want to use the product
        </p>
      </div>

      {/* ---------------- Application Selector ---------------- */}
      <div className="flex justify-center flex-wrap gap-6 mb-14">
        {apps.map((app) => {
          const isActive = selected === app._id;
          return (
            <button
              key={app._id}
              onClick={() => setSelected(app._id)}
              className={`
                flex flex-col items-center text-center transition-all
                ${isActive ? "scale-105" : "opacity-80 hover:opacity-100"}
              `}
            >
              {/* Circle */}
              <div
                className={`
                  w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center mb-2
                  border-2 transition-all
                  ${
                    isActive
                      ? "border-orange-500 ring-4 ring-orange-200 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <Image
                  src={app.image}
                  alt={app.name}
                  width={80}
                  height={80}
                  className="object-contain p-2.5"
                />
              </div>

              <p className="text-sm font-medium text-gray-700">{app.name}</p>
            </button>
          );
        })}
      </div>

      {/* ---------------- Products Showcase ---------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Product Cards */}
        {products.slice(0, 5).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}

        {/* ---------------- Explore All Card ---------------- */}
        <Link
          href={`/applications/${apps.find((a) => a._id === selected)?.slug}`}
          className="
            border-2 border-dashed border-gray-300 rounded-xl
            flex flex-col items-center justify-center p-6 text-center
            hover:border-orange-500 hover:bg-orange-50/40 transition
          "
        >
          <ArrowRightCircle className="w-10 h-10 text-orange-500 mb-3" />
          <p className="font-semibold text-gray-800">Explore All</p>
          <p className="text-xs text-gray-500 mt-1">View more products</p>
        </Link>
      </div>
    </section>
  );
}
