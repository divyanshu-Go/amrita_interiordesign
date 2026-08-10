// config/productAttributes.js

export const PRODUCT_ATTRIBUTES = {
  COLORS: [
    { label: "Black", hex: "#000000" },
    { label: "White", hex: "#FFFFFF" },
    { label: "Dark Brown", hex: "#8B4513" },
    { label: "Light Brown / Wood", hex: "#D2B48C" },
    { label: "Grey", hex: "#808080" },
    { label: "Beige", hex: "#F5F5DC" },
    { label: "Gold / Brass", hex: "#FFD700" },
    { label: "Red", hex: "#FF0000" },
    { label: "Blue", hex: "#0000FF" },
    { label: "Green", hex: "#008000" },
  ],

  BRANDS: [
    "Interio97",
    "LuxeInteriors",
    "RoyalPanel",
    "DecoWood",
    "EuroStyle",
  ],

  MATERIALS: [
    "PVC",
    "WPC",
    "Charcoal",
    "MDF",
    "HDF",
    "Acoustic Wood",
    "Fluted Panel",
  ],

  THICKNESSES: [3, 5, 8, 12, 15, 18],

  PATTERNS: [
    "Wooden Grain",
    "Marble",
    "Granite",
    "Fluted",
    "Solid",
    "Geometric",
    "Textured",
  ],

  FINISHES: [
    "Matte",
    "Glossy",
    "High Gloss",
    "Satin",
    "Textured",
  ],

  SIZES: [
    "8ft × 4ft",
    "9.5ft × 5inch",
    "9.5ft × 6inch",
    "2ft × 2ft",
    "48 × 8 inch",
  ],
};

// Defensive helper: Get label for a given Hex code
export function getColorLabel(hexCode) {
  if (!hexCode) return "";

  // Handle case if an array or object accidentally reaches here
  const targetHex = Array.isArray(hexCode) ? hexCode[0] : hexCode;

  if (typeof targetHex !== "string") return String(targetHex || "");

  const match = PRODUCT_ATTRIBUTES.COLORS.find(
    (c) => c.hex.toLowerCase() === targetHex.toLowerCase()
  );

  return match ? match.label : targetHex;
}