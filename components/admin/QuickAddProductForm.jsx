// components/admin/QuickAddProductForm.jsx
"use client";

import { useState, useEffect } from "react";
import { createProduct } from "@/lib/fetchers/products";
import { getCategoryDefaults } from "@/lib/fetchers/categoryDefaults";
import MultiImageUpload from "./MultiImageUpload";

// ── Field components (mirrors ProductForm.jsx styling — kept local per your call) ──

const SectionHeader = ({ number, title }) => (
  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
    <span className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
      {number}
    </span>
    {title}
  </h2>
);

const InputField = ({ label, required, helperText, type = "text", ...props }) => (
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
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

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
              <div key={id} className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium">
                {item?.name || "Unknown"}
                <button type="button" onClick={() => onRemove(id)} className="ml-0.5 hover:text-orange-900 font-bold cursor-pointer">×</button>
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
          {items.filter((item) => !selectedIds.includes(item._id)).map((item) => (
            <option key={item._id} value={item._id}>{item.name}</option>
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

// ── Field group definitions ──

const VARIABLE_DEFAULTS = {
  name: "",
  slug: "",
  sku: "",
  color: "",
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
  material: "",
  pattern: "",
  finish: "",
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

    // Explicitly pick only real default fields — never spread `saved` directly,
    // it carries Mongo metadata (_id, category, createdAt, updatedAt, __v)
    // that must never reach the Product payload.
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
      material: Array.isArray(saved?.material) ? saved.material.join(", ") : "",
      pattern: Array.isArray(saved?.pattern) ? saved.pattern.join(", ") : "",
      finish: Array.isArray(saved?.finish) ? saved.finish.join(", ") : "",
      coverageArea: saved?.coverageArea ?? "",
      subType: saved?.subType ?? "",
      isFeatured: saved?.isFeatured ?? false,
      isPopular: saved?.isPopular ?? false,
      application: saved?.application?.map((a) => a._id || a) || [],
    });
  }
  loadDefaults();
  return () => { cancelled = true; };
}, [category._id]);

  if (!formData) {
    return <p className="text-sm text-gray-500">Loading category defaults...</p>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (name === "name") {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        category: [category._id],
        retailPrice: Number(formData.retailPrice),
        retailDiscountPrice: formData.retailDiscountPrice ? Number(formData.retailDiscountPrice) : undefined,
        enterprisePrice: Number(formData.enterprisePrice),
        enterpriseDiscountPrice: formData.enterpriseDiscountPrice ? Number(formData.enterpriseDiscountPrice) : undefined,
        stock: Number(formData.stock),
        thickness: formData.thickness ? Number(formData.thickness) : undefined,
        perSqFtPriceRetail: formData.perSqFtPriceRetail ? Number(formData.perSqFtPriceRetail) : undefined,
        perSqFtPriceEnterprise: formData.perSqFtPriceEnterprise ? Number(formData.perSqFtPriceEnterprise) : undefined,
        material: formData.material.split(",").map((x) => x.trim()).filter(Boolean),
        pattern: formData.pattern.split(",").map((x) => x.trim()).filter(Boolean),
        finish: formData.finish.split(",").map((x) => x.trim()).filter(Boolean),
        colorVariant: formData.colorVariant || null,
        patternVariant: formData.patternVariant || null,
        subType: formData.subType || null,
      };

      await createProduct(payload);

      setFormData((prev) => ({ ...prev, ...VARIABLE_DEFAULTS }));
      setSuccessMsg("Product added. Ready for the next one.");
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                <InputField label="Slug" required name="slug" value={formData.slug} onChange={handleChange} helperText="Auto-generated, editable" />
                <InputField label="SKU" required name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU-001234" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Color" name="color" value={formData.color} onChange={handleChange} placeholder="Brown, Grey" />
                <SelectField
                  label="Color Variant"
                  name="colorVariant"
                  value={formData.colorVariant}
                  onChange={handleChange}
                  options={[{ value: "", label: "None" }, ...colorVariants.map((cv) => ({ value: cv._id, label: cv.name }))]}
                />
                <SelectField
                  label="Pattern Variant"
                  name="patternVariant"
                  value={formData.patternVariant}
                  onChange={handleChange}
                  options={[{ value: "", label: "None" }, ...patternVariants.map((pv) => ({ value: pv._id, label: pv.name }))]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Images</label>
                <MultiImageUpload
                  values={formData.images}
                  onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                />
              </div>
            </div>
          )}
        </div>

        {/* NON-VARIABLE SECTION */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            type="button"
            onClick={() => setIsNonVariableOpen((o) => !o)}
            className="w-full flex items-center justify-between p-6 pb-0 text-left cursor-pointer"
          >
            <SectionHeader number="2" title="Non-Variable Details (usually same for this category)" />
            <span className="text-gray-500 text-lg font-bold">{isNonVariableOpen ? "−" : "+"}</span>
          </button>

          {isNonVariableOpen && (
            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
                <InputField label="Size" name="size" value={formData.size} onChange={handleChange} placeholder="48 × 8 inch" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <InputField label="Material" name="material" value={formData.material} onChange={handleChange} placeholder="HDF, PVC, Bamboo" />
                <InputField label="Pattern" name="pattern" value={formData.pattern} onChange={handleChange} placeholder="Oak, Marble, Granite" />
                <InputField label="Finish" name="finish" value={formData.finish} onChange={handleChange} placeholder="Matte, Glossy" />
                <InputField label="Thickness (mm)" type="number" name="thickness" value={formData.thickness} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Coverage Area" name="coverageArea" value={formData.coverageArea} onChange={handleChange} placeholder="20 sq ft" />
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
              )}

              <div className="pt-4 border-t border-gray-200">
                <TagInput
                  label="Applications"
                  selectedIds={formData.application}
                  items={applications}
                  onAdd={(id) => setFormData((prev) => ({ ...prev, application: [...new Set([...prev.application, id])] }))}
                  onRemove={(id) => setFormData((prev) => ({ ...prev, application: prev.application.filter((a) => a !== id) }))}
                  addButtonLabel="Add Application"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Retail Price *</label>
                  <input type="number" name="retailPrice" value={formData.retailPrice} onChange={handleChange} required step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Retail Discount Price</label>
                  <input type="number" name="retailDiscountPrice" value={formData.retailDiscountPrice} onChange={handleChange} step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Enterprise Price *</label>
                  <input type="number" name="enterprisePrice" value={formData.enterprisePrice} onChange={handleChange} required step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Enterprise Discount Price</label>
                  <input type="number" name="enterpriseDiscountPrice" value={formData.enterpriseDiscountPrice} onChange={handleChange} step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
              </div>

              <InputField label="Stock" required type="number" name="stock" value={formData.stock} onChange={handleChange} />

              <label className="flex items-center gap-2">
                <input type="checkbox" name="showPerSqFtPrice" checked={formData.showPerSqFtPrice} onChange={handleChange} className="w-4 h-4 text-orange-500 rounded cursor-pointer" />
                <span className="text-sm font-medium text-gray-700">Show Per SqFt Price</span>
              </label>
              {formData.showPerSqFtPrice && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Per SqFt (Retail)" type="number" name="perSqFtPriceRetail" value={formData.perSqFtPriceRetail} onChange={handleChange} step="0.01" />
                  <InputField label="Per SqFt (Enterprise)" type="number" name="perSqFtPriceEnterprise" value={formData.perSqFtPriceEnterprise} onChange={handleChange} step="0.01" />
                </div>
              )}

              <div className="flex gap-6 pt-2 border-t border-gray-200">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 text-orange-500 rounded cursor-pointer" />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleChange} className="w-4 h-4 text-orange-500 rounded cursor-pointer" />
                  <span className="text-sm font-medium text-gray-700">Popular</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-semibold transition-colors disabled:opacity-50 text-sm"
          >
            {isSubmitting ? "Saving..." : "Add Product & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}