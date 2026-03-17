// components/PincodeChecker.jsx
"use client";

import { useState } from "react";
import { MapPin, X, CheckCircle2, XCircle } from "lucide-react";

// Delhi NCR delivery prefixes
const DELIVERY_PREFIXES = [
  { prefix: "110", label: "Delhi" },
  { prefix: "201", label: "Noida" },
  { prefix: "122", label: "Gurgaon" },
];

function checkDelivery(pincode) {
  if (pincode.length !== 6) return null;
  const match = DELIVERY_PREFIXES.find((d) => pincode.startsWith(d.prefix));
  return match ? { available: true, region: match.label } : { available: false };
}

export default function PincodeChecker({ pincode, onPincodeChange, onClose }) {
  const [input, setInput] = useState(pincode || "");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setInput(val);
    // Auto-check once 6 digits are entered
    if (val.length === 6) {
      setResult(checkDelivery(val));
    } else {
      setResult(null);
    }
  };

  const handleApply = () => {
    if (!result || !result.available) return;
    onPincodeChange(input);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 z-40"
        onClick={onClose}
      />

      {/* Popover */}
      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Check Delivery
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          We currently deliver to <span className="font-medium text-gray-700">Delhi, Noida & Gurgaon</span>. Enter your pincode to check.
        </p>

        {/* Input */}
        <div className="relative mb-3">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Enter 6-digit pincode"
            maxLength={6}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all pr-10 tracking-widest font-mono"
            autoFocus
          />
          {input.length === 6 && result && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {result.available
                ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                : <XCircle className="w-4 h-4 text-red-400" />
              }
            </span>
          )}
        </div>

        {/* Result message */}
        {result && (
          <div
            className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2.5 mb-3 ${
              result.available
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}
          >
            {result.available ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>Delivery available in your area ✅ ({result.region})</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>Sorry, we do not deliver to this location ❌</span>
              </>
            )}
          </div>
        )}

        {/* Apply button — only enabled if delivery is available */}
        <button
          onClick={handleApply}
          disabled={!result?.available}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          {result?.available ? `Deliver to ${input}` : "Apply"}
        </button>

        {/* Current pincode */}
        {pincode && (
          <p className="text-xs text-gray-400 text-center mt-3">
            Current: <span className="font-mono font-medium text-gray-600">{pincode}</span>
          </p>
        )}
      </div>
    </>
  );
}