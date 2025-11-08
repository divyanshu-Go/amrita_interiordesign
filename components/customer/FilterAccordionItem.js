"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FilterAccordionItem({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left hover:text-orange-600 transition-colors"
      >
        <span className="font-semibold text-sm text-gray-900">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
}