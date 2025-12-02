"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createApplication, updateApplication } from "@/lib/fetchers/applications";
import { Save, X, Loader, Image as ImageIcon } from "lucide-react";

// Input Field Component
const InputField = ({
  label,
  required,
  helperText,
  error,
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
      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none transition-colors ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
          : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      }`}
    />
    {error ? (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    ) : (
      helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>
    )}
  </div>
);

// Textarea Component
const TextareaField = ({ label, helperText, error, ...props }) => (
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
    {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
  </div>
);

export default function ApplicationForm({ application = null }) {
  const router = useRouter();
  const isEdit = !!application;

  const [form, setForm] = useState({
    name: application?.name || "",
    image: application?.image || "",
    desc: application?.desc || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Application name is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isEdit) {
        await updateApplication(application._id, form);
      } else {
        await createApplication(form);
      }

      router.push("/admin/applications");
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
          label="Application Name"
          required
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g., Kitchen, Bathroom, Bedroom"
        />

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Image URL
          </label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
            placeholder="https://example.com/kitchen.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Optional - application image for listings</p>

          {/* Image Preview */}
          {form.image && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
              <img
                src={form.image}
                alt="Application preview"
                className="w-full h-40 object-contain rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <TextareaField
          label="Description"
          name="desc"
          value={form.desc}
          onChange={handleChange}
          rows={3}
          placeholder="Brief description of this application area"
          helperText="Optional - describes where this product can be applied"
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
              {isEdit ? "Update Application" : "Create Application"}
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