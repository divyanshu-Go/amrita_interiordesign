"use client";

export default function MarbleSheetSubTypeSelector({ currentSubType, onSelect }) {
  const options = [
    { value: "", label: "All" },
    { value: "self-adhesive", label: "Self Adhesive" },
    { value: "non-adhesive", label: "Non Adhesive" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <span className="text-sm font-medium text-gray-600">Type:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`px-5 py-2 rounded-lg text-sm font-semibold border-2 transition-all duration-150
            ${currentSubType === opt.value
              ? "bg-orange-500 border-orange-500 text-white shadow"
              : "bg-white border-gray-200 text-gray-700 hover:border-orange-300"
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}