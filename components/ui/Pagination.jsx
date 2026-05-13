// components/customer/Pagination.js
//
// Simple, accessible pagination component.
// Parent controls all state — this just renders buttons and calls onPageChange.
// Shows: First, Prev, page numbers (windowed), Next, Last.

"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build page number window: always show first, last, current ±2
  const getPages = () => {
    const pages = new Set();
    pages.add(1);
    pages.add(totalPages);
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i >= 1 && i <= totalPages) pages.add(i);
    }
    // Sort and insert ellipsis markers
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        result.push("...");
      }
      result.push(sorted[i]);
    }
    return result;
  };

  const pages = getPages();

  const btnBase =
    "inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300";
  const btnActive = "bg-orange-500 text-white";
  const btnInactive = "bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200";
  const btnDisabled = "bg-white text-gray-300 border border-gray-100 cursor-not-allowed";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 flex-wrap"
    >
      {/* First */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
        aria-label="First page"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>

      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 text-xs text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${
              page === currentPage ? btnActive : btnInactive
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${
          currentPage === totalPages ? btnDisabled : btnInactive
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Last */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${
          currentPage === totalPages ? btnDisabled : btnInactive
        }`}
        aria-label="Last page"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </nav>
  );
}