"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/fetchers/products";

// Section Header Component
const SectionHeader = ({ number, title }) => (
  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
    <span className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
      {number}
    </span>
    {title}
  </h2>
);

// Input Field Component
const InputField = ({
  label,
  required,
  helperText,
  type = "text",
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm"
    />
    {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
  </div>
);

// Select Field Component
const SelectField = ({ label, required, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm"
    >
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Tag Input Component
const TagInput = ({ label, required, selectedIds, items, onAdd, onRemove, addButtonLabel }) => {
  const [showSelect, setShowSelect] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-gray-50 min-h-10 mb-2">
        {selectedIds.length === 0 ? (
          <span className="text-gray-400 text-xs self-center">None selected</span>
        ) : (
          selectedIds.map((id) => {
            const item = items.find((i) => i._id === id);
            return (
              <div
                key={id}
                className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium"
              >
                {item?.name || "Unknown"}
                <button
                  type="button"
                  onClick={() => onRemove(id)}
                  className="ml-0.5 hover:text-orange-900 font-bold cursor-pointer"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
      {showSelect && (
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 mb-2 text-sm"
          onChange={(e) => {
            if (e.target.value) {
              onAdd(e.target.value);
              setShowSelect(false);
            }
          }}
          autoFocus
        >
          <option value="">Select option</option>
          {items
            .filter((item) => !selectedIds.includes(item._id))
            .map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
        </select>
      )}
      <button
        type="button"
        onClick={() => setShowSelect(!showSelect)}
        className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md transition font-medium"
      >
        {showSelect ? "Hide" : addButtonLabel}
      </button>
    </div>
  );
};

// Main Product Form Component
export default function ProductForm({
  product = null,
  categories = [],
  colorVariants = [],
  patternVariants = [],
  applications = [],
}) {
  const router = useRouter();
  const isEdit = !!product;

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
    sellBy: product?.sellBy || "box",
    showPerSqFtPrice: product?.showPerSqFtPrice || false,
    perSqFtPriceRetail: product?.perSqFtPriceRetail || "",
    perSqFtPriceEnterprise: product?.perSqFtPriceEnterprise || "",
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
      ? product.application.map((a) => a._id || a)
      : [],
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
        sellBy: formData.sellBy,
        showPerSqFtPrice: formData.showPerSqFtPrice,
        perSqFtPriceRetail: formData.perSqFtPriceRetail
          ? Number(formData.perSqFtPriceRetail)
          : undefined,
        perSqFtPriceEnterprise: formData.perSqFtPriceEnterprise
          ? Number(formData.perSqFtPriceEnterprise)
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
        application: Array.isArray(formData.application)
          ? formData.application
          : [],
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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium text-sm">Error</p>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </div>
        )}

        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <SectionHeader number="1" title="Basic Information" />

          <InputField
            label="Product Name"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            helperText="Use descriptive names for better SEO"
            placeholder="Premium Oak Wood Flooring - 8mm"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Slug"
              required
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              disabled={isEdit}
              placeholder="auto-generated-from-name"
              helperText="Auto-generated from product name"
            />
            <InputField
              label="SKU"
              required
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SKU-001234"
              helperText="Unique identifier for inventory"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., LuxeInteriors"
            />
            <TagInput
              label="Categories"
              required
              selectedIds={formData.category}
              items={categories}
              onAdd={(id) =>
                setFormData((prev) => ({
                  ...prev,
                  category: [...new Set([...prev.category, id])],
                }))
              }
              onRemove={(id) =>
                setFormData((prev) => ({
                  ...prev,
                  category: prev.category.filter((cid) => cid !== id),
                }))
              }
              addButtonLabel="Add Category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm resize-none"
              placeholder="Describe features, dimensions, and benefits..."
            />
          </div>
        </div>

        {/* SECTION 2: SPECIFICATIONS */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <SectionHeader number="2" title="Specifications" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              label="Material"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="HDF, PVC, Bamboo"
            />
            <InputField
              label="Pattern"
              name="pattern"
              value={formData.pattern}
              onChange={handleChange}
              placeholder="Oak, Marble, Granite"
            />
            <InputField
              label="Finish"
              name="finish"
              value={formData.finish}
              onChange={handleChange}
              placeholder="Matte, Glossy, Textured"
            />
            <InputField
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Brown, Grey"
            />
            <InputField
              label="Thickness (mm)"
              type="number"
              name="thickness"
              value={formData.thickness}
              onChange={handleChange}
              placeholder="8"
            />
            <InputField
              label="Size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="48 × 8 inch"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <InputField
              label="Coverage Area"
              name="coverageArea"
              value={formData.coverageArea}
              onChange={handleChange}
              placeholder="20 sq ft"
            />
            <SelectField
              label="Color Variant"
              name="colorVariant"
              value={formData.colorVariant}
              onChange={handleChange}
              options={[
                { value: "", label: "None" },
                ...(colorVariants?.map((cv) => ({
                  value: cv._id,
                  label: `${cv.name} (${cv.hexCode})`,
                })) || []),
              ]}
            />
            <SelectField
              label="Pattern Variant"
              name="patternVariant"
              value={formData.patternVariant}
              onChange={handleChange}
              options={[
                { value: "", label: "None" },
                ...(patternVariants?.map((pv) => ({
                  value: pv._id,
                  label: pv.name,
                })) || []),
              ]}
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <TagInput
              label="Applications"
              selectedIds={formData.application}
              items={applications}
              onAdd={(id) =>
                setFormData((prev) => ({
                  ...prev,
                  application: [...new Set([...prev.application, id])],
                }))
              }
              onRemove={(id) =>
                setFormData((prev) => ({
                  ...prev,
                  application: prev.application.filter((aid) => aid !== id),
                }))
              }
              addButtonLabel="Add Application"
            />
          </div>
        </div>

        {/* SECTION 3: PRICING & INVENTORY */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <SectionHeader number="3" title="Pricing & Inventory" />

          {/* Sell By & SqFt */}
          <div className="pb-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <SelectField
                label="Sell By"
                required
                name="sellBy"
                value={formData.sellBy}
                onChange={handleChange}
                options={[
                  { value: "box", label: "Price / Box" },
                  { value: "roll", label: "Price / Roll" },
                  { value: "piece", label: "Price / Piece" },
                ]}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="showPerSqFtPrice"
                  checked={formData.showPerSqFtPrice}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">Show Per SqFt Price</span>
              </label>
            </div>

            {formData.showPerSqFtPrice && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                <InputField
                  label="Per SqFt Price (Retail)"
                  type="number"
                  name="perSqFtPriceRetail"
                  value={formData.perSqFtPriceRetail}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="22.50"
                />
                <InputField
                  label="Per SqFt Price (Enterprise)"
                  type="number"
                  name="perSqFtPriceEnterprise"
                  value={formData.perSqFtPriceEnterprise}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="18.50"
                />
              </div>
            )}
          </div>

          {/* Retail Pricing */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Retail Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Regular Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="retailPrice"
                    value={formData.retailPrice}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="retailDiscountPrice"
                    value={formData.retailDiscountPrice}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Pricing */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Enterprise Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Regular Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="enterprisePrice"
                    value={formData.enterprisePrice}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="enterpriseDiscountPrice"
                    value={formData.enterpriseDiscountPrice}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stock */}
          <InputField
            label="Stock Quantity"
            required
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            helperText="Update when inventory changes"
            placeholder="0"
          />
        </div>

        {/* SECTION 4: MEDIA & SEO */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <SectionHeader number="4" title="Media & SEO" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Images</label>
            <textarea
              name="images"
              value={formData.images}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 text-sm resize-none"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated URLs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Variant Group ID"
              name="variantGroupId"
              value={formData.variantGroupId}
              onChange={handleChange}
              placeholder="GROUP-12345"
            />
            <InputField
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              helperText="Comma-separated for searchability"
              placeholder="premium, eco-friendly, modern"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-orange-500 rounded cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">Mark as Featured Product</span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 sticky bottom-0 bg-white p-4 rounded-lg shadow border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-semibold transition-colors disabled:opacity-50 text-sm"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}