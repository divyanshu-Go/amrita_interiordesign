"use client"

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
// Auth Button
export const AuthButton = ({ children, isLoading }) => (
  <button
    className="mt-3 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
    disabled={isLoading}
  >
    {isLoading ? (
      <div className="flex items-center justify-center text-sm">
        Please wait
        <LoaderCircle className="animate-spin ml-2 h-4 w-4" />
      </div>
    ) : (
      children
    )}
  </button>
);

// Input field with password toggle and validation
export const FormInput = ({ label, type, value, onChange, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="text-sm space-y-1">
      <div className="flex justify-between items-center">
        <label className="font-medium">{label}</label>
        {error && (
          <span className="text-red-500 text-xs bg-red-100 px-2 py-1 rounded">
            {error}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type={isPassword && !showPassword ? "password" : "text"}
          value={value}
          onChange={onChange}
          className={`w-full border px-3 py-2 rounded text-sm ${
            error ? "border-red-400" : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-orange-500`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};
