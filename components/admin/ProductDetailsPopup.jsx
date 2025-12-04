// components/admin/ProductDetailsPopup.js
"use client";

export default function ProductDetailsPopup({ product, isOpen }) {
  // Helper to show value or "-"
  const showOrDash = (val) => {
    if (
      val === null ||
      val === undefined ||
      val === "" ||
      (Array.isArray(val) && val.length === 0)
    ) {
      return "-";
    }
    return val;
  };

  const money = (num) =>
    typeof num === "number" ? `₹${num.toLocaleString("en-IN")}` : "-";

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } absolute right-0 top-6 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg p-3 text-sm z-50`}
    >
      <div className="space-y-1 text-gray-700">
        <Item label="Color" value={showOrDash(product.color)} />
        <Item label="Thickness" value={showOrDash(product.thickness)} />
        <Item label="Size" value={showOrDash(product.size)} />

        <Item
          label="Color Variant"
          value={showOrDash(product.colorVariant?.name)}
        />

        <Item
          label="Pattern Variant"
          value={showOrDash(product.patternVariant?.name)}
        />
        <Item label="Retail Price" value={money(product.retailPrice)} />
        <Item label="Enterprise Price" value={money(product.enterprisePrice)} />
        <Item label="Sell By" value={showOrDash(product.sellBy)} />
        <Item
          label="Show Per Sq Ft"
          value={product.showPerSqFtPrice ? "Yes" : "No"}
        />
        <Item
          label="Applications"
          value={
            Array.isArray(product.application) && product.application.length
              ? product.application.map((a) => a.name).join(", ")
              : "-"
          }
        />

        <Item
          label="Tags"
          value={
            Array.isArray(product.tags) && product.tags.length
              ? product.tags.join(", ")
              : "-"
          }
        />

        <Item label="Featured" value={product.isFeatured ? "Yes" : "No"} />

        <Item
          label="Material"
          value={
            Array.isArray(product.material) && product.material.length
              ? product.material.join(", ")
              : "-"
          }
        />

        <Item
          label="Pattern(s)"
          value={
            Array.isArray(product.pattern) && product.pattern.length
              ? product.pattern.join(", ")
              : "-"
          }
        />

        <Item
          label="Finish"
          value={
            Array.isArray(product.finish) && product.finish.length
              ? product.finish.join(", ")
              : "-"
          }
        />

        <Item label="Coverage Area" value={showOrDash(product.coverageArea)} />
        <Item label="Slug" value={product.slug} />
      </div>
    </div>
  );
}

// Sub-component for showing label + value
function Item({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs text-gray-500">{label}:</span>
      <span className="font-medium text-xs text-right">{value}</span>
    </div>
  );
}
