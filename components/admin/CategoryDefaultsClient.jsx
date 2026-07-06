// components/admin/CategoryDefaultsClient.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCategoryDefaults } from "@/lib/fetchers/categoryDefaults";

const SectionHeader = ({ number, title }) => (
  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
    <span className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
      {number}
    </span>
    {title}
  </h2>
);

const InputField = ({ label, required, type = "text", ...props }) => (
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
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const TagInput = ({ label, selectedIds, items, onAdd, onRemove, addButtonLabel }) => {
  const [showSelect, setShowSelect] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
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
  material: "",
  pattern: "",
  finish: "",
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
      material: Array.isArray(data?.material) ? data.material.join(", ") : "",
      pattern: Array.isArray(data?.pattern) ? data.pattern.join(", ") : "",
      finish: Array.isArray(data?.finish) ? data.finish.join(", ") : "",
      coverageArea: data?.coverageArea ?? "",
      subType: data?.subType ?? "",
      isFeatured: data?.isFeatured ?? false,
      isPopular: data?.isPopular ?? false,
      application: data?.application?.map((a) => a._id || a) || [],
    });
  });
}, [selected]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    const payload = {
      ...formData,
      material: formData.material.split(",").map((x) => x.trim()).filter(Boolean),
      pattern: formData.pattern.split(",").map((x) => x.trim()).filter(Boolean),
      finish: formData.finish.split(",").map((x) => x.trim()).filter(Boolean),
    };
    await fetch(`/api/category-defaults/${selected._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSavedMsg("Saved!");
  };

  if (!selected) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelected(cat)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 text-left border border-gray-200 hover:border-orange-400 cursor-pointer"
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
      <button onClick={() => setSelected(null)} className="text-sm text-gray-600 hover:text-orange-600 mb-4 font-medium cursor-pointer">
        ← Back to categories
      </button>
      <h2 className="text-xl font-bold text-gray-900 mb-6">{selected.name} — Defaults</h2>

      {savedMsg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">{savedMsg}</div>}

      <div className="space-y-6">
        {/* SECTION 1: BASIC */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <SectionHeader number="1" title="Basic Information" />
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
        </div>

        {/* SECTION 2: SPECIFICATIONS */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <SectionHeader number="2" title="Specifications" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField label="Material" name="material" value={formData.material} onChange={handleChange} placeholder="HDF, PVC, Bamboo" />
            <InputField label="Pattern" name="pattern" value={formData.pattern} onChange={handleChange} placeholder="Oak, Marble, Granite" />
            <InputField label="Finish" name="finish" value={formData.finish} onChange={handleChange} placeholder="Matte, Glossy" />
            <InputField label="Thickness (mm)" type="number" name="thickness" value={formData.thickness} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
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
        </div>

        {/* SECTION 3: PRICING & INVENTORY */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <SectionHeader number="3" title="Pricing & Inventory" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputField label="Retail Price" required type="number" name="retailPrice" value={formData.retailPrice} onChange={handleChange} step="0.01" />
            <InputField label="Retail Discount Price" type="number" name="retailDiscountPrice" value={formData.retailDiscountPrice} onChange={handleChange} step="0.01" />
            <InputField label="Enterprise Price" required type="number" name="enterprisePrice" value={formData.enterprisePrice} onChange={handleChange} step="0.01" />
            <InputField label="Enterprise Discount Price" type="number" name="enterpriseDiscountPrice" value={formData.enterpriseDiscountPrice} onChange={handleChange} step="0.01" />
          </div>
          <InputField label="Stock" required type="number" name="stock" value={formData.stock} onChange={handleChange} />
          <label className="flex items-center gap-2 pt-2">
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

        <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-semibold disabled:opacity-50 text-sm"
          >
            {saving ? "Saving..." : "Save Defaults"}
          </button>
        </div>
      </div>
    </div>
  );
}