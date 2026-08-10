// components/admin/ProductFormControls.jsx

"use client";

import { useState } from "react";
import { PRODUCT_ATTRIBUTES } from "@/config/productAttributes";

// Section Header
export const SectionHeader = ({ number, title }) => (
  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
    <span className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
      {number}
    </span>
    {title}
  </h2>
);

// Input Field (with CSS to remove number spinners)
export const InputField = ({
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
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
    {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
  </div>
);

// Select Field
export const SelectField = ({ label, required, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm bg-white"
    >
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Color Swatch Multi-Select Selector
export const ColorSwatchSelector = ({ label, selectedHexes = [], onToggle }) => {
  // Ensure selection is a flat array of strings
  const currentSelection = (
    Array.isArray(selectedHexes) ? selectedHexes.flat() : [selectedHexes]
  ).filter((item) => typeof item === "string");

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {currentSelection.length > 0 && (
          <span className="ml-2 text-xs text-gray-500 font-normal">
            ({currentSelection.length} selected)
          </span>
        )}
      </label>
      <div className="flex flex-wrap gap-2.5 items-center p-2.5 border border-gray-300 rounded-md bg-gray-50 min-h-11">
        {PRODUCT_ATTRIBUTES.COLORS.map((color) => {
          const isSelected = currentSelection.some(
            (hex) => typeof hex === "string" && hex.toLowerCase() === color.hex.toLowerCase()
          );
          return (
            <button
              key={color.hex}
              type="button"
              title={`${color.label} (${color.hex})`}
              onClick={() => onToggle(color.hex)}
              className={`w-7 h-7 rounded-full border border-gray-300 transition-all flex items-center justify-center cursor-pointer ${
                isSelected
                  ? "ring-2 ring-orange-500 ring-offset-2 scale-110 shadow-sm"
                  : "hover:scale-105 opacity-90 hover:opacity-100"
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {isSelected && (
                <span
                  className={`text-xs font-bold ${
                    color.hex.toLowerCase() === "#ffffff" ||
                    color.hex.toLowerCase() === "#f5f5dc"
                      ? "text-gray-900"
                      : "text-white"
                  }`}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Generic Controlled Multi-Select Pill Input Component
export const ControlledMultiSelect = ({
  label,
  options = [],
  selectedValues = [],
  onToggle,
  valueKey = null,
  labelKey = null,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-md bg-gray-50 min-h-11 max-h-48 overflow-y-auto">
      {options.map((opt) => {
        const val = valueKey ? opt[valueKey] : opt;
        const displayLabel = labelKey ? opt[labelKey] : opt;
        const isSelected = selectedValues.includes(val);

        return (
          <button
            key={val}
            type="button"
            onClick={() => onToggle(val)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              isSelected
                ? "bg-orange-500 text-white shadow-xs"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {isSelected ? `✓ ${displayLabel}` : `+ ${displayLabel}`}
          </button>
        );
      })}
    </div>
  </div>
);