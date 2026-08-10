// components/admin/ProductForm.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/fetchers/products";
import MultiImageUpload from "./MultiImageUpload";
import { PRODUCT_ATTRIBUTES } from "@/config/productAttributes";
import {
  SectionHeader,
  InputField,
  SelectField,
  ColorSwatchSelector,
  ControlledMultiSelect,
} from "./ProductFormControls";

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
    images: product?.images || [],
    retailPrice: product?.retailPrice || "",
    retailDiscountPrice: product?.retailDiscountPrice || "",
    enterprisePrice: product?.enterprisePrice || "",
    enterpriseDiscountPrice: product?.enterpriseDiscountPrice || "",
    stock: product?.stock || 0,
    color: Array.isArray(product?.color)
      ? product.color
      : product?.color
        ? [product.color]
        : [], thickness: product?.thickness || "",
    size: product?.size || "",
    tags: product?.tags?.join(", ") || "",
    isFeatured: product?.isFeatured || false,
    isPopular: product?.isPopular || false,
    colorVariant: product?.colorVariant || "",
    patternVariant: product?.patternVariant || "",
    sellBy: product?.sellBy || "box",
    showPerSqFtPrice: product?.showPerSqFtPrice || false,
    perSqFtPriceRetail: product?.perSqFtPriceRetail || "",
    perSqFtPriceEnterprise: product?.perSqFtPriceEnterprise || "",
    material: Array.isArray(product?.material) ? product.material : [],
    pattern: Array.isArray(product?.pattern) ? product.pattern : [],
    finish: Array.isArray(product?.finish) ? product.finish : [],
    application: Array.isArray(product?.application)
      ? product.application.map((a) => a._id || a)
      : [],
    coverageArea: product?.coverageArea || "",
    subType: product?.subType || "",
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

  const handleArrayToggle = (fieldName, option) => {
    setFormData((prev) => {
      const current = prev[fieldName] || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [fieldName]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Price Validation Check
    const retail = Number(formData.retailPrice);
    const retailDisc = formData.retailDiscountPrice
      ? Number(formData.retailDiscountPrice)
      : null;
    const enterprise = Number(formData.enterprisePrice);
    const enterpriseDisc = formData.enterpriseDiscountPrice
      ? Number(formData.enterpriseDiscountPrice)
      : null;

    if (retailDisc !== null && retailDisc > retail) {
      setError("Retail Discount Price cannot be greater than Regular Retail Price.");
      return;
    }

    if (enterpriseDisc !== null && enterpriseDisc > enterprise) {
      setError("Enterprise Discount Price cannot be greater than Regular Enterprise Price.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        color: formData.color, 
        images: formData.images,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        retailPrice: retail,
        retailDiscountPrice: retailDisc ?? undefined,
        enterprisePrice: enterprise,
        enterpriseDiscountPrice: enterpriseDisc ?? undefined,
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
        material: formData.material,
        pattern: formData.pattern,
        finish: formData.finish,
        coverageArea: formData.coverageArea,
        application: formData.application,
        category: formData.category,
        subType: formData.subType || null,
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
            <SelectField
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Brand" },
                ...PRODUCT_ATTRIBUTES.BRANDS.map((b) => ({ value: b, label: b })),
              ]}
            />
            </div>

            <div>
            <ControlledMultiSelect
              label="Categories"
              options={categories}
              valueKey="_id"
              labelKey="name"
              selectedValues={formData.category}
              onToggle={(id) => handleArrayToggle("category", id)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
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

          <ColorSwatchSelector
            label="Color"
            selectedHexes={formData.color}
            onToggle={(hex) => handleArrayToggle("color", hex)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Thickness (mm)"
              name="thickness"
              value={formData.thickness}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Thickness" },
                ...PRODUCT_ATTRIBUTES.THICKNESSES.map((t) => ({
                  value: t,
                  label: `${t} mm`,
                })),
              ]}
            />
            <SelectField
              label="Size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Size" },
                ...PRODUCT_ATTRIBUTES.SIZES.map((s) => ({ value: s, label: s })),
              ]}
            />
          </div>

          <div className="space-y-4 pt-2">
            <ControlledMultiSelect
              label="Material"
              options={PRODUCT_ATTRIBUTES.MATERIALS}
              selectedValues={formData.material}
              onToggle={(opt) => handleArrayToggle("material", opt)}
            />
            <ControlledMultiSelect
              label="Pattern"
              options={PRODUCT_ATTRIBUTES.PATTERNS}
              selectedValues={formData.pattern}
              onToggle={(opt) => handleArrayToggle("pattern", opt)}
            />
            <ControlledMultiSelect
              label="Finish"
              options={PRODUCT_ATTRIBUTES.FINISHES}
              selectedValues={formData.finish}
              onToggle={(opt) => handleArrayToggle("finish", opt)}
            />
            <ControlledMultiSelect
              label="Applications"
              options={applications}
              valueKey="_id"
              labelKey="name"
              selectedValues={formData.application}
              onToggle={(id) => handleArrayToggle("application", id)}
            />
          </div>

          {/* Sub-type — only shown when marble-sheet category is selected */}
          {formData.category.some((id) =>
            categories.find((c) => c._id === id && c.slug === "marble-sheet")
          ) && (
              <div className="pt-4 border-t border-gray-200">
                <SelectField
                  label="Sub Type"
                  required
                  name="subType"
                  value={formData.subType}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select sub-type" },
                    { value: "self-adhesive", label: "Self Adhesive" },
                    { value: "non-adhesive", label: "Non Adhesive" },
                  ]}
                />
              </div>
            )}

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
        </div>

        {/* SECTION 3: PRICING & INVENTORY */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <SectionHeader number="3" title="Pricing & Inventory" />

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
                <span className="text-sm font-medium text-gray-700">
                  Show Per SqFt Price
                </span>
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

          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Retail Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Regular Price"
                required
                type="number"
                name="retailPrice"
                value={formData.retailPrice}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
              />
              <InputField
                label="Discount Price"
                type="number"
                name="retailDiscountPrice"
                value={formData.retailDiscountPrice}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Enterprise Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Regular Price"
                required
                type="number"
                name="enterprisePrice"
                value={formData.enterprisePrice}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
              />
              <InputField
                label="Discount Price"
                type="number"
                name="enterpriseDiscountPrice"
                value={formData.enterpriseDiscountPrice}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Images
            </label>
            <MultiImageUpload
              values={formData.images}
              onChange={(urls) =>
                setFormData((prev) => ({ ...prev, images: urls }))
              }
            />
          </div>

          <InputField
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            helperText="Comma-separated for searchability"
            placeholder="premium, eco-friendly, modern"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-orange-500 rounded cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">
              Mark as Featured Product
            </span>
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isPopular"
              checked={formData.isPopular}
              onChange={handleChange}
              className="w-4 h-4 text-orange-500 rounded cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">
              Mark as Popular Product
            </span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 sticky bottom-0 bg-white p-4 rounded-lg shadow border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-semibold transition-colors disabled:opacity-50 text-sm cursor-pointer"
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
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}