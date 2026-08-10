"use client";

import { useState, useEffect } from "react";
import { createProduct } from "@/lib/fetchers/products";
import { getCategoryDefaults } from "@/lib/fetchers/categoryDefaults";
import MultiImageUpload from "./MultiImageUpload";
import { PRODUCT_ATTRIBUTES } from "@/config/productAttributes";
import {
  SectionHeader,
  InputField,
  SelectField,
  ColorSwatchSelector,
  ControlledMultiSelect,
} from "./ProductFormControls";

// Field group definitions
const VARIABLE_DEFAULTS = {
  name: "",
  slug: "",
  sku: "",
  color: [],
  colorVariant: "",
  patternVariant: "",
  images: [],
};

const NON_VARIABLE_FALLBACK = {
  brand: "",
  description: "",
  retailPrice: 0,
  retailDiscountPrice: "",
  enterprisePrice: 0,
  enterpriseDiscountPrice: "",
  stock: 0,
  thickness: "",
  size: "",
  sellBy: "piece",
  showPerSqFtPrice: false,
  perSqFtPriceRetail: "",
  perSqFtPriceEnterprise: "",
  material: [],
  pattern: [],
  finish: [],
  coverageArea: "",
  application: [],
  subType: "",
  isFeatured: false,
  isPopular: false,
};

