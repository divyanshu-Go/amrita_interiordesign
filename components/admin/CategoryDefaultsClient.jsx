"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCategoryDefaults } from "@/lib/fetchers/categoryDefaults";
import { PRODUCT_ATTRIBUTES } from "@/config/productAttributes";
import {
  SectionHeader,
  InputField,
  SelectField,
  ControlledMultiSelect,
} from "./ProductFormControls";

const EMPTY_DEFAULTS = {
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

export default function CategoryDefaultsClient({ categories, applications = [] }) {
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!selected) return;
    getCategoryDefaults(selected._id).then((data) => {
      setFormData({
        ...EMPTY_DEFAULTS,
        brand: data?.brand ?? "",
        description: data?.description ?? "",
        retailPrice: data?.retailPrice ?? 0,
        retailDiscountPrice: data?.retailDiscountPrice ?? "",
        enterprisePrice: data?.enterprisePrice ?? 0,
        enterpriseDiscountPrice: data?.enterpriseDiscountPrice ?? "",
        stock: data?.stock ?? 0,
        thickness: data?.thickness ?? "",
        size: data?.size ?? "",
        sellBy: data?.sellBy ?? "piece",
        showPerSqFtPrice: data?.showPerSqFtPrice ?? false,
        perSqFtPriceRetail: data?.perSqFtPriceRetail ?? "",
        perSqFtPriceEnterprise: data?.perSqFtPriceEnterprise ?? "",
        material: Array.isArray(data?.material) ? data.material : [],
        pattern: Array.isArray(data?.pattern) ? data.pattern : [],
        finish: Array.isArray(data?.finish) ? data.finish : [],
        coverageArea: data?.coverageArea ?? "",
        subType: data?.subType ?? "",
        isFeatured: data?.isFeatured ?? false,
        isPopular: data?.isPopular ?? false,
        application: data?.application?.map((a) => a._id || a) || [],
      });
    });
  }, [selected]);

  const handleArrayToggle = (fieldName, option) => {
    setFormData((prev) => {
      const current = prev[fieldName] || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [fieldName]: updated };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSavedMsg("");

    // Price Validation Checks
    const retail = Number(formData.retailPrice);
    const retailDisc = formData.retailDiscountPrice ? Number(formData.retailDiscountPrice) : null;
    const enterprise = Number(formData.enterprisePrice);
    const enterpriseDisc = formData.enterpriseDiscountPrice ? Number(formData.enterpriseDiscountPrice) : null;

    if (retailDisc !== null && retailDisc > retail) {
      setErrorMsg("Retail Discount Price cannot be greater than Regular Retail Price.");
      return;
    }

    if (enterpriseDisc !== null && enterpriseDisc > enterprise) {
      setErrorMsg("Enterprise Discount Price cannot be greater than Regular Enterprise Price.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/category-defaults/${selected._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          thickness: formData.thickness ? Number(formData.thickness) : null,
          subType: formData.subType || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update category defaults");

      setSavedMsg("Saved successfully!");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!selected) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelected(cat)}
            className="bg-white rounded-lg shadow-xs hover:shadow-md transition p-4 text-left border border-gray-200 hover:border-orange-400 cursor-pointer"
          >
            <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100 mb-3">
              {cat.image && <Image src={cat.image} alt={cat.name} fill className="object-cover" />}
            </div>
            <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
          </button>
        ))}
      </div>
    );
  }

  if (!formData) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="w-full">
      <button
        onClick={() => {
          setSelected(null);
          setSavedMsg("");
          setErrorMsg("");
        }}
        className="text-sm text-gray-600 hover:text-orange-600 mb-4 font-medium cursor-pointer"
      >
        ← Back to categories
      </button>
      <h2 className="text-xl font-bold text-gray-900 mb-6">{selected.name} — Defaults</h2>

      {savedMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
          {savedMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white rounded-lg shadow-xs p-6 space-y-4">
          <SectionHeader number="1" title="Basic Information" />
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition text-sm resize-none"
            />
          </div>
        </div>

        {/* SECTION 2: SPECIFICATIONS */}
        <div className="bg-white rounded-lg shadow-xs p-6 space-y-4">
          <SectionHeader number="2" title="Specifications" />

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

          {selected.slug === "marble-sheet" && (
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
        </div>

        {/* SECTION 3: PRICING & INVENTORY */}
        <div className="bg-white rounded-lg shadow-xs p-6 space-y-4">
          <SectionHeader number="3" title="Pricing & Inventory" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <label className="flex items-center gap-2 pt-2">
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

        <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow-xs border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-semibold disabled:opacity-50 text-sm cursor-pointer"
          >
            {saving ? "Saving..." : "Save Defaults"}
          </button>
        </div>
      </div>
    </div>
  );
}