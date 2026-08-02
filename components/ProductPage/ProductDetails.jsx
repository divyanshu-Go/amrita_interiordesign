// components/customer/ProductDetails.jsx
import {
  FileText, Palette, Ruler, Layers, Sparkles, SquareCheck,
} from "lucide-react";
import ApplicationsGallery from "./ApplicationsGallery";

const buildAttributes = (product) => [
  { label: "Color",         value: product.color,                                        icon: Palette,     show: !!product.color },
  { label: "Size",          value: product.size,                                         icon: Ruler,       show: !!product.size },
  { label: "Thickness",     value: product.thickness ? `${product.thickness}mm` : null, icon: Layers,      show: !!product.thickness },
  { label: "Material",      value: product.material?.join(", "),                         icon: SquareCheck, show: product.material?.length > 0 },
  { label: "Pattern",       value: product.pattern?.join(", "),                          icon: Sparkles,    show: product.pattern?.length > 0 },
  { label: "Finish",        value: product.finish?.join(", "),                           icon: Palette,     show: product.finish?.length > 0 },
  { label: "Coverage Area", value: product.coverageArea,                                 icon: SquareCheck, show: !!product.coverageArea },
];

export default function ProductDetails({ product }) {
  const attrs          = buildAttributes(product).filter((a) => a.show);
  const hasApplications = product.application?.length > 0;

  if (!product.description && attrs.length === 0 && !hasApplications) return null;

  return (
    <div className="mb-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 relative overflow-hidden">

        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #555 0.5px, transparent 0.5px)",
            backgroundSize:  "12px 12px",
          }}
        />

        <div className="relative z-10 space-y-4">

          {/* Description */}
          {product.description && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <h3 className="text-sm font-bold text-gray-900">Description</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {product.description && attrs.length > 0 && (
            <div className="h-px bg-gray-200" />
          )}

          {/* Specifications */}
          {attrs.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {attrs.map((attr, idx) => {
                  const Icon = attr.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 flex items-start gap-2"
                    >
                      <Icon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">
                          {attr.label}
                        </p>
                        <p className="text-xs text-gray-900 capitalize font-medium break-words mt-0.5">
                          {attr.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Applications */}
          {hasApplications && (
            <ApplicationsGallery applications={product.application} />
          )}

        </div>
      </div>
    </div>
  );
}