export default function QuickAddProductForm({
  category,
  colorVariants = [],
  patternVariants = [],
  applications = [],
}) {
  const [formData, setFormData] = useState(null);
  const [isVariableOpen, setIsVariableOpen] = useState(true);
  const [isNonVariableOpen, setIsNonVariableOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadDefaults() {
      const saved = await getCategoryDefaults(category._id).catch(() => null);
      if (cancelled) return;

      setFormData({
        ...VARIABLE_DEFAULTS,
        ...NON_VARIABLE_FALLBACK,
        brand: saved?.brand ?? NON_VARIABLE_FALLBACK.brand,
        description: saved?.description ?? NON_VARIABLE_FALLBACK.description,
        retailPrice: saved?.retailPrice ?? NON_VARIABLE_FALLBACK.retailPrice,
        retailDiscountPrice: saved?.retailDiscountPrice ?? "",
        enterprisePrice: saved?.enterprisePrice ?? NON_VARIABLE_FALLBACK.enterprisePrice,
        enterpriseDiscountPrice: saved?.enterpriseDiscountPrice ?? "",
        stock: saved?.stock ?? NON_VARIABLE_FALLBACK.stock,
        thickness: saved?.thickness ?? "",
        size: saved?.size ?? "",
        sellBy: saved?.sellBy ?? NON_VARIABLE_FALLBACK.sellBy,
        showPerSqFtPrice: saved?.showPerSqFtPrice ?? false,
        perSqFtPriceRetail: saved?.perSqFtPriceRetail ?? "",
        perSqFtPriceEnterprise: saved?.perSqFtPriceEnterprise ?? "",
        material: Array.isArray(saved?.material) ? saved.material : [],
        pattern: Array.isArray(saved?.pattern) ? saved.pattern : [],
        finish: Array.isArray(saved?.finish) ? saved.finish : [],
        coverageArea: saved?.coverageArea ?? "",
        subType: saved?.subType ?? "",
        isFeatured: saved?.isFeatured ?? false,
        isPopular: saved?.isPopular ?? false,
        application: saved?.application?.map((a) => a._id || a) || [],
      });
    }
    loadDefaults();
    return () => {
      cancelled = true;
    };
  }, [category._id]);

  if (!formData) {
    return <p className="text-sm text-gray-500">Loading category defaults...</p>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (name === "name") {
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
    setSuccessMsg("");

    // Price Validation Checks
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
        category: [category._id],
        retailPrice: retail,
        retailDiscountPrice: retailDisc ?? undefined,
        enterprisePrice: enterprise,
        enterpriseDiscountPrice: enterpriseDisc ?? undefined,
        stock: Number(formData.stock),
        thickness: formData.thickness ? Number(formData.thickness) : undefined,
        perSqFtPriceRetail: formData.perSqFtPriceRetail
          ? Number(formData.perSqFtPriceRetail)
          : undefined,
        perSqFtPriceEnterprise: formData.perSqFtPriceEnterprise
          ? Number(formData.perSqFtPriceEnterprise)
          : undefined,
        color: formData.color,
        material: formData.material,
        pattern: formData.pattern,
        finish: formData.finish,
        application: formData.application,
        colorVariant: formData.colorVariant || null,
        patternVariant: formData.patternVariant || null,
        subType: formData.subType || null,
      };

      await createProduct(payload);

      // Reset variable fields for fast consecutive additions while preserving category defaults
      setFormData((prev) => ({ ...prev, ...VARIABLE_DEFAULTS }));
      setSuccessMsg("Product added successfully. Ready for the next one.");
      setIsVariableOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-gray-500">
          Category: <span className="font-semibold text-gray-800">{category.name}</span>
        </p>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium text-sm">Error</p>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{successMsg}</p>
          </div>
        )}

        {/* VARIABLE SECTION */}
        <div className="bg-white rounded-lg shadow-xs border border-gray-200">
          <button
            type="button"
            onClick={() => setIsVariableOpen((o) => !o)}
            className="w-full flex items-center justify-between p-6 pb-0 text-left cursor-pointer"
          >
            <SectionHeader number="1" title="Variable Details (changes every product)" />
            <span className="text-gray-500 text-lg font-bold">{isVariableOpen ? "−" : "+"}</span>
          </button>

          {isVariableOpen && (
            <div className="px-6 pb-6 space-y-4">
              <InputField
                label="Product Name"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Premium Oak Wood Flooring - 8mm"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Slug"
                  required
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  helperText="Auto-generated, editable"
                />
                <InputField
                  label="SKU"
                  required
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="SKU-001234"
                />
              </div>

              {/* Color Swatches */}
              <ColorSwatchSelector
                label="Color"
                selectedHexes={formData.color}
                onToggle={(hex) => handleArrayToggle("color", hex)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Color Variant"
                  name="colorVariant"
                  value={formData.colorVariant}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "None" },
                    ...colorVariants.map((cv) => ({ value: cv._id, label: cv.name })),
                  ]}
                />
                <SelectField
                  label="Pattern Variant"
                  name="patternVariant"
                  value={formData.patternVariant}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "None" },
                    ...patternVariants.map((pv) => ({ value: pv._id, label: pv.name })),
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Images
                </label>
                <MultiImageUpload
                  values={formData.images}
                  onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                />
              </div>
            </div>
          )}
        </div>

        {/* NON-VARIABLE SECTION */}
        <div className="bg-white rounded-lg shadow-xs border border-gray-200">
          <button
            type="button"
            onClick={() => setIsNonVariableOpen((o) => !o)}
            className="w-full flex items-center justify-between p-6 pb-0 text-left cursor-pointer"
          >
            <SectionHeader
              number="2"
              title="Non-Variable Details (usually same for this category)"
            />
            <span className="text-gray-500 text-lg font-bold">
              {isNonVariableOpen ? "−" : "+"}
            </span>
          </button>

          {isNonVariableOpen && (
            <div className="px-6 pb-6 space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition text-sm resize-none"
                />
              </div>

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
                <InputField
                  label="Coverage Area"
                  name="coverageArea"
                  value={formData.coverageArea}
                  onChange={handleChange}
                  placeholder="20 sq ft"
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

              <div className="pt-4 border-t border-gray-200">
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
              </div>

              {category.slug === "marble-sheet" && (
                <div className="pt-4 border-t border-gray-200">
                  <SelectField
                    label="Sub Type"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <InputField
                  label="Retail Price"
                  required
                  type="number"
                  name="retailPrice"
                  value={formData.retailPrice}
                  onChange={handleChange}
                  step="0.01"
                />
                <InputField
                  label="Retail Discount Price"
                  type="number"
                  name="retailDiscountPrice"
                  value={formData.retailDiscountPrice}
                  onChange={handleChange}
                  step="0.01"
                />
                <InputField
                  label="Enterprise Price"
                  required
                  type="number"
                  name="enterprisePrice"
                  value={formData.enterprisePrice}
                  onChange={handleChange}
                  step="0.01"
                />
                <InputField
                  label="Enterprise Discount Price"
                  type="number"
                  name="enterpriseDiscountPrice"
                  value={formData.enterpriseDiscountPrice}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>

              <InputField
                label="Stock"
                required
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
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

              {formData.showPerSqFtPrice && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Per SqFt (Retail)"
                    type="number"
                    name="perSqFtPriceRetail"
                    value={formData.perSqFtPriceRetail}
                    onChange={handleChange}
                    step="0.01"
                  />
                  <InputField
                    label="Per SqFt (Enterprise)"
                    type="number"
                    name="perSqFtPriceEnterprise"
                    value={formData.perSqFtPriceEnterprise}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
              )}

              <div className="flex gap-6 pt-2 border-t border-gray-200">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-500 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-500 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Popular</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow-xs border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-semibold transition-colors disabled:opacity-50 text-sm cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Add Product & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}