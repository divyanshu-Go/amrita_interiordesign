"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createColorVariant, updateColorVariant } from "@/lib/fetchers/colorVariants";
import { createPatternVariant, updatePatternVariant } from "@/lib/fetchers/patternVariants";
import { Save, X, Loader } from "lucide-react";

// Input Field Component
const InputField = ({ label, required, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none transition-colors ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
          : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      }`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

// Textarea Component
const TextareaField = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <textarea
      {...props}
      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none transition-colors resize-none ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
          : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      }`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

// Color Picker Component
const ColorPickerField = ({ label, required, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-16 h-10 border-2 border-gray-300 rounded-md cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none transition-colors ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        }`}
        placeholder="#FF5733"
      />
      {value && (
        <div
          className="w-12 h-10 rounded-md border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: value }}
          title={value}
        />
      )}
    </div>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    <p className="text-xs text-gray-500 mt-1">Use the color picker or enter hex code</p>
  </div>
);

export default function VariantForm({ variant = null, type = "color" }) {
  const router = useRouter();
  const isEdit = !!variant;
  const typeLabel = type === "color" ? "Color" : "Pattern";

  const [form, setForm] = useState({
    name: variant?.name || "",
    hexCode: variant?.hexCode || "",
    description: variant?.description || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = `${typeLabel} name is required`;
    }

    if (type === "color") {
      if (!form.hexCode) {
        newErrors.hexCode = "Color is required";
      } else if (!/^#[0-9A-F]{6}$/i.test(form.hexCode)) {
        newErrors.hexCode = "Enter a valid hex color code (e.g., #FF5733)";
      }
    } else {
      // Pattern variant
      if (!form.hexCode.trim()) {
        newErrors.hexCode = "Pattern code is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleColorChange = (value) => {
    setForm((prev) => ({ ...prev, hexCode: value }));
    if (errors.hexCode) {
      setErrors((prev) => ({ ...prev, hexCode: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (type === "color") {
        if (isEdit) {
          await updateColorVariant(variant._id, form);
        } else {
          await createColorVariant(form);
        }
      } else {
        if (isEdit) {
          await updatePatternVariant(variant._id, form);
        } else {
          await createPatternVariant(form);
        }
      }

      router.push("/admin/variants");
      router.refresh();
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong" });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-5">
        {/* Name */}
        <InputField
          label={`${typeLabel} Name`}
          required
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder={type === "color" ? "e.g., Sky Blue" : "e.g., Wood Oak"}
        />

        {/* Hex Code or Pattern Code */}
        {type === "color" ? (
          <ColorPickerField
            label="Select Color"
            required
            value={form.hexCode}
            onChange={handleColorChange}
            error={errors.hexCode}
          />
        ) : (
          <InputField
            label="Pattern Code"
            required
            type="text"
            name="hexCode"
            value={form.hexCode}
            onChange={handleChange}
            error={errors.hexCode}
            placeholder="e.g., WOOD-OAK-001 or pattern identifier"
          />
        )}

        {/* Description */}
        <TextareaField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          error={errors.description}
          rows={3}
          placeholder="Brief description of this variant"
        />

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-md font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEdit ? `Update ${typeLabel}` : `Create ${typeLabel}`}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold text-sm disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}