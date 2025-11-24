// components/admin/ProductCard.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteProduct } from "@/lib/fetchers/products";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(product.slug);
      router.refresh();
    } catch (error) {
      alert("Failed to delete product: " + error.message);
      setIsDeleting(false);
    }
  };

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      {mainImage && (
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      {!mainImage && (
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <span className="text-6xl">📦</span>
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 flex-1 line-clamp-2">
            {product.name}
          </h3>
          {product.stock > 0 ? (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
              In Stock
            </span>
          ) : (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
              Out
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-1">SKU: {product.sku}</p>
        <p className="text-gray-600 text-sm mb-2">Stock: {product.stock}</p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-orange-600">
            ₹{product.retailDiscountPrice || product.retailPrice}
          </span>
          {product.retailDiscountPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.retailPrice}
            </span>
          )}
        </div>

        {product.color && (
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-medium">Color:</span> {product.color}
          </p>
        )}
        {product.size && (
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-medium">Size:</span> {product.size}
          </p>
        )}

        {/* 🔥 SELL BY */}
        {product.sellBy && (
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-medium">Sell By:</span> {product.sellBy}
          </p>
        )}

        {/* 🔥 PER SQFT PRICE */}
        {product.showPerSqFtPrice && (
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-medium">Per SqFt Price:</span> ₹{product.perSqFtPrice}
          </p>
        )}

        {/* 🔥 MATERIAL */}
        {product.material?.length > 0 && (
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-medium">Material:</span> {product.material.join(", ")}
          </p>
        )}

        {/* 🔥 PATTERN */}
        {product.pattern?.length > 0 && (
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-medium">Pattern:</span> {product.pattern.join(", ")}
          </p>
        )}

        {/* 🔥 FINISH */}
        {product.finish?.length > 0 && (
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-medium">Finish:</span> {product.finish.join(", ")}
          </p>
        )}

        {/* 🔥 APPLICATION */}
        {product.application?.length > 0 && (
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-medium">Application:</span> {product.application.join(", ")}
          </p>
        )}


        <div className="flex gap-2 mt-4">
          <Link
            href={`/admin/products/${product.slug}`}
            className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-center font-medium text-sm"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}