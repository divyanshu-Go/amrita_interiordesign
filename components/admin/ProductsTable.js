"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/fetchers/products";
import { Edit, Trash2, Search, Package, Info, Eye } from "lucide-react";
import Toast from "./Toast";
import ProductDetailsPopup from "./ProductDetailsPopup";

export default function ProductsTable({ products, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const router = useRouter();


  console.log(products)

  const [openId, setOpenId] = useState(null);
  useEffect(() => {
  const closeOnOutsideClick = () => setOpenId(null);
  window.addEventListener("click", closeOnOutsideClick);
  return () => window.removeEventListener("click", closeOnOutsideClick);
}, []);


  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      (Array.isArray(product.category) &&
        product.category.some((c) => c._id === selectedCategory));

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "inStock" && product.stock > 0) ||
      (stockFilter === "outOfStock" && product.stock === 0) ||
      (stockFilter === "lowStock" && product.stock > 0 && product.stock < 10);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(product._id);
    try {
      await deleteProduct(product.slug);
      setToast({ message: "Product deleted successfully!", type: "success" });
      router.refresh();
    } catch (error) {
      setToast({ message: error.message || "Failed to delete", type: "error" });
    } finally {
      setDeleting(null);
    }
  };

  // helper to show value or dash
  const showOrDash = (val, formatter) => {
    if (
      val === null ||
      val === undefined ||
      (Array.isArray(val) && val.length === 0) ||
      val === ""
    ) {
      return "-";
    }
    return formatter ? formatter(val) : val;
  };

  const money = (num) =>
    typeof num === "number" ? `₹${num.toLocaleString("en-IN")}` : "-";

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Stock</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock (&lt;10)</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        {(searchQuery || selectedCategory || stockFilter !== "all") && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setStockFilter("all");
              }}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className=" bg-white rounded-md  border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Categories
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  SKU
                </th>

                <th
                  className="px-4  py-3 min-w-40 text-center text-xs font-semibold text-gray-700
                 uppercase tracking-wider"
                >
                  Price
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Details
                </th>

                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Product column */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-sm object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-sm flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </p>
                          {product.brand && (
                            <p className="text-xs text-gray-500">
                              {product.brand}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Categories column (new) */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(product.category) &&
                        product.category.length > 0 ? (
                          product.category.map((cat) => (
                            <span
                              key={cat._id}
                              className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-xs"
                            >
                              {cat.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-400 rounded-xs">
                            -
                          </span>
                        )}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded-xs text-gray-700">
                        {showOrDash(product.sku)}
                      </code>
                    </td>

                    {/* Price Column with sub-columns */}
                    <td className="px-4 border border-gray-200 py-3 min-w-40">
                      <div className="grid grid-cols-2 gap-3 ">
                        {/* RETAIL BLOCK */}
                        <div>
                          <p className="text-[11px] font-semibold text-gray-700">
                            Retail
                          </p>

                          <p className="text-[10px] text-gray-500">Discount:</p>
                          <p className="font-medium text-sm">
                            {product.retailDiscountPrice != null
                              ? money(product.retailDiscountPrice)
                              : "-"}
                          </p>

                          {product.showPerSqFtPrice && (
                            <>
                              <p className="text-[11px] text-gray-500 mt-1">
                                Per Sq Ft:
                              </p>
                              <p className="font-medium text-sm">
                                {product.perSqFtPriceRetail != null
                                  ? money(product.perSqFtPriceRetail)
                                  : "-"}
                              </p>
                            </>
                          )}
                        </div>

                        {/* ENTERPRISE BLOCK */}
                        <div>
                          <p className="text-[11px] font-semibold text-gray-700">
                            Enterprise
                          </p>

                          <p className="text-[10px] text-gray-500">Discount:</p>
                          <p className="font-medium text-sm">
                            {product.enterpriseDiscountPrice != null
                              ? money(product.enterpriseDiscountPrice)
                              : "-"}
                          </p>

                          {product.showPerSqFtPrice && (
                            <>
                              <p className="text-[11px] text-gray-500 mt-1">
                                Per Sq Ft:
                              </p>
                              <p className="font-medium text-sm">
                                {product.perSqFtPriceEnterprise != null
                                  ? money(product.perSqFtPriceEnterprise)
                                  : "-"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-sm ${
                          product.stock === 0
                            ? "bg-red-100 text-red-800"
                            : product.stock < 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    {/* Details column - info icon with hover popup */}
                    <td className="px-4 py-3 text-center">
                      <div
  className="relative inline-block"
  onMouseEnter={() => setOpenId(product._id)}     // desktop hover open
  onMouseLeave={() => setOpenId(null)}            // desktop hover close
>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      setOpenId(openId === product._id ? null : product._id); // mobile toggle
    }}
    className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-100"
  >
    <Info className="w-4 h-4 text-gray-600" />
  </button>

  <ProductDetailsPopup
    product={product}
    isOpen={openId === product._id}
  />
</div>

                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${product.slug}`}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.slug}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deleting === product._id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredProducts.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        )}
      </div>
    </>
  );
}
