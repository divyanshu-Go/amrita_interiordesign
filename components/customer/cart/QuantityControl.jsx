// account/sections/cart/QuantityControl.jsx
"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantityControl({
  quantity,
  onChange,
  disabled = false,
}) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    onChange(quantity + 1);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Decrease Button */}
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= 1}
        aria-label="Decrease quantity"
        className="flex items-center justify-center w-9 h-9 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
      >
        <Minus size={16} />
      </button>

      {/* Quantity Display */}
      <span className="flex-1 text-center text-sm font-semibold text-gray-900 w-12">
        {quantity}
      </span>

      {/* Increase Button */}
      <button
        onClick={handleIncrease}
        disabled={disabled}
        aria-label="Increase quantity"
        className="flex items-center justify-center w-9 h-9 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}