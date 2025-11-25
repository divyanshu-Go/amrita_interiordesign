"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/fetchers/products";

export default function ProductForm({
  product = null,
  categories = [],
  colorVariants = [],
  patternVariants = [],
}) {
  const router = useRouter();
  const isEdit = !!product;

  const [showCategorySelect, setShowCategorySelect] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    sku: product?.sku || "",
    category: Array.isArray(product?.category)
      ? product.category.map((c) => c._id || c)
      : product?.category?._id
      ? [product.category._id]
      : [],
    description: product?.description || "",
    brand: product?.brand || "",
    images: product?.images?.join(", ") || "",
    retailPrice: product?.retailPrice || "",
    retailDiscountPrice: product?.retailDiscountPrice || "",
    enterprisePrice: product?.enterprisePrice || "",
    enterpriseDiscountPrice: product?.enterpriseDiscountPrice || "",
    stock: product?.stock || 0,
    color: product?.color || "",
    thickness: product?.thickness || "",
    size: product?.size || "",
    variantGroupId: product?.variantGroupId || "",
    tags: product?.tags?.join(", ") || "",
    isFeatured: product?.isFeatured || false,
    colorVariant: product?.colorVariant || "",
    patternVariant: product?.patternVariant || "",

    // 🔥 NEW FIELDS ADDED HERE
    // ---------------------------------------------------------
    sellBy: product?.sellBy || "box", // box | roll | piece
    showPerSqFtPrice: product?.showPerSqFtPrice || false,
    perSqFtPrice: product?.perSqFtPrice || "",
    material: Array.isArray(product?.material)
      ? product.material.join(", ")
      : product?.material || "",
    pattern: Array.isArray(product?.pattern)
      ? product.pattern.join(", ")
      : product?.pattern || "",
    finish: Array.isArray(product?.finish)
      ? product.finish.join(", ")
      : product?.finish || "",
    application: Array.isArray(product?.application)
      ? product.application.join(", ")
      : product?.application || "",

    coverageArea: product?.coverageArea || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug from name if creating new product
    if (name === "name" && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        images: formData.images
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        retailPrice: Number(formData.retailPrice),
        retailDiscountPrice: formData.retailDiscountPrice
          ? Number(formData.retailDiscountPrice)
          : undefined,
        enterprisePrice: Number(formData.enterprisePrice),
        enterpriseDiscountPrice: formData.enterpriseDiscountPrice
          ? Number(formData.enterpriseDiscountPrice)
          : undefined,
        stock: Number(formData.stock),
        thickness: formData.thickness ? Number(formData.thickness) : undefined,
        colorVariant: formData.colorVariant || null,
        patternVariant: formData.patternVariant || null,

        // 🔥 NEW FIELDS PROPERLY ADDED HERE
        // ---------------------------------------------------------
        sellBy: formData.sellBy,
        showPerSqFtPrice: formData.showPerSqFtPrice,
        perSqFtPrice: formData.perSqFtPrice
          ? Number(formData.perSqFtPrice)
          : undefined,
        material: formData.material
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        pattern: formData.pattern
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        finish: formData.finish
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),

        coverageArea: formData.coverageArea,

        application: formData.application
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        category: Array.isArray(formData.category)
          ? formData.category
          : [formData.category],
      };

      if (isEdit) {
        await updateProduct(product.slug, payload);
      } else {
        await createProduct(payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="e.g., HDF RealWood Floor - Oak Brown"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                disabled={isEdit}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:bg-gray-100"
                placeholder="e.g., realwood-oak-brown-8mm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="e.g., RW-OB-8MM-001"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Categories <span className="text-red-500">*</span>
              </label>

              {/* Selected category pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.category.map((catId) => {
                  const cat = categories.find((c) => c._id === catId);
                  return (
                    <div
                      key={catId}
                      className="flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                    >
                      {cat?.name || "Unknown"}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            category: prev.category.filter(
                              (id) => id !== catId
                            ),
                          }))
                        }
                        className="ml-2 text-orange-700 hover:text-orange-900"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}

                {/* Add Category Button */}
                <button
                  type="button"
                  onClick={() => setShowCategorySelect(!showCategorySelect)}
                  className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                >
                  Add Category
                </button>
              </div>

              {/* Dropdown visible only when button is clicked */}
              {showCategorySelect && (
                <select
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (!selected) return;

                    setFormData((prev) => ({
                      ...prev,
                      category: [...new Set([...prev.category, selected])], // avoid duplicates
                    }));
                    setShowCategorySelect(false); // hide select after choosing
                  }}
                >
                  <option value="">Select a category</option>

                  {categories
                    .filter((cat) => !formData.category.includes(cat._id))
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sell & Pricing Options
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* SELL BY */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Sell By *
                  </label>
                  <select
                    name="sellBy"
                    value={formData.sellBy}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                  >
                    <option value="box">Price / Box</option>
                    <option value="roll">Price / Roll</option>
                    <option value="piece">Price / Piece</option>
                  </select>
                </div>

                {/* SHOW PER SQFT PRICE */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="showPerSqFtPrice"
                    checked={formData.showPerSqFtPrice}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <label className="ml-2 text-gray-700 font-medium">
                    Show Per SqFt Price
                  </label>
                </div>

                {/* PER SQFT PRICE */}
                {formData.showPerSqFtPrice && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Per SqFt Price
                    </label>
                    <input
                      type="number"
                      name="perSqFtPrice"
                      value={formData.perSqFtPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 rounded-lg"
                      placeholder="e.g., 22.5"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Color Variant */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Color Variant
              </label>
              <select
                name="colorVariant"
                value={formData.colorVariant}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg"
              >
                <option value="">None</option>
                {colorVariants?.map((cv) => (
                  <option key={cv._id} value={cv._id}>
                    {cv.name} ({cv.hexCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Pattern Variant */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Pattern Variant
              </label>
              <select
                name="patternVariant"
                value={formData.patternVariant}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg"
              >
                <option value="">None</option>
                {patternVariants?.map((pv) => (
                  <option key={pv._id} value={pv._id}>
                    {pv.name}
                  </option>
                ))}
              </select>
            </div>

            {/* -------------------------------------------- */}
            {/* 🔥 ADD MATERIAL + PATTERN + FINISH + COVERAGE */}
            {/* -------------------------------------------- */}

            <div className="border-b pb-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                    placeholder="HDF, PVC, Bamboo"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Pattern
                  </label>
                  <input
                    type="text"
                    name="pattern"
                    value={formData.pattern}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                    placeholder="Oak, Marble, Granite"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Finish
                  </label>
                  <input
                    type="text"
                    name="finish"
                    value={formData.finish}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                    placeholder="Matte, Glossy"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Coverage Area
                  </label>
                  <input
                    type="text"
                    name="coverageArea"
                    value={formData.coverageArea}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                    placeholder="20 sq ft"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-gray-700 font-medium mb-2">
                    Application (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="application"
                    value={formData.application}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                    placeholder="bedroom, hall, kitchen"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="e.g., RealWood"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
                placeholder="Detailed product description"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
          <label className="block text-gray-700 font-medium mb-2">
            Image URLs (comma-separated)
          </label>
          <textarea
            name="images"
            value={formData.images}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter multiple image URLs separated by commas
          </p>
        </div>

        {/* Pricing */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pricing & Stock
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Retail Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="retailPrice"
                value={formData.retailPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Retail Discount Price
              </label>
              <input
                type="number"
                name="retailDiscountPrice"
                value={formData.retailDiscountPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Enterprise Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="enterprisePrice"
                value={formData.enterprisePrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Enterprise Discount Price
              </label>
              <input
                type="number"
                name="enterpriseDiscountPrice"
                value={formData.enterpriseDiscountPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Product Attributes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="e.g., Brown, Grey"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Thickness (mm)
              </label>
              <input
                type="number"
                name="thickness"
                value={formData.thickness}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="e.g., 8"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="e.g., 48x8 inch"
              />
            </div>
          </div>
        </div>

        {/* Variants & Tags */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Variants & Tags
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Variant Group ID
              </label>
              <input
                type="text"
                name="variantGroupId"
                value={formData.variantGroupId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="e.g., RW12345"
              />
              <p className="text-sm text-gray-500 mt-1">
                Group ID to link product variants together
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                placeholder="e.g., laminate, AC4 grade"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label className="ml-2 text-gray-700 font-medium">
                Featured Product
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
            ? "Update Product"
            : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